using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Appointments;
using Shifa.API.Services;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System.Security.Claims;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PrayerTimeService _prayerService;

        public AppointmentsController(AppDbContext context, PrayerTimeService prayerService)
        {
            _context = context;
            _prayerService = prayerService;
        }

        // ==========================================
        // 1. حجز موعد جديد (للمريض)
        // ==========================================
        [HttpPost]
        [Authorize(Roles = AppRoles.Patient)]
        public async Task<IActionResult> BookAppointment(CreateAppointmentDto data)
        {
            var patientIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(patientIdStr, out Guid patientId)) return Unauthorized();

            if (data.AppointmentDate <= DateTime.UtcNow)
                return BadRequest("لا يمكن حجز موعد في الماضي.");

            // [تعديل]: جلب الخدمة من الجدول الأساسي والتأكد أنها تابعة لهذا الطبيب
            var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceID == data.ServiceID && s.DoctorID == data.DoctorID);
            if (service == null || !service.IsActive) return NotFound("الخدمة المطلوبة غير موجودة أو غير مفعلة.");

            // [تعديل]: استخدام DurationMinutes بدلاً من Default
            var endTime = data.AppointmentDate.AddMinutes(service.DurationMinutes);
            var dayOfWeek = (int)data.AppointmentDate.DayOfWeek;
            var timeOfDay = data.AppointmentDate.TimeOfDay;
            var endTimeOfDay = endTime.TimeOfDay;

            if (await _prayerService.IsDuringPrayerTimeAsync(data.AppointmentDate, endTime))
            {
                return BadRequest("نعتذر، الموعد يتزامن مع وقت الصلاة.");
            }

            var isWorking = await _context.DoctorAvailabilities.AnyAsync(a =>
                a.DoctorID == data.DoctorID &&
                a.DayOfWeek == dayOfWeek &&
                a.StartTime <= timeOfDay && 
                a.EndTime >= endTimeOfDay   
            );

            if (!isWorking)
                return BadRequest("الطبيب غير متاح في هذا التوقيت (خارج ساعات العمل).");

            var isBusy = await _context.Appointments.AnyAsync(a =>
                a.DoctorID == data.DoctorID &&
                a.AppointmentDate < endTime && 
                a.AppointmentDate.AddMinutes(service.DurationMinutes) > data.AppointmentDate 
            );

            if (isBusy)
                return BadRequest("الطبيب مشغول بموعد آخر في هذه الفترة.");

            var appointment = new Appointment
            {
                PatientID = patientId,
                DoctorID = data.DoctorID,
                ServiceID = data.ServiceID,
                AppointmentDate = data.AppointmentDate,
                Status = "Pending", 
                Notes = data.Notes
            };

            // [تعديل]: استخدام Price بدلاً من BasePrice
            var invoice = new Invoice
            {
                InvoiceID = Guid.NewGuid(),
                PatientID = patientId,
                AppointmentID = appointment.AppointmentID, 
                TotalAmount = service.Price, 
                IssueDate = DateTime.UtcNow,
                IsPaid = false,
                PaymentMethod = "Cash"
            };

            appointment.Invoice = invoice;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حجز الموعد بنجاح", appointmentId = appointment.AppointmentID });
        }

        // ==========================================
        // 2. عرض مواعيدي (للمريض أو الطبيب)
        // ==========================================
        [HttpGet("my-appointments")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (!Guid.TryParse(userIdStr, out Guid userId)) return Unauthorized();

            var query = _context.Appointments
                .Include(a => a.Doctor) 
                .Include(a => a.Patient).ThenInclude(p => p.User) 
                .Include(a => a.Service)
                .Include(a => a.Invoice) 
                .AsQueryable();

            if (role == AppRoles.Patient)
            {
                query = query.Where(a => a.PatientID == userId);
            }
            else if (role == AppRoles.Doctor)
            {
                query = query.Where(a => a.DoctorID == userId);
            }

            var appointments = await query
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    AppointmentID = a.AppointmentID,
                    DoctorName = a.Doctor.FullName,
                    PatientName = a.Patient.User.FullName,
                    ServiceName = a.Service.ServiceName,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Price = a.Invoice != null ? a.Invoice.TotalAmount : 0
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // ==========================================
        // 3. API لجلب المواعيد المتاحة (Slots)
        // ==========================================
        [HttpGet("available-slots")]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<SlotDto>>> GetAvailableSlots(
            [FromQuery] Guid doctorId,
            [FromQuery] Guid serviceId,
            [FromQuery] DateTime date)
        {
            // [تعديل]: البحث في جدول Services بدلاً من DoctorServices
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.DoctorID == doctorId && s.ServiceID == serviceId);

            if (service == null || !service.IsActive)
                return BadRequest("هذا الطبيب لا يقدم هذه الخدمة حالياً.");

            int duration = service.DurationMinutes;

            int dayOfWeek = (int)date.DayOfWeek;
            var availability = await _context.DoctorAvailabilities
                .FirstOrDefaultAsync(d => d.DoctorID == doctorId && d.DayOfWeek == dayOfWeek);

            if (availability == null)
                return Ok(new List<SlotDto>()); 

            var blockers = new List<Shifa.API.Services.TimeRange>();

            // [تعديل]: جلب المواعيد المحجوزة مسبقاً لحساب الحواجز
            var exactBooked = await _context.Appointments
                .Include(a => a.Service) 
                .Where(a => a.DoctorID == doctorId && a.AppointmentDate.Date == date.Date && a.Status != "Cancelled")
                .ToListAsync();

            foreach (var app in exactBooked)
            {
                blockers.Add(new Shifa.API.Services.TimeRange
                {
                    Start = app.AppointmentDate,
                    End = app.AppointmentDate.AddMinutes(app.Service.DurationMinutes) // [تعديل] 
                });
            }

            var prayerBlockers = await _prayerService.GetPrayerBlockersAsync(date);
            blockers.AddRange(prayerBlockers);

            var slots = new List<SlotDto>();

            DateTime currentScanTime = date.Date.Add(availability.StartTime);
            DateTime shiftEnd = date.Date.Add(availability.EndTime);

            if (date.Date == DateTime.UtcNow.Date)
            {
                var now = DateTime.UtcNow.AddHours(2); 
                if (currentScanTime < now) currentScanTime = now;
            }

            while (currentScanTime.AddMinutes(duration) <= shiftEnd)
            {
                DateTime potentialEnd = currentScanTime.AddMinutes(duration);

                var conflict = blockers.FirstOrDefault(b =>
                    (currentScanTime < b.End && potentialEnd > b.Start));

                if (conflict == null)
                {
                    slots.Add(new SlotDto
                    {
                        StartTime = currentScanTime,
                        EndTime = potentialEnd,
                        Price = service.Price // [تعديل]
                    });

                    currentScanTime = potentialEnd;
                }
                else
                {
                    if (conflict.End > currentScanTime)
                    {
                        currentScanTime = conflict.End;
                    }
                    else
                    {
                        currentScanTime = currentScanTime.AddMinutes(5);
                    }
                }
            }

            return Ok(slots);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(Guid id)
        {
            // 1. البحث عن الموعد
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound("الموعد غير موجود في النظام.");

            // 2. التحقق من هوية المستخدم (حماية أمنية)
            // نمنع أي شخص من إلغاء موعد شخص آخر، إلا إذا كان هو المريض نفسه أو الطبيب
            var currentUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(currentUserIdStr, out Guid currentUserId))
            {
                // إذا لم يكن هو المريض صاحب الموعد، ولم يكن هو الطبيب، نرفض الطلب
                if (appointment.PatientID != currentUserId && appointment.DoctorID != currentUserId)
                {
                    return Forbid("غير مصرح لك بإلغاء هذا الموعد.");
                }
            }

            // 3. التحقق من حالة الموعد الحالية
            if (appointment.Status == "Cancelled" || appointment.AppointmentStatus == "Cancelled")
                return BadRequest("هذا الموعد ملغي بالفعل.");

            if (appointment.Status == "Completed")
                return BadRequest("لا يمكن إلغاء موعد مكتمل.");

            // 4. تنفيذ الإلغاء
            appointment.Status = "Cancelled";
            appointment.AppointmentStatus = "Cancelled";

            // يمكنك هنا إضافة كود لإرسال إشعار (Notification) للطبيب أو المريض بإلغاء الموعد

            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم إلغاء الموعد بنجاح" });
        }
    }
}