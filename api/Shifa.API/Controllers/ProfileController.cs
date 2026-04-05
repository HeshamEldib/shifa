using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Profile;
using Shifa.Infrastructure.Data;
using System.Security.Claims;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 حماية: لا يمكن الدخول هنا بدون Token
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
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
                .FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null) return NotFound("المستخدم غير موجود.");

            var profileData = new UserProfileDto
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Gender = user.Gender,
                Country = user.Country,
                Age = user.Age,
                Role = user.Role.RoleName
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

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("المستخدم غير موجود.");

            // تحديث الحقول الجديدة
            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Gender = dto.Gender;
            user.Country = dto.Country;
            user.Age = dto.Age;

            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تحديث البيانات بنجاح" });
        }
    }
}