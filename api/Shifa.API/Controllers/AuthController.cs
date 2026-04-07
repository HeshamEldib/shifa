using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using Shifa.API.Dtos.Auth;
using BCrypt.Net;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Shifa.Core.Constants;
using Shifa.API.Services;
using Microsoft.Extensions.Caching.Memory;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, IConfiguration configuration, IMemoryCache cache, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _cache = cache;
            _emailService = emailService;
        }

        // ====================================================
        // 1. تسجيل مريض جديد (عام - Public)
        // ====================================================
        [HttpPost("register-patient")]
        public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientDto newUser)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _context.Users.AnyAsync(u => u.Email == newUser.Email))
                return BadRequest("البريد الإلكتروني مسجل بالفعل.");

            // تشفير كلمة المرور
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == AppRoles.Patient);
            if (role == null)
            {
                return StatusCode(500, "خطأ داخلي: دور المريض غير موجود في النظام.");
            }

            var patientUser = new User
            {
                FullName = newUser.FullName,
                Email = newUser.Email,
                PasswordHash = passwordHash,
                Phone = newUser.Phone,
                RoleID = role.RoleID,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            try
            {
                // الخطوة 1: حفظ المستخدم الأساسي
                _context.Users.Add(patientUser);
                await _context.SaveChangesAsync();

                // الخطوة 2: إنشاء ملف مريض فارغ (Patient Profile)
                // هذه خطوة مهمة جداً لضمان التكامل المرجعي (1:1)
                var patientProfile = new Patient
                {
                    PatientID = patientUser.UserID, // نفس الـ ID
                    DateOfBirth = new DateTime(2000, 1, 1), // قيمة افتراضية حتى يكمل بياناته
                    // Gender = "NotSet"
                };
                _context.Patients.Add(patientProfile);
                await _context.SaveChangesAsync();

                return Ok(new { message = "تم تسجيل حساب المريض بنجاح", userId = patientUser.UserID });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"خطأ في الخادم: {ex.Message}");
            }
        }

        // ====================================================
        // 2. تسجيل موظف جديد (محمي - Admin Only)
        // ====================================================
        // TODO: أضف [Authorize(Roles = "Admin")] هنا بعد الانتهاء من Login
        [HttpPost("register-staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffDto newUser)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // منع تسجيل مريض من هذه البوابة لتقليل الخطأ البشري
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == AppRoles.Patient);
            if (role == null)
            {
                return StatusCode(500, "خطأ داخلي: دور المريض غير موجود في النظام.");
            }
            if (newUser.RoleID == role.RoleID)
                return BadRequest("استخدم بوابة تسجيل المرضى لهذا الغرض.");

            if (await _context.Users.AnyAsync(u => u.Email == newUser.Email))
                return BadRequest("البريد الإلكتروني مسجل بالفعل.");

            // التأكد من وجود الدور
            if (!await _context.Roles.AnyAsync(r => r.RoleID == newUser.RoleID))
                return BadRequest("الدور المختار غير صحيح.");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            var staffUser = new User
            {
                FullName = newUser.FullName,
                Email = newUser.Email,
                PasswordHash = passwordHash,
                Phone = newUser.Phone,
                Gender = newUser.Gender,
                Country = newUser.Country,
                Age = newUser.Age,
                RoleID = newUser.RoleID,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            try
            {
                _context.Users.Add(staffUser);
                await _context.SaveChangesAsync();

                // هنا لا ننشئ ملف Patient لأن هذا طبيب أو موظف

                return Ok(new { message = "تم تسجيل الموظف بنجاح", userId = staffUser.UserID, roleId = staffUser.RoleID });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"خطأ أثناء الحفظ: {ex.Message}");
            }
        }

        // ====================================================
        // login
        // ====================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // 1. البحث عن المستخدم
            var user = await _context.Users
                .Include(u => u.Role) // مهم جداً: نحتاج معرفة دوره (طبيب أم مريض)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            // 2. التحقق من وجود المستخدم وصحة كلمة المرور
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
            }

            // التحقق من أن المفتاح السري موجود
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                return StatusCode(500, "خطأ داخلي: مفتاح التشفير غير موجود.");
            }

            // 3. تجهيز المعلومات التي سنضعها داخل التوكن (Claims)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()), // id
                new Claim(ClaimTypes.Name, user.FullName), // الاسم
                new Claim(ClaimTypes.Email, user.Email), // الايميل
                new Claim(ClaimTypes.Role, user.Role.RoleName) // الدور (مهم جداً للصلاحيات)
            };

            // 4. إنشاء مفتاح التشفير
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 5. إنشاء التوكن
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // 6. إرجاع التوكن للفرونت إند
            return Ok(new
            {
                token = tokenString,
                userId = user.UserID,
                role = user.Role.RoleName,
                expiration = token.ValidTo
            });
        }

        // ====================================================
        // 4. طلب استعادة كلمة المرور (إنشاء OTP)
        // ====================================================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return BadRequest(new { message = "البريد الإلكتروني غير مسجل لدينا." });

            // إنشاء كود مكون من 6 أرقام عشوائية
            string otp = new Random().Next(100000, 999999).ToString();

            // حفظ الكود في الذاكرة لمدة 15 دقيقة، مرتبطاً بالإيميل
            _cache.Set(dto.Email, otp, TimeSpan.FromMinutes(15));

            // محتوى الإيميل (بتصميم بسيط)
            string emailBody = $@"
    <div style='font-family: Arial, sans-serif; text-align: right; direction: rtl;'>
        <h2 style='color: #2E86C1;'>تطبيق شفاء</h2>
        <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
        <p>كود التحقق الخاص بك هو: <strong style='font-size: 24px; color: #E74C3C;'>{otp}</strong></p>
        <p>هذا الكود صالح لمدة 15 دقيقة فقط.</p>
        <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
    </div>";

            // إرسال الإيميل فعلياً
            try
            {
                await _emailService.SendEmailAsync(dto.Email, "كود استعادة كلمة المرور - تطبيق شفاء", emailBody);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً." });
            }

            return Ok(new { message = "تم إرسال كود التحقق إلى بريدك الإلكتروني بنجاح." });
        }

        // ====================================================
        // 5. إعادة تعيين كلمة المرور
        // ====================================================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            // 1. التأكد من أن الكود موجود في الذاكرة ولم تنتهِ صلاحيته
            if (!_cache.TryGetValue(dto.Email, out string? savedOtp))
            {
                return BadRequest(new { message = "كود التحقق منتهي الصلاحية أو غير موجود. يرجى طلب كود جديد." });
            }

            // 2. مطابقة الكود
            if (savedOtp != dto.OTP)
            {
                return BadRequest(new { message = "كود التحقق غير صحيح." });
            }

            // 3. جلب المستخدم وتحديث كلمة المرور
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return BadRequest(new { message = "حدث خطأ غير متوقع." });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            // 4. مسح الكود من الذاكرة حتى لا يتم استخدامه مرة أخرى
            _cache.Remove(dto.Email);

            return Ok(new { message = "تم تغيير كلمة المرور بنجاح." });
        }
    }
}
