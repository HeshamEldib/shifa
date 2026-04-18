using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Admin;
using Shifa.Core.Constants;
using Shifa.Infrastructure.Data;
using System.Linq;
using System.Threading.Tasks;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System.Security.Claims;


namespace Shifa.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize(Roles = AppRoles.Admin)] // حماية النقطة للأدمن فقط
  public class AdminController : ControllerBase
  {
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
      _context = context;
    }

    [HttpGet("dashboard-overview")]
    public async Task<IActionResult> GetDashboardOverview()
    {
      var stats = new AdminDashboardDto();

      // 1. حساب الأرقام الأساسية
      stats.TotalDoctors = await _context.Users.CountAsync(u => u.Role.RoleName == AppRoles.Doctor);
      stats.ActivePatients = await _context.Users.CountAsync(u => u.Role.RoleName == AppRoles.Patient && u.IsActive);
      stats.PendingAppointments = await _context.Appointments.CountAsync(a => a.Status == "Pending");

      // 2. جلب أحدث 5 أطباء تمت إضافتهم للمنصة
      stats.RecentDoctors = await _context.Users
          .Include(u => u.Doctor)
          .Where(u => u.Role.RoleName == AppRoles.Doctor)
          .OrderByDescending(u => u.CreatedDate)
          .Take(5)
          .Select(u => new RecentDoctorDto
          {
            DoctorID = u.UserID,
            Name = u.FullName,
            Specialty = u.Doctor != null ? u.Doctor.Specialty : "غير محدد",
            JoinDate = u.CreatedDate
          })
          .ToListAsync();

      // 3. جلب أحدث 5 عمليات (مثال: أحدث المواعيد التي تم حجزها أو اكتمالها)
      stats.RecentActivities = await _context.Appointments
          .Include(a => a.Patient.User)
          .OrderByDescending(a => a.AppointmentDate) // أو CreatedDate إذا كانت متوفرة
          .Take(5)
          .Select(a => new RecentActivityDto
          {
            Type = a.Status == "Completed" ? "Success" : "Pending",
            Message = $"حجز موعد: {a.Patient.User.FullName}",
            Time = a.AppointmentDate
          })
          .ToListAsync();

      return Ok(stats);
    }


    // 1. جلب قائمة المرضى بالكامل
    [HttpGet("patients")]
    public async Task<ActionResult<IEnumerable<PatientAdminDto>>> GetAllPatients()
    {
      var patients = await _context.Users
          .Include(u => u.Role)
          .Where(u => u.Role.RoleName == AppRoles.Patient) // تصفية المستخدمين الذين يمتلكون دور "مريض"
          .OrderByDescending(u => u.CreatedDate)
          .Select(u => new PatientAdminDto
          {
            PatientID = u.UserID,
            FullName = u.FullName,
            Email = u.Email,
            Phone = u.Phone,
            Gender = u.Gender,
            Age = u.Age ?? 0,
            IsActive = u.IsActive,
            JoinedAt = u.CreatedDate
          })
          .ToListAsync();

      return Ok(patients);
    }

    // 2. تسجيل مريض جديد يدوياً بواسطة الأدمن
    [HttpPost("patients")]
    public async Task<IActionResult> AddPatient([FromBody] CreatePatientDto dto)
    {
      // التحقق من عدم وجود البريد الإلكتروني مسبقاً
      if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        return BadRequest(new { message = "البريد الإلكتروني مسجل بالفعل لنظام آخر." });

      var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == AppRoles.Patient);
      if (role == null) return BadRequest(new { message = "دور المريض غير معرف في النظام." });

      // أ. إنشاء سجل المستخدم (User)
      var user = new User
      {
        FullName = dto.FullName,
        Email = dto.Email,
        Phone = dto.Phone,
        Gender = dto.Gender,
        Age = dto.Age,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient@1234"), // كلمة مرور افتراضية مشفرة
        RoleID = role.RoleID,
        CreatedDate = DateTime.UtcNow,
        IsActive = true
      };

      _context.Users.Add(user);

      // ب. إنشاء سجل المريض المرتبط (Patient)
      // ملاحظة: PatientID هنا يطابق UserID لأننا نستخدمه كـ Primary Key و Foreign Key معاً
      var patient = new Patient
      {
        PatientID = user.UserID,
        User = user,
        DateOfBirth = DateTime.UtcNow.AddYears(-dto.Age) // تاريخ تقريبي بناءً على العمر
      };

      _context.Patients.Add(patient);

      await _context.SaveChangesAsync();

      return Ok(new { message = "تم تسجيل المريض بنجاح", id = user.UserID });
    }

    // 3. إيقاف / تفعيل حساب مريض
    [HttpPut("patients/{id}/toggle-status")]
    public async Task<IActionResult> TogglePatientStatus(Guid id)
    {
      // نبحث عن المستخدم ونتأكد أنه يمتلك دور "مريض"
      var user = await _context.Users
          .Include(u => u.Role)
          .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleName == AppRoles.Patient);

      if (user == null)
        return NotFound(new { message = "المريض غير موجود أو أن الحساب لا يخص مريضاً." });

      // عكس الحالة الحالية
      user.IsActive = !user.IsActive;

      await _context.SaveChangesAsync();

      var statusMessage = user.IsActive ? "تم تفعيل الحساب بنجاح" : "تم إيقاف الحساب بنجاح";

      return Ok(new
      {
        message = statusMessage,
        isActive = user.IsActive
      });
    }

    // جلب تفاصيل مريض محدد
    [HttpGet("patients/{id}")]
    public async Task<ActionResult<PatientDetailDto>> GetPatientDetail(Guid id)
    {
      var patient = await _context.Users
          .Include(u => u.Patient)
          .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleName == AppRoles.Patient);

      if (patient == null) return NotFound(new { message = "المريض غير موجود" });

      return Ok(new PatientDetailDto
      {
        PatientID = patient.UserID,
        FullName = patient.FullName,
        Email = patient.Email,
        Phone = patient.Phone,
        Gender = patient.Gender,
        Age = patient.Age ?? 0,
        Address = patient.Address,
        Image = patient.Image,
        IsActive = patient.IsActive,
        CreatedDate = patient.CreatedDate,

        // بيانات من كائن المريض
        Job = patient.Patient?.Job,
        BloodType = patient.Patient?.BloodType,
        Allergies = patient.Patient?.Allergies,
        ChronicDiseases = patient.Patient?.ChronicDiseases,
        EmergencyContact = patient.Patient?.EmergencyContact,
        Weight = patient.Patient?.Weight,
        Height = patient.Patient?.Height,
        PatientNotes = patient.Patient?.PatientNotes
      });
    }

    // جلب تفاصيل طبيب محدد
    [HttpGet("doctors/{id}")]
    public async Task<ActionResult<DoctorDetailDto>> GetDoctorDetail(Guid id)
    {
      var doctor = await _context.Users
          .Include(u => u.Doctor)
          .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleName == AppRoles.Doctor);

      if (doctor == null) return NotFound(new { message = "الطبيب غير موجود" });

      return Ok(new DoctorDetailDto
      {
        DoctorID = doctor.UserID,
        FullName = doctor.FullName,
        Email = doctor.Email,
        Phone = doctor.Phone,
        Specialty = doctor.Doctor?.Specialty,
        Specialization = doctor.Doctor?.Specialization,
        ExperienceYears = doctor.Doctor?.ExperienceYears ?? 0,
        Bio = doctor.Doctor?.Bio,
        Rating = doctor.Doctor?.Rating ?? 0,
        PatientsCount = doctor.Doctor?.PatientsCount ?? 0,
        Image = doctor.Image
      });
    }

    // 1. جلب قائمة الأطباء للإدارة
    [HttpGet("doctors")]
    public async Task<ActionResult<IEnumerable<DoctorAdminDto>>> GetAllDoctors()
    {
      var doctors = await _context.Users
          .Include(u => u.Role)
          .Include(u => u.Doctor) // ضروري جداً لجلب التخصص والخبرة من جدول الأطباء
          .Where(u => u.Role.RoleName == AppRoles.Doctor)
          .OrderByDescending(u => u.CreatedDate)
          .Select(u => new DoctorAdminDto
          {
            DoctorID = u.UserID,
            FullName = u.FullName,
            Email = u.Email,
            Phone = u.Phone,
            Specialty = u.Doctor != null ? u.Doctor.Specialty : "غير محدد",
            ExperienceYears = u.Doctor != null ? u.Doctor.ExperienceYears : 0,
            IsActive = u.IsActive,
            CreatedDate = u.CreatedDate
          })
          .ToListAsync();

      return Ok(doctors);
    }

    // 2. إضافة طبيب جديد يدوياً بواسطة الإدارة
    [HttpPost("doctors")]
    public async Task<IActionResult> AddDoctor([FromBody] CreateDoctorDto dto)
    {
      // 1. التحقق من عدم تكرار البريد الإلكتروني
      if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        return BadRequest(new { message = "البريد الإلكتروني مسجل بالفعل في النظام." });

      var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == AppRoles.Doctor);
      if (role == null) return BadRequest(new { message = "دور الطبيب غير معرف في النظام." });

      // 2. إنشاء حساب المستخدم (User)
      var user = new User
      {
        FullName = dto.FullName,
        Email = dto.Email,
        Phone = dto.Phone,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@1234"), // كلمة المرور الافتراضية
        RoleID = role.RoleID,
        CreatedDate = DateTime.UtcNow,
        IsActive = true // الطبيب المضاف من الإدارة يكون نشطاً (Approved) مباشرة
      };

      _context.Users.Add(user);

      // 3. إنشاء الملف المهني (Doctor)
      var doctor = new Doctor
      {
        DoctorID = user.UserID, // تطابق المفاتيح (1-to-1 Relationship)
        User = user,
        Specialty = dto.Specialty,
        Specialization = dto.Specialization,
        ExperienceYears = dto.ExperienceYears,
        Rating = 0.0,
        PatientsCount = 0
      };

      _context.Doctors.Add(doctor);

      // 4. حفظ التغييرات في قاعدة البيانات
      await _context.SaveChangesAsync();

      return Ok(new { message = "تم إنشاء حساب الطبيب بنجاح", id = user.UserID });
    }

    // 3. إيقاف / تفعيل حساب طبيب
    [HttpPut("doctors/{id}/toggle-status")]
    public async Task<IActionResult> ToggleDoctorStatus(Guid id)
    {
      var user = await _context.Users
          .Include(u => u.Role)
          .FirstOrDefaultAsync(u => u.UserID == id && u.Role.RoleName == AppRoles.Doctor);

      if (user == null)
        return NotFound(new { message = "الطبيب غير موجود." });

      // عكس الحالة الحالية
      user.IsActive = !user.IsActive;

      await _context.SaveChangesAsync();

      var statusMessage = user.IsActive ? "تم تفعيل حساب الطبيب بنجاح" : "تم إيقاف حساب الطبيب بنجاح";

      return Ok(new
      {
        message = statusMessage,
        isActive = user.IsActive
      });
    }

    // 1. جلب جميع المواعيد في العيادة
    [HttpGet("appointments")]
    public async Task<ActionResult<IEnumerable<AppointmentAdminDto>>> GetAllAppointments()
    {
      var appointments = await _context.Appointments
          .Include(a => a.Patient)
              .ThenInclude(p => p.User) // جلب بيانات المستخدم للمريض (الاسم، الهاتف)
          .Include(a => a.Doctor)
              .ThenInclude(d => d.User) // جلب بيانات المستخدم للطبيب
          .OrderByDescending(a => a.AppointmentDate)
          .Select(a => new AppointmentAdminDto
          {
            AppointmentID = a.AppointmentID,
            PatientName = a.Patient.User.FullName,
            PatientPhone = a.Patient.User.Phone ?? "غير مسجل",
            DoctorName = "د. " + a.Doctor.User.FullName,
            Specialty = a.Doctor.Specialty,
            AppointmentDate = a.AppointmentDate,
            Status = a.Status
          })
          .ToListAsync();

      return Ok(appointments);
    }

    // 2. تحديث حالة الموعد
    [HttpPut("appointments/{id}/status")]
    public async Task<IActionResult> UpdateAppointmentStatus(Guid id, [FromBody] UpdateAppointmentStatusDto dto)
    {
      var appointment = await _context.Appointments.FindAsync(id);
      if (appointment == null)
        return NotFound(new { message = "الموعد غير موجود." });

      // التأكد من أن الحالة المرسلة صحيحة
      var validStatuses = new[] { "Pending", "Confirmed", "Completed", "Cancelled" };
      if (!validStatuses.Contains(dto.Status))
        return BadRequest(new { message = "حالة الموعد غير صالحة." });

      appointment.Status = dto.Status;
      await _context.SaveChangesAsync();

      return Ok(new { message = "تم تحديث حالة الموعد بنجاح.", newStatus = appointment.Status });
    }

    [HttpGet("appointments/{id}/details")]
    public async Task<IActionResult> GetAppointmentDetails(Guid id)
    {
      var app = await _context.Appointments
          .Include(a => a.Patient).ThenInclude(p => p.User)
          .Include(a => a.Doctor).ThenInclude(d => d.User)
          .FirstOrDefaultAsync(a => a.AppointmentID == id);

      if (app == null) return NotFound();

      return Ok(new
      {
        app.AppointmentID,
        app.AppointmentDate,
        app.Status,
        app.Notes, // ملاحظات المريض عند الحجز
        Patient = new
        {
          app.Patient.User.FullName,
          app.Patient.User.Phone,
          app.Patient.BloodType,
          app.Patient.ChronicDiseases
        },
        Doctor = new
        {
          app.Doctor.User.FullName,
          app.Doctor.Specialty,
          app.Doctor.User.Image
        }
      });
    }

    // 1. جلب الإشعارات الواردة للإدارة
    [HttpGet("notifications")]
    public async Task<ActionResult<IEnumerable<NotificationResponseDto>>> GetAdminNotifications()
    {
      var adminIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
      if (!Guid.TryParse(adminIdString, out Guid adminId)) return Unauthorized();

      var notifications = await _context.UserNotificationStatuses
          .Include(uns => uns.Notification)
          .Where(uns => uns.RecipientUserID == adminId) // التعديل هنا: RecipientUserID
          .OrderByDescending(uns => uns.Notification.CreationDate)
          .Take(50)
          .Select(uns => new NotificationResponseDto
          {
            NotificationID = uns.NotificationID,
            Title = uns.Notification.Title,
            Content = uns.Notification.Content,
            CreationDate = uns.Notification.CreationDate,
            IsRead = uns.ReadStatus // التعديل هنا: ReadStatus
          })
          .ToListAsync();

      return Ok(notifications);
    }

    // 2. إرسال تعميم (Broadcast)
    [HttpPost("notifications/broadcast")]
    public async Task<IActionResult> SendBroadcastNotification([FromBody] SendBroadcastDto dto)
    {
      var senderIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
      if (!Guid.TryParse(senderIdString, out Guid adminId)) return Unauthorized();

      // 1. تحديد المستخدمين المستهدفين
      var targetUsersQuery = _context.Users.AsQueryable();

      if (dto.TargetAudience == "Doctors")
        targetUsersQuery = targetUsersQuery.Where(u => u.Role.RoleName == AppRoles.Doctor);
      else if (dto.TargetAudience == "Patients")
        targetUsersQuery = targetUsersQuery.Where(u => u.Role.RoleName == AppRoles.Patient);

      var usersIds = await targetUsersQuery.Select(u => u.UserID).ToListAsync();

      if (!usersIds.Any())
        return BadRequest(new { message = "لا يوجد مستخدمين في هذه الفئة." });

      // 2. إنشاء "سجل إشعار واحد" فقط في قاعدة البيانات
      var notification = new Notification
      {
        SenderUserID = adminId,
        Title = dto.Title,
        Content = dto.Content,
        CreationDate = DateTime.UtcNow
      };

      _context.Notifications.Add(notification);

      // 3. ربط الإشعار بالمستخدمين عبر جدول الحالات
      var notificationStatuses = usersIds.Select(userId => new UserNotificationStatus
      {
        NotificationID = notification.NotificationID,
        RecipientUserID = userId, // التعديل هنا: RecipientUserID
        ReadStatus = false,       // التعديل هنا: ReadStatus
        Notification = notification
      }).ToList();

      _context.UserNotificationStatuses.AddRange(notificationStatuses);

      await _context.SaveChangesAsync();

      return Ok(new { message = $"تم إرسال الإشعار بنجاح إلى {usersIds.Count} مستخدم." });
    }

    // 1. جلب الإعدادات العامة
    [HttpGet("settings")]
    public async Task<ActionResult<GlobalSettingsDto>> GetGlobalSettings()
    {
      // جلب كل الإعدادات كقاموس (Dictionary) لسرعة البحث
      var settingsList = await _context.ClinicSettings.ToListAsync();
      var settingsDict = settingsList.ToDictionary(s => s.SettingKey, s => s.SettingValue);

      // تجميع البيانات في DTO واحد
      var dto = new GlobalSettingsDto
      {
        ClinicName = settingsDict.GetValueOrDefault("ClinicName", ""),
        ClinicDescription = settingsDict.GetValueOrDefault("ClinicDescription", ""),
        ContactPhone = settingsDict.GetValueOrDefault("ContactPhone", ""),
        EmergencyPhone = settingsDict.GetValueOrDefault("EmergencyPhone", ""),
        ContactEmail = settingsDict.GetValueOrDefault("ContactEmail", ""),
        Address = settingsDict.GetValueOrDefault("Address", ""),
        FacebookUrl = settingsDict.GetValueOrDefault("FacebookUrl", ""),
        InstagramUrl = settingsDict.GetValueOrDefault("InstagramUrl", ""),
        TwitterUrl = settingsDict.GetValueOrDefault("TwitterUrl", ""),
        WebsiteUrl = settingsDict.GetValueOrDefault("WebsiteUrl", ""),
        LinkedinUrl = settingsDict.GetValueOrDefault("LinkedinUrl", ""),
        LogoUrl = settingsDict.GetValueOrDefault("LogoUrl", "")
      };

      return Ok(dto);
    }

    // 2. تحديث وحفظ الإعدادات العامة
    [HttpPut("settings")]
    public async Task<IActionResult> UpdateGlobalSettings([FromBody] GlobalSettingsDto dto)
    {
      // تحويل الـ DTO القادم من الفرونت إند إلى Dictionary للتعامل مع قاعدة البيانات
      var settingsDict = new Dictionary<string, string>
    {
        { "ClinicName", dto.ClinicName },
        { "ClinicDescription", dto.ClinicDescription },
        { "ContactPhone", dto.ContactPhone },
        { "EmergencyPhone", dto.EmergencyPhone },
        { "ContactEmail", dto.ContactEmail },
        { "Address", dto.Address },
        { "FacebookUrl", dto.FacebookUrl },
        { "InstagramUrl", dto.InstagramUrl },
        { "TwitterUrl", dto.TwitterUrl },
        { "WebsiteUrl", dto.WebsiteUrl },
        { "LinkedinUrl", dto.LinkedinUrl },
        { "LogoUrl", dto.LogoUrl } // (في التطبيقات الحقيقية، يتم رفع الصورة أولاً وحفظ مسارها هنا)
    };

      // جلب الإعدادات الحالية من قاعدة البيانات
      var existingSettings = await _context.ClinicSettings.ToListAsync();

      foreach (var kvp in settingsDict)
      {
        var setting = existingSettings.FirstOrDefault(s => s.SettingKey == kvp.Key);

        if (setting != null)
        {
          // تحديث القيمة إذا كان المفتاح موجوداً
          setting.SettingValue = kvp.Value ?? "";
        }
        else
        {
          // إنشاء المفتاح إذا لم يكن موجوداً مسبقاً
          _context.ClinicSettings.Add(new ClinicSetting { SettingKey = kvp.Key, SettingValue = kvp.Value ?? "" });
        }
      }

      await _context.SaveChangesAsync();

      return Ok(new { message = "تم تحديث إعدادات النظام بنجاح." });
    }

    [HttpPost("upload-logo")]
    public async Task<IActionResult> UploadLogo(IFormFile file)
    {      if (file == null || file.Length == 0)
        return BadRequest(new { message = "لم يتم إرسال ملف." });

      // في تطبيق حقيقي، يجب رفع الملف إلى خدمة تخزين (مثل AWS S3 أو Azure Blob) والحصول على URL
      // هنا سنحاكي ذلك بحفظ الملف محلياً وإرجاع مسار وهمي

      var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
      if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);

      var fileName = $"logo_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
      var filePath = Path.Combine(uploadsFolder, fileName);

      using (var stream = new FileStream(filePath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      var logoUrl = $"/uploads/{fileName}"; // هذا هو المسار الذي سيتم حفظه في قاعدة البيانات

      // تحديث إعداد LogoUrl في قاعدة البيانات
      var setting = await _context.ClinicSettings.FirstOrDefaultAsync(s => s.SettingKey == "LogoUrl");
      if (setting != null)
      {
        setting.SettingValue = logoUrl;
      }
      else
      {
        _context.ClinicSettings.Add(new ClinicSetting { SettingKey = "LogoUrl", SettingValue = logoUrl });
      }

      await _context.SaveChangesAsync();

      return Ok(new { message = "تم رفع الشعار بنجاح.", logoUrl });
    }

  }
}