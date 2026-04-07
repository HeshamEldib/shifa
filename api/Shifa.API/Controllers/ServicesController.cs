using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Services;
using Shifa.Infrastructure.Data;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. عرض كافة الخدمات في النظام (عام للمرضى والزوار)
        // ==========================================
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServices()
        {
            var services = await _context.Services
                .Where(s => s.IsActive)
                .Select(s => new ServiceDto
                {
                    ServiceID = s.ServiceID,
                    ServiceName = s.ServiceName,
                    Category = s.Category,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes,
                    Rating = s.Rating,
                    DoctorID = s.DoctorID,
                    
                    // نجلب اسم الطبيب من جدول المستخدمين المرتبط به
                    DoctorName = _context.Users.FirstOrDefault(u => u.UserID == s.DoctorID) != null 
                                 ? _context.Users.FirstOrDefault(u => u.UserID == s.DoctorID)!.FullName 
                                 : "طبيب غير معروف"
                })
                .ToListAsync();

            return Ok(services);
        }

        // ==========================================
        // 2. عرض تفاصيل خدمة محددة
        // ==========================================
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceDto>> GetServiceById(Guid id)
        {
            var service = await _context.Services
                .Where(s => s.ServiceID == id && s.IsActive)
                .Select(s => new ServiceDto
                {
                    ServiceID = s.ServiceID,
                    ServiceName = s.ServiceName,
                    Category = s.Category,
                    Price = s.Price,
                    DurationMinutes = s.DurationMinutes,
                    Rating = s.Rating,
                    DoctorID = s.DoctorID,
                    DoctorName = _context.Users.FirstOrDefault(u => u.UserID == s.DoctorID) != null 
                                ? _context.Users.FirstOrDefault(u => u.UserID == s.DoctorID)!.FullName 
                                : "طبيب غير معروف"
                })
                .FirstOrDefaultAsync();

            if (service == null) return NotFound("الخدمة المطلوبة غير موجودة أو غير مفعلة.");

            return Ok(service);
        }
    }
}