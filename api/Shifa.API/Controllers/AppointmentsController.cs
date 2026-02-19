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

        // 1. حجز موعد جديد (للمريض)
        [HttpPost]
        [Authorize(Roles = AppRoles.Patient)]
        public async Task<IActionResult> BookAppointment(CreateAppointmentDto data)
        {
            // أ. استخراج معرف المريض
            var patientIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(patientIdStr, out Guid patientId)) return Unauthorized();

            // ب. التأكد من أن الموعد في المستقبل
            if (data.AppointmentDate <= DateTime.UtcNow)
                return BadRequest("لا يمكن حجز موعد في الماضي.");

            // ج. جلب بيانات الخدمة (لمعرفة المدة والسعر)
            var service = await _context.Services.FindAsync(data.ServiceID);
            if (service == null) return NotFound("الخدمة المطلوبة غير موجودة.");

            // حساب وقت الانتهاء المتوقع
            var endTime = data.AppointmentDate.AddMinutes(service.DefaultDurationMinutes);
            var dayOfWeek = (int)data.AppointmentDate.DayOfWeek;
            var timeOfDay = data.AppointmentDate.TimeOfDay;
            var endTimeOfDay = endTime.TimeOfDay;

            // ========================================================
            // [جديد] التحقق من أوقات الصلاة باستخدام API + Settings Key-Value
            // ========================================================
            if (await _prayerService.IsDuringPrayerTimeAsync(data.AppointmentDate, endTime))
            {
                return BadRequest("نعتذر، الموعد يتزامن مع وقت الصلاة.");
            }

            // ========================================================
            // د. التحقق الأول: هل الطبيب يعمل في هذا الوقت أصلاً؟
            // ========================================================
            var isWorking = await _context.DoctorAvailabilities.AnyAsync(a =>
                a.DoctorID == data.DoctorID &&
                a.DayOfWeek == dayOfWeek &&
                a.StartTime <= timeOfDay && // يبدأ عمله قبل أو مع بداية الموعد
                a.EndTime >= endTimeOfDay   // ينتهي عمله بعد أو مع نهاية الموعد
            );

            if (!isWorking)
                return BadRequest("الطبيب غير متاح في هذا التوقيت (خارج ساعات العمل).");

            // ========================================================
            // هـ. التحقق الثاني: هل الطبيب مشغول مع مريض آخر؟
            // ========================================================
            // نبحث عن أي موعد يتقاطع مع الفترة المطلوبة
            var isBusy = await _context.Appointments.AnyAsync(a =>
                a.DoctorID == data.DoctorID &&
                a.AppointmentDate < endTime && // يبدأ قبل أن ينتهي موعدنا
                a.AppointmentDate.AddMinutes(service.DefaultDurationMinutes) > data.AppointmentDate // وينتهي بعد أن يبدأ موعدنا
            );

            if (isBusy)
                return BadRequest("الطبيب مشغول بموعد آخر في هذه الفترة.");

            // و. إنشاء الحجز
            var appointment = new Appointment
            {
                PatientID = patientId,
                DoctorID = data.DoctorID,
                ServiceID = data.ServiceID,
                AppointmentDate = data.AppointmentDate,
                Status = "Pending", // الحالة المبدئية
                Notes = "حجز عبر التطبيق"
            };

            // ز. إنشاء الفاتورة مبدئياً (Invoice) - اختياري الآن ولكن مفضل
            var invoice = new Invoice
            {
                InvoiceID = Guid.NewGuid(),
                PatientID = patientId,
                AppointmentID = appointment.AppointmentID, // الربط هنا
                TotalAmount = service.BasePrice,
                IssueDate = DateTime.UtcNow,
                IsPaid = false,
                PaymentMethod = "Cash"
            };

            // ربط الفاتورة بالموعد
            appointment.Invoice = invoice;

            _context.Appointments.Add(appointment);
            // Invoice ستضاف تلقائياً بسبب العلاقة

            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حجز الموعد بنجاح", appointmentId = appointment.AppointmentID });
        }

        // 2. عرض مواعيدي (للمريض أو الطبيب)
        [HttpGet("my-appointments")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (!Guid.TryParse(userIdStr, out Guid userId)) return Unauthorized();

            // الاستعلام يختلف حسب الدور
            var query = _context.Appointments
                .Include(a => a.Doctor) // للوصول لاسم الطبيب
                .Include(a => a.Patient).ThenInclude(p => p.User) // للوصول لاسم المريض
                .Include(a => a.Service)
                .Include(a => a.Invoice) // لجلب السعر
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
                    DoctorName = $"{a.Doctor.FirstName} {a.Doctor.LastName}",
                    PatientName = $"{a.Patient.User.FirstName} {a.Patient.User.LastName}",
                    ServiceName = a.Service.ServiceName,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Price = a.Invoice != null ? a.Invoice.TotalAmount : 0
                })
                .ToListAsync();

            return Ok(appointments);
        }


        // API لجلب المواعيد المتاحة (Slots)
        [HttpGet("available-slots")]
        [AllowAnonymous] // يمكن جعلها متاحة للزوار لرؤية المواعيد قبل التسجيل
        public async Task<ActionResult<IEnumerable<SlotDto>>> GetAvailableSlots(
            [FromQuery] Guid doctorId,
            [FromQuery] Guid serviceId,
            [FromQuery] DateTime date)
        {
            // 1. جلب تفاصيل الخدمة الخاصة بالطبيب (السعر والمدة)
            var docService = await _context.DoctorServices
                .FirstOrDefaultAsync(ds => ds.DoctorID == doctorId && ds.ServiceID == serviceId);

            if (docService == null || !docService.IsActive)
                return BadRequest("هذا الطبيب لا يقدم هذه الخدمة حالياً.");

            int duration = docService.DurationMinutes;

            // 2. جلب مواعيد عمل الطبيب لهذا اليوم
            int dayOfWeek = (int)date.DayOfWeek;
            var availability = await _context.DoctorAvailabilities
                .FirstOrDefaultAsync(d => d.DoctorID == doctorId && d.DayOfWeek == dayOfWeek);

            if (availability == null)
                return Ok(new List<SlotDto>()); // الطبيب إجازة اليوم

            // 3. تجهيز "قائمة الحواجز" (Blockers)
            // الحواجز هي: المواعيد المحجوزة مسبقاً + أوقات الصلاة
            var blockers = new List<Shifa.API.Services.TimeRange>();

            // أ. إضافة المواعيد المحجوزة كحواجز
            var bookedAppointments = await _context.Appointments
                .Where(a => a.DoctorID == doctorId
                         && a.AppointmentDate.Date == date.Date
                         && a.Status != "Cancelled") // تجاهل الملغاة
                .Select(a => new
                {
                    Start = a.AppointmentDate,
                    // نحتاج معرفة مدة الموعد المحجوز لحساب نهايته
                    // سنفترض هنا جلب مدة الخدمة المحجوزة، وللتبسيط سنعتبرها حاجزاً
                    End = a.AppointmentDate.AddMinutes(30) // تحسين: يفضل جلب مدة الخدمة الفعلية هنا
                })
                .ToListAsync();

            // ملاحظة: لتحسين دقة "bookedAppointments"، يجب عمل Join مع جدول Services لجلب مدة كل موعد بدقة.
            // لكن للتبسيط الآن سنعتمد الكود كما هو، ولاحقاً نعدله.

            foreach (var app in bookedAppointments)
            {
                // نحتاج لجلب مدة الخدمة الحقيقية للموعد المحجوز لتحديد نهايته بدقة
                // سأقوم بتحديث الاستعلام أعلاه ليكون أكثر دقة
            }

            // [تصحيح الاستعلام لجلب نهاية الموعد بدقة]
            var exactBooked = await _context.Appointments
                .Include(a => a.Service) // لجلب المدة
                .Where(a => a.DoctorID == doctorId && a.AppointmentDate.Date == date.Date && a.Status != "Cancelled")
                .ToListAsync();

            foreach (var app in exactBooked)
            {
                blockers.Add(new Shifa.API.Services.TimeRange
                {
                    Start = app.AppointmentDate,
                    End = app.AppointmentDate.AddMinutes(app.Service.DefaultDurationMinutes)
                });
            }

            // ب. إضافة أوقات الصلاة كحواجز
            var prayerBlockers = await _prayerService.GetPrayerBlockersAsync(date);
            blockers.AddRange(prayerBlockers);

            // 4. خوارزمية توليد الفتحات (The Smart Generator Loop)
            var slots = new List<SlotDto>();

            // تحويل وقت بداية ونهاية الدوام إلى DateTime لهذا اليوم
            DateTime currentScanTime = date.Date.Add(availability.StartTime);
            DateTime shiftEnd = date.Date.Add(availability.EndTime);

            // إذا كان التاريخ هو "اليوم"، لا تعرض مواعيد مرت (في الماضي)
            if (date.Date == DateTime.UtcNow.Date)
            {
                var now = DateTime.UtcNow.AddHours(2); // توقيت مصر (أو استخدم توقيت السيرفر)
                if (currentScanTime < now) currentScanTime = now;
            }

            while (currentScanTime.AddMinutes(duration) <= shiftEnd)
            {
                DateTime potentialEnd = currentScanTime.AddMinutes(duration);

                // هل الفترة تتقاطع مع أي حاجز؟
                // نبحث عن حاجز يقطع فترتنا
                var conflict = blockers.FirstOrDefault(b =>
                    (currentScanTime < b.End && potentialEnd > b.Start));

                if (conflict == null)
                {
                    // ✅ لا يوجد تعارض: أضف الموعد
                    slots.Add(new SlotDto
                    {
                        StartTime = currentScanTime,
                        EndTime = potentialEnd,
                        Price = docService.Price
                    });

                    // انتقل للموعد التالي مباشرة
                    currentScanTime = potentialEnd;
                }
                else
                {
                    // ❌ يوجد تعارض (صلاة أو مريض آخر)
                    // الذكاء هنا: لا تزد دقيقة واحدة، بل اقفز فوراً لنهاية الحاجز

                    // مثال: أنا 12:00، الحاجز ينتهي 12:15
                    // إذن وقتي الجديد سيبدأ 12:15

                    if (conflict.End > currentScanTime)
                    {
                        currentScanTime = conflict.End;
                    }
                    else
                    {
                        // حالة نادرة لتجنب Loops لا نهائية
                        currentScanTime = currentScanTime.AddMinutes(5);
                    }
                }
            }

            return Ok(slots);
        }
    }
}
