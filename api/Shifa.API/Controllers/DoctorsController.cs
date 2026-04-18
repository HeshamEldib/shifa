using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Doctors;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System.Security.Claims;
using System.Linq;
using Shifa.API.Dtos.Settings;

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
                .Include(u => u.Doctor)
                .Where(u => u.Role.RoleName == AppRoles.Doctor)
                .Select(u => new DoctorDto
                {
                    DoctorID = u.UserID,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Image = u.Image,
                    Age = u.Age,
                    Gender = u.Gender,
                    Country = u.Country,
                    Address = u.Address,

                    Specialization = u.Doctor != null ? u.Doctor.Specialization : string.Empty,
                    Specialty = u.Doctor != null ? u.Doctor.Specialty : string.Empty,
                    Quote = u.Doctor != null ? u.Doctor.Quote : string.Empty,
                    Bio = u.Doctor != null ? u.Doctor.Bio : string.Empty,
                    Rating = u.Doctor != null ? u.Doctor.Rating : 0,
                    ExperienceYears = u.Doctor != null ? u.Doctor.ExperienceYears : 0,
                    PatientsCount = u.Doctor != null ? u.Doctor.PatientsCount : 0
                })
                .ToListAsync();

            return Ok(doctors);
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
                .Where(a => a.DoctorID == doctorId && a.IsActive)
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

        //
        [HttpGet("my-availability")]
        [Authorize(Roles = AppRoles.Doctor)]
        public async Task<ActionResult<IEnumerable<AvailabilityDto>>> GetMyAvailability()
        {
            // 1. استخراج الـ ID الخاص بالطبيب من الـ Token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userId, out Guid doctorId)) return Unauthorized();

            var schedule = await _context.DoctorAvailabilities
                .Where(a => a.DoctorID == doctorId)
                .OrderBy(a => a.DayOfWeek)
                .ThenBy(a => a.StartTime)
                .Where(a => a.IsActive)
                .Select(a => new AvailabilityDto
                {
                    AvailabilityID = a.AvailabilityID,
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    IsActive = a.IsActive
                })
                .ToListAsync();

            return Ok(schedule);
        }
        
        // 2. تحديث مواعيد العمل بالكامل (إضافة، تعديل، حذف)
        [HttpPut("availability")]
        [Authorize(Roles = AppRoles.Doctor)]
        public async Task<IActionResult> UpdateAvailability([FromBody] List<AvailabilityDto> incomingSchedule)
        {
            // 1. استخراج الـ ID الخاص بالطبيب
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userId, out Guid doctorId)) return Unauthorized();

            // 2. التحقق من صحة الفترات ومنع التداخل الداخلي
            var groupedDays = incomingSchedule.GroupBy(s => s.DayOfWeek);
            foreach (var day in groupedDays)
            {
                var orderedShifts = day.OrderBy(s => s.StartTime).ToList();
                for (int i = 0; i < orderedShifts.Count; i++)
                {
                    if (orderedShifts[i].StartTime >= orderedShifts[i].EndTime)
                        return BadRequest($"وقت البدء يجب أن يكون قبل وقت الانتهاء في يوم {day.Key}.");

                    // منع تداخل الفترات في نفس اليوم (مثلاً من 9-12 ومن 10-2)
                    if (i < orderedShifts.Count - 1 && orderedShifts[i].EndTime > orderedShifts[i + 1].StartTime)
                        return BadRequest($"يوجد تداخل في فترات العمل في يوم {day.Key}.");
                }
            }

            // 3. جلب المواعيد الحالية من قاعدة البيانات
            var existingSchedule = await _context.DoctorAvailabilities
                .Where(a => a.DoctorID == doctorId)
                .ToListAsync();

            // 4. تحديد ما يجب حذفه (الفترات الموجودة في السيرفر ولم يرسلها الفرونت إند)
            var incomingIds = incomingSchedule.Where(s => s.AvailabilityID.HasValue)
                                                .Select(s => s.AvailabilityID.Value).ToList();
            var toDelete = existingSchedule.Where(e => !incomingIds.Contains(e.AvailabilityID)).ToList();
            _context.DoctorAvailabilities.RemoveRange(toDelete);

            // 5. التحديث والإضافة
            foreach (var item in incomingSchedule)
            {
                if (item.AvailabilityID.HasValue && item.AvailabilityID.Value != Guid.Empty)
                {
                    // تحديث فترة موجودة
                    var existing = existingSchedule.FirstOrDefault(e => e.AvailabilityID == item.AvailabilityID.Value);
                    if (existing != null)
                    {
                        existing.DayOfWeek = item.DayOfWeek;
                        existing.StartTime = item.StartTime;
                        existing.EndTime = item.EndTime;
                        existing.IsActive = item.IsActive;
                    }
                }
                else
                {
                    // إضافة فترة جديدة
                    _context.DoctorAvailabilities.Add(new DoctorAvailability
                    {
                        DoctorID = doctorId,
                        DayOfWeek = item.DayOfWeek,
                        StartTime = item.StartTime,
                        EndTime = item.EndTime,
                        IsActive = item.IsActive
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم مزامنة وتحديث مواعيد العمل بنجاح." });
        }

        [HttpGet("dashboard-overview")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetDashboardOverview()
        {
            // 1. استخراج الـ ID الخاص بالطبيب من الـ Token
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(doctorIdClaim, out Guid doctorId))
                return Unauthorized("يجب تسجيل الدخول كطبيب");

            var todayDate = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(todayDate.Year, todayDate.Month, 1);

            // 2. حساب الإحصائيات (Stats)
            var stats = new DoctorStatsDto
            {
                // مواعيد اليوم (أي موعد تاريخه اليوم بغض النظر عن حالته، أو المواعيد المؤكدة فقط - حسب البزنس لوجيك)
                TodayAppointments = await _context.Appointments
                    .Where(a => a.DoctorID == doctorId && a.AppointmentDate.Date == todayDate)
                    .CountAsync(),

                // إجمالي المرضى (عدد المرضى الفريدين الذين تعاملوا مع الطبيب أو حجزوا عنده)
                TotalPatients = await _context.Appointments
                    .Where(a => a.DoctorID == doctorId)
                    .Select(a => a.PatientID)
                    .Distinct()
                    .CountAsync(),

                // الطلبات المعلقة (Pending) التي تحتاج موافقة
                PendingRequests = await _context.Appointments
                    .Where(a => a.DoctorID == doctorId && a.Status == "Pending")
                    .CountAsync(),

                // المواعيد المكتملة هذا الشهر
                CompletedThisMonth = await _context.Appointments
                    .Where(a => a.DoctorID == doctorId && a.Status == "Completed" && a.AppointmentDate >= startOfMonth)
                    .CountAsync()
            };

            // 3. جلب مواعيد اليوم (Today's Schedule)
            var todaySchedule = await _context.Appointments
                .Include(a => a.Patient) // لجلب اسم المريض
                .Where(a => a.DoctorID == doctorId && a.AppointmentDate.Date == todayDate)
                .OrderBy(a => a.AppointmentDate)
                .Select(a => new TodayScheduleDto
                {
                    AppointmentID = a.AppointmentID,
                    PatientName = a.Patient.User.FullName, // جلب الاسم من جدول User المرتبط
                    Time = a.AppointmentDate.ToString("hh:mm tt"), // تنسيق الوقت
                    Type = a.Type == "Telemedicine" ? "أونلاين" : "في العيادة",
                    Status = a.Status
                })
                .ToListAsync();

            // 4. بناء النتيجة وإرجاعها
            var overview = new DoctorDashboardOverviewDto
            {
                Stats = stats,
                TodaySchedule = todaySchedule
            };

            return Ok(overview);
        }

        [HttpGet("my-patients")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMyPatients()
        {
            // 1. الحصول على ID الطبيب من الـ Token
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(doctorIdClaim, out Guid doctorId))
                return Unauthorized();

            // 2. جلب المرضى الفريدين الذين لديهم مواعيد مع هذا الطبيب
            var patients = await _context.Appointments
                .Include(a => a.Patient) // تأكد أن علاقة المريض موجودة في الـ Entity
                .Where(a => a.DoctorID == doctorId)
                .GroupBy(a => a.PatientID) // تجميع المواعيد لكل مريض على حدة
                .Select(group => new DoctorPatientDto
                {
                    PatientID = group.Key,
                    FullName = group.First().Patient.User.FullName,
                    // حساب العمر تقريبياً بناءً على تاريخ الميلاد (إذا توفر)
                    // Age = DateTime.Today.Year - (group.First().Patient.DateOfBirth.Year),
                    Age = group.First().Patient.User.Age ?? 0,
                    Gender = group.First().Patient.User.Gender,
                    Phone = group.First().Patient.User.Phone,
                    // تحديد تاريخ أحدث موعد
                    LastVisit = group.Max(a => a.AppointmentDate),
                    // عدّ إجمالي المواعيد (سواء مكتملة أو غيرها حسب رغبتك)
                    TotalVisits = group.Count()
                })
                .OrderByDescending(p => p.LastVisit) // الأحدث ظهوراً في البداية
                .ToListAsync();

            return Ok(patients);
        }

[HttpGet("prayer-settings")]
[Authorize(Roles = AppRoles.Doctor)]
public async Task<ActionResult<PrayerSettingsDto>> GetMyPrayerSettings()
{
    var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (!Guid.TryParse(doctorIdClaim, out Guid doctorId)) return Unauthorized();

    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.DoctorID == doctorId);
    if (doctor == null) return NotFound("الطبيب غير موجود");

    var dto = new PrayerSettingsDto
    {
        BlockPrayerTimes = doctor.BlockPrayerTimes,
        DefaultMinutesBefore = doctor.DefaultMinutesBefore,
        DefaultMinutesAfter = doctor.DefaultMinutesAfter,
        JumuahMinutesBefore = doctor.JumuahMinutesBefore,
        JumuahMinutesAfter = doctor.JumuahMinutesAfter
    };

    return Ok(dto);
}

// 2. تحديث إعدادات الصلاة الخاصة بالطبيب
[HttpPut("prayer-settings")]
[Authorize(Roles = AppRoles.Doctor)]
public async Task<IActionResult> UpdateMyPrayerSettings([FromBody] PrayerSettingsDto dto)
{
    var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (!Guid.TryParse(doctorIdClaim, out Guid doctorId)) return Unauthorized();

    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.DoctorID == doctorId);
    if (doctor == null) return NotFound("الطبيب غير موجود");

    doctor.BlockPrayerTimes = dto.BlockPrayerTimes;
    doctor.DefaultMinutesBefore = dto.DefaultMinutesBefore;
    doctor.DefaultMinutesAfter = dto.DefaultMinutesAfter;
    doctor.JumuahMinutesBefore = dto.JumuahMinutesBefore;
    doctor.JumuahMinutesAfter = dto.JumuahMinutesAfter;

    await _context.SaveChangesAsync();
    return Ok(new { message = "تم تحديث إعدادات الصلاة بنجاح" });
}

    }
}
