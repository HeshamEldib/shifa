using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.DoctorServices;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System.Security.Claims;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = AppRoles.Doctor)]
    public class DoctorServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorServicesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. عرض خدماتي (للطبيب)
        [HttpGet("my-services")]
        public async Task<ActionResult<IEnumerable<DoctorServiceResponseDto>>> GetMyServices()
        {
            var doctorId = GetCurrentUserId();
            var services = await _context.Services
                .Where(s => s.DoctorID == doctorId)
                .Select(s => new DoctorServiceResponseDto
                {
                    ServiceID = s.ServiceID,
                    ServiceName = s.ServiceName,
                    Category = s.Category,
                    Rating = s.Rating,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes,
                    IsActive = s.IsActive
                }).ToListAsync();

            return Ok(services);
        }

        // 2. إضافة خدمة جديدة
        [HttpPost]
        public async Task<IActionResult> AddService(AddDoctorServiceDto dto)
        {
            var doctorId = GetCurrentUserId();

            var service = new Service
            {
                ServiceID = Guid.NewGuid(),
                DoctorID = doctorId,
                ServiceName = dto.ServiceName,
                Category = dto.Category,
                Price = dto.Price,
                DurationMinutes = dto.DurationMinutes,
                Rating = 0.0,
                IsActive = true
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تمت إضافة الخدمة بنجاح", id = service.ServiceID });
        }

        // 3. تعديل خدمة قائمة
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] AddDoctorServiceDto dto)
        {
            var doctorId = GetCurrentUserId();
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceID == id && s.DoctorID == doctorId);

            if (service == null) return NotFound("الخدمة غير موجودة.");

            service.ServiceName = dto.ServiceName;
            service.Category = dto.Category;
            service.Price = dto.Price;
            service.DurationMinutes = dto.DurationMinutes;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث تفاصيل الخدمة بنجاح" });
        }

        // 4. تفعيل/إيقاف خدمة
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(Guid id)
        {
            var doctorId = GetCurrentUserId();
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceID == id && s.DoctorID == doctorId);

            if (service == null) return NotFound("الخدمة غير موجودة.");

            service.IsActive = !service.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تغيير حالة الخدمة", isActive = service.IsActive });
        }

        // 5. حذف خدمة
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveService(Guid id)
        {
            var doctorId = GetCurrentUserId();
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceID == id && s.DoctorID == doctorId);

            if (service == null) return NotFound("الخدمة غير موجودة.");

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 6. عرض خدمات طبيب محدد (عام - للمرضى والزوار)
        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<DoctorServiceResponseDto>>> GetServicesByDoctor(Guid doctorId)
        {
            var services = await _context.Services
                .Where(s => s.DoctorID == doctorId && s.IsActive)
                .Select(s => new DoctorServiceResponseDto
                {
                    ServiceID = s.ServiceID,
                    ServiceName = s.ServiceName,
                    Category = s.Category,
                    Rating = s.Rating,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes,
                    IsActive = s.IsActive,
                    DoctorName = _context.Users.FirstOrDefault(u => u.UserID == s.DoctorID) != null 
                                ? _context.Users.FirstOrDefault(u => u.UserID == s.DoctorID)!.FullName 
                                : "طبيب غير معروف"
                })
                .ToListAsync();

            return Ok(services);
        }

        private Guid GetCurrentUserId()
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(idStr!);
        }
    }
}