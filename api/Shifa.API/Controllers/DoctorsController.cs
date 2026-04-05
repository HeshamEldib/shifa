using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Doctors;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System.Security.Claims;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. عرض قائمة جميع الأطباء (متاح للجميع)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetAllDoctors()
        {
            var doctors = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName == AppRoles.Doctor)
                .Select(u => new DoctorDto
                {
                    DoctorID = u.UserID,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone
                })
                .ToListAsync();

            return Ok(doctors);
        }

        // 2. إضافة موعد عمل جديد (للطبيب نفسه فقط)
        [HttpPost("availability")]
        [Authorize(Roles = AppRoles.Doctor)]
        public async Task<IActionResult> AddAvailability([FromBody] AvailabilityDto data)
        {
            // استخراج الـ ID الخاص بالطبيب المسجل حالياً من التوكن
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userId, out Guid doctorId))
            {
                return Unauthorized();
            }

            // التحقق من منطقية الوقت
            if (data.StartTime >= data.EndTime)
            {
                return BadRequest("وقت البدء يجب أن يكون قبل وقت الانتهاء.");
            }

            // منع التداخل (Overlapping) في المواعيد لنفس الطبيب في نفس اليوم
            bool isOverlapping = await _context.DoctorAvailabilities.AnyAsync(a =>
                a.DoctorID == doctorId &&
                a.DayOfWeek == data.DayOfWeek &&
                ((data.StartTime >= a.StartTime && data.StartTime < a.EndTime) || // بداية الموعد الجديد تقع داخل موعد قديم
                 (data.EndTime > a.StartTime && data.EndTime <= a.EndTime) ||     // نهاية الموعد الجديد تقع داخل موعد قديم
                 (data.StartTime <= a.StartTime && data.EndTime >= a.EndTime)));  // الموعد الجديد يحتوي الموعد القديم بالكامل

            if (isOverlapping)
            {
                return BadRequest("يوجد تعارض مع موعد آخر مسجل في نفس التوقيت.");
            }

            var availability = new DoctorAvailability
            {
                DoctorID = doctorId,
                DayOfWeek = data.DayOfWeek,
                StartTime = data.StartTime,
                EndTime = data.EndTime,
                //IsAvailable = true
            };

            _context.DoctorAvailabilities.Add(availability);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تمت إضافة الموعد بنجاح", id = availability.AvailabilityID });
        }

        // 3. عرض مواعيد عمل طبيب محدد (متاح للجميع)
        [HttpGet("{doctorId}/availability")]
        public async Task<ActionResult<IEnumerable<AvailabilityDto>>> GetDoctorAvailability(Guid doctorId)
        {
            // التأكد من أن الـ ID يخص طبيباً
            var isDoctor = await _context.Users
                .AnyAsync(u => u.UserID == doctorId && u.Role.RoleName == AppRoles.Doctor);

            if (!isDoctor) return NotFound("الطبيب غير موجود.");

            var schedule = await _context.DoctorAvailabilities
                .Where(a => a.DoctorID == doctorId)
                .OrderBy(a => a.DayOfWeek)
                .ThenBy(a => a.StartTime)
                .Select(a => new AvailabilityDto
                {
                    AvailabilityID = a.AvailabilityID,
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime
                })
                .ToListAsync();

            return Ok(schedule);
        }

        // 4. حذف موعد عمل (للطبيب صاحب الموعد فقط)
        [HttpDelete("availability/{availabilityId}")]
        [Authorize(Roles = AppRoles.Doctor)]
        public async Task<IActionResult> DeleteAvailability(Guid availabilityId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userId, out Guid doctorId)) return Unauthorized();

            var slot = await _context.DoctorAvailabilities.FindAsync(availabilityId);

            if (slot == null) return NotFound("الموعد غير موجود.");

            // أمان: التأكد أن الطبيب لا يحذف مواعيد طبيب آخر
            if (slot.DoctorID != doctorId) return Forbid("ليس لديك صلاحية لحذف هذا الموعد.");

            _context.DoctorAvailabilities.Remove(slot);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
