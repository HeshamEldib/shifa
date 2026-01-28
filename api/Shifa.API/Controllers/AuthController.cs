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

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                PasswordHash = passwordHash,
                PhoneNumber = newUser.PhoneNumber,
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
                    DateOfBirth = DateTime.MinValue, // قيمة افتراضية حتى يكمل بياناته
                    Gender = "NotSet"
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
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                PasswordHash = passwordHash,
                PhoneNumber = newUser.PhoneNumber,
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
                new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName), // الاسم
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
    }
}
