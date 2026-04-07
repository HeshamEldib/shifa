using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Shifa.API.Dtos.Profile;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using Shifa.API.Services;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 حماية: لا يمكن الدخول هنا بدون Token
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFileService _fileService;

        public ProfileController(AppDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        // ==========================================
        // 1. جلب بيانات الملف الشخصي (GET)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            // استخراج الـ ID الخاص بالمستخدم من التوكن نفسه (أمان عالي)
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out Guid userId)) return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Doctor)
                .Include(u => u.Patient)
                .FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null) return NotFound("المستخدم غير موجود.");

            var profileData = new UserProfileDto
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Gender = user.Gender,
                Country = user.Country,
                Address = user.Address,
                Age = user.Age,
                Role = user.Role.RoleName ?? "User",
                Image = user.Image,

                // بيانات خاصة بالطبيب (إذا كان الطبيب)
                Specialization = user.Doctor?.Specialization,
                Specialty = user.Doctor?.Specialty,
                Quote = user.Doctor?.Quote,
                Bio = user.Doctor?.Bio,
                ExperienceYears = user.Doctor?.ExperienceYears,
                Rating = user.Doctor?.Rating,
                PatientsCount = user.Doctor?.PatientsCount ?? 0,

                // بيانات خاصة بالمريض (إذا كان المريض)
                DateOfBirth = user.Patient != null ? user.Patient.DateOfBirth : DateTime.Now,
                BloodType = user.Patient != null ? user.Patient.BloodType : string.Empty,
                Job = user.Patient != null ? user.Patient.Job : string.Empty,
                EmergencyContact = user.Patient != null ? user.Patient.EmergencyContact : string.Empty,
                Weight = user.Patient != null ? user.Patient.Weight : 0,
                Height = user.Patient != null ? user.Patient.Height : 0,
                PatientNotes = user.Patient != null ? user.Patient.PatientNotes : string.Empty
            };

            return Ok(profileData);
        }

        // ==========================================
        // 2. تحديث بيانات الملف الشخصي (PUT)
        // ==========================================
        [HttpPut]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out Guid userId)) return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Doctor)
                .Include(u => u.Patient)
                .FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null) return NotFound("المستخدم غير موجود.");

            // تحديث الحقول الجديدة
            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Gender = dto.Gender;
            user.Country = dto.Country;
            user.Address = dto.Address;
            user.Age = dto.Age;
            // user.Image = dto.Image;

            // إذا كان المستخدم طبيب، حدث بيانات الطبيب
            if (user.Role?.RoleName == "Doctor")
            {
                if (user.Doctor == null)
                {
                    user.Doctor = new Doctor { DoctorID = user.UserID };
                    _context.Doctors.Add(user.Doctor);
                }

                if (!string.IsNullOrEmpty(dto.Specialization))
                    user.Doctor.Specialization = dto.Specialization;

                if (!string.IsNullOrEmpty(dto.Specialty))
                    user.Doctor.Specialty = dto.Specialty;

                if (!string.IsNullOrEmpty(dto.Quote))
                    user.Doctor.Quote = dto.Quote;

                if (!string.IsNullOrEmpty(dto.Bio))
                    user.Doctor.Bio = dto.Bio;

                if (dto.ExperienceYears.HasValue)
                    user.Doctor.ExperienceYears = dto.ExperienceYears.Value;
            }

            // إذا كان المستخدم المريض، حدث بيانات المريض
            if (user.Role?.RoleName == "Patient")
            {
                if (user.Patient == null)
                {
                    user.Patient = new Patient { PatientID = user.UserID };
                    _context.Patients.Add(user.Patient);
                }

                user.Patient.DateOfBirth = dto.DateOfBirth;
                user.Patient.BloodType = dto.BloodType;
                user.Patient.Job = dto.Job;
                user.Patient.EmergencyContact = dto.EmergencyContact;
                user.Patient.Weight = dto.Weight;
                user.Patient.Height = dto.Height;
                user.Patient.PatientNotes = dto.PatientNotes;
            }



            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تحديث البيانات بنجاح" });
        }



        // ==========================================
        // 3. رفع وتحديث الصورة الشخصية (POST)
        // ==========================================
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            // التحقق من أن المستخدم أرسل ملفاً فعلاً
            if (file == null || file.Length == 0)
                return BadRequest("يرجى اختيار صورة.");

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out Guid userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("المستخدم غير موجود.");

            try
            {
                // 👈 1. مسح الصورة القديمة من السيرفر (إذا كان المستخدم يمتلك صورة سابقة)
                if (!string.IsNullOrEmpty(user.Image))
                {
                    _fileService.DeleteFile(user.Image);
                }

                // حفظ الصورة في مجلد uploads/profiles داخل wwwroot
                var imageUrl = await _fileService.SaveFileAsync(file, "uploads/profiles");

                // تحديث حقل الصورة في قاعدة البيانات بالمسار الجديد
                user.Image = imageUrl; // إذا كان اسم الحقل ProfilePicture، قم بتعديله هنا
                await _context.SaveChangesAsync();

                return Ok(new { message = "تم تحديث الصورة بنجاح", imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"حدث خطأ أثناء رفع الصورة: {ex.Message}");
            }
        }
    }
}