using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Services;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
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

        // 1. عرض كافة الخدمات مع الأطباء المتاحين
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceWithDoctorsDto>>> GetServices()
        {
            var services = await _context.Services
                .Select(s => new ServiceWithDoctorsDto
                {
                    ServiceID = s.ServiceID,
                    ServiceName = s.ServiceName,
                    BasePrice = s.BasePrice, // السعر العام (كمرجع)

                    // السحر هنا: جلب الأطباء من الجدول الوسيط
                    AvailableDoctors = s.DoctorServices
                        .Where(ds => ds.IsActive) // شرط: الخدمة مفعلة للطبيب
                        .Select(ds => new DoctorInfoForServiceDto
                        {
                            DoctorID = ds.DoctorID,
                            // دمج الاسم الأول والأخير
                            DoctorName = $"{ds.Doctor.FirstName} {ds.Doctor.LastName}",
                            Price = ds.Price, // السعر الخاص
                            DurationMinutes = ds.DurationMinutes // المدة الخاصة
                        })
                        .ToList()
                })
                // شرط إضافي: إظهار الخدمات التي لها طبيب واحد على الأقل (حسب طلبك)
                .Where(s => s.AvailableDoctors.Any())
                .ToListAsync();

            return Ok(services);
        }

        // 2. عرض خدمة واحدة بالتفصيل مع أطبائها
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceWithDoctorsDto>> GetService(Guid id)
        {
            var service = await _context.Services
                .Where(s => s.ServiceID == id)
                .Select(s => new ServiceWithDoctorsDto
                {
                    ServiceID = s.ServiceID,
                    ServiceName = s.ServiceName,
                    BasePrice = s.BasePrice,
                    AvailableDoctors = s.DoctorServices
                        .Where(ds => ds.IsActive)
                        .Select(ds => new DoctorInfoForServiceDto
                        {
                            DoctorID = ds.DoctorID,
                            DoctorName = $"{ds.Doctor.FirstName} {ds.Doctor.LastName}",
                            Price = ds.Price,
                            DurationMinutes = ds.DurationMinutes
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (service == null) return NotFound("الخدمة غير موجودة");

            return Ok(service);
        }

        // 3. إضافة خدمة جديدة (للأدمن فقط)
        [HttpPost]
        [Authorize(Roles = AppRoles.Admin)] // حماية: الأدمن فقط
        public async Task<ActionResult<ServiceDto>> CreateService(CreateServiceDto data)
        {
            var service = new Service
            {
                ServiceName = data.ServiceName,
                DefaultDurationMinutes = data.DefaultDurationMinutes,
                BasePrice = data.BasePrice
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            // إرجاع النتيجة
            var resultDto = new ServiceDto
            {
                ServiceID = service.ServiceID,
                ServiceName = service.ServiceName,
                BasePrice = service.BasePrice,
                DefaultDurationMinutes = service.DefaultDurationMinutes
            };

            return CreatedAtAction(nameof(GetService), new { id = service.ServiceID }, resultDto);
        }

        // 4. تعديل خدمة (للأدمن فقط)
        [HttpPut("{id}")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<IActionResult> UpdateService(Guid id, CreateServiceDto data)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            service.ServiceName = data.ServiceName;
            service.BasePrice = data.BasePrice;
            service.DefaultDurationMinutes = data.DefaultDurationMinutes;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 5. حذف خدمة (للأدمن فقط)
        [HttpDelete("{id}")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            // ملاحظة: قد نحتاج للتحقق هنا إذا كانت الخدمة مرتبطة بمواعيد سابقة قبل الحذف
            // لمنع حدوث خطأ في قاعدة البيانات، ولكن سنبقيها بسيطة الآن.

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
