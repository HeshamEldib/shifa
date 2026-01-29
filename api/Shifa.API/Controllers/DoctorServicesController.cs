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

        // 1. عرض خدماتي
        [HttpGet("my-services")]
        public async Task<ActionResult<IEnumerable<DoctorServiceResponseDto>>> GetMyServices()
        {
            var doctorId = GetCurrentUserId();

            var services = await _context.DoctorServices
                .Include(ds => ds.Service)
                .Where(ds => ds.DoctorID == doctorId)
                .Select(ds => new DoctorServiceResponseDto
                {
                    Id = ds.Id,
                    ServiceID = ds.ServiceID,
                    ServiceName = ds.Service.ServiceName,
                    Price = ds.Price,
                    DurationMinutes = ds.DurationMinutes,
                    IsActive = ds.IsActive
                })
                .ToListAsync();

            return Ok(services);
        }

        // 2. إضافة خدمة لقائمتي
        [HttpPost]
        public async Task<IActionResult> AddService(AddDoctorServiceDto dto)
        {
            var doctorId = GetCurrentUserId();

            // هل الخدمة موجودة أصلاً في النظام؟
            var globalService = await _context.Services.FindAsync(dto.ServiceID);
            if (globalService == null) return NotFound("الخدمة المطلوبة غير موجودة في النظام.");

            // هل أضفتها سابقاً؟
            var exists = await _context.DoctorServices.AnyAsync(ds => ds.DoctorID == doctorId && ds.ServiceID == dto.ServiceID);
            if (exists) return BadRequest("هذه الخدمة موجودة بالفعل في قائمتك.");

            var doctorService = new DoctorService
            {
                DoctorID = doctorId,
                ServiceID = dto.ServiceID,
                Price = dto.Price,
                DurationMinutes = dto.DurationMinutes,
                IsActive = true
            };

            _context.DoctorServices.Add(doctorService);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تمت إضافة الخدمة لقائمتك بنجاح", id = doctorService.Id });
        }

        // 3. تعديل خدمة (السعر أو المدة)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] AddDoctorServiceDto dto)
        {
            var doctorId = GetCurrentUserId();

            // التأكد أن السجل يخص هذا الطبيب
            var doctorService = await _context.DoctorServices
                .FirstOrDefaultAsync(ds => ds.Id == id && ds.DoctorID == doctorId);

            if (doctorService == null) return NotFound("الخدمة غير موجودة في قائمتك.");

            doctorService.Price = dto.Price;
            doctorService.DurationMinutes = dto.DurationMinutes;
            // ملاحظة: لا نعدل الـ ServiceID، لو أراد تغيير الخدمة يحذف ويضيف جديدة

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث تفاصيل الخدمة" });
        }

        // 4. تفعيل/إيقاف خدمة
        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(Guid id)
        {
            var doctorId = GetCurrentUserId();
            var doctorService = await _context.DoctorServices
                .FirstOrDefaultAsync(ds => ds.Id == id && ds.DoctorID == doctorId);

            if (doctorService == null) return NotFound();

            doctorService.IsActive = !doctorService.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تغيير حالة الخدمة", isActive = doctorService.IsActive });
        }

        // 5. حذف خدمة من قائمتي
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveService(Guid id)
        {
            var doctorId = GetCurrentUserId();
            var doctorService = await _context.DoctorServices
                .FirstOrDefaultAsync(ds => ds.Id == id && ds.DoctorID == doctorId);

            if (doctorService == null) return NotFound();

            _context.DoctorServices.Remove(doctorService);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // دالة مساعدة لاستخراج الـ ID من التوكن
        private Guid GetCurrentUserId()
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(idStr!);
        }
    }
}
