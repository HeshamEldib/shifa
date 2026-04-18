using System;
using System.Collections.Generic;

namespace Shifa.API.Dtos.Admin
{
  public class AdminDashboardDto
  {
    public int TotalDoctors { get; set; }
    public int ActivePatients { get; set; }
    public int PendingAppointments { get; set; }
    public string MonthlyGrowth { get; set; } = "+15%"; // يمكن برمجتها لاحقاً بحسبة معقدة

    public List<RecentDoctorDto> RecentDoctors { get; set; } = new();
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
  }

  public class RecentDoctorDto
  {
    public Guid DoctorID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
  }

  public class RecentActivityDto
  {
    public string Type { get; set; } = string.Empty; // "Success", "Pending"
    public string Message { get; set; } = string.Empty;
    public DateTime Time { get; set; }
  }

  // DTO لعرض قائمة المرضى للإدارة
  public class PatientAdminDto
  {
    public Guid PatientID { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Gender { get; set; }
    public int Age { get; set; }
    public bool IsActive { get; set; }
    public DateTime JoinedAt { get; set; }
  }

  // DTO لاستقبال بيانات المريض الجديد
  public class CreatePatientDto
  {
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Gender { get; set; }
    public int Age { get; set; }
  }

  // DTO تفاصيل المريض الكاملة
  public class PatientDetailDto
  {
    public Guid PatientID { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Gender { get; set; }
    public int Age { get; set; }
    public string Address { get; set; }
    public string Image { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }

    // بيانات من جدول Patient
    public string Job { get; set; }
    public string BloodType { get; set; }
    public string Allergies { get; set; }
    public string ChronicDiseases { get; set; }
    public string EmergencyContact { get; set; }
    public double? Weight { get; set; }
    public double? Height { get; set; }
    public string PatientNotes { get; set; }
  }

  // DTO تفاصيل الطبيب الكاملة
  public class DoctorDetailDto
  {
    public Guid DoctorID { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Specialty { get; set; }
    public string Specialization { get; set; }
    public int ExperienceYears { get; set; }
    public string Bio { get; set; }
    public double Rating { get; set; }
    public int PatientsCount { get; set; }
    public string Image { get; set; }
  }

  // DTO لعرض الأطباء في جدول الإدارة
  public class DoctorAdminDto
  {
    public Guid DoctorID { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Specialty { get; set; }
    public int ExperienceYears { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
  }

  // DTO لإضافة طبيب جديد
  public class CreateDoctorDto
  {
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Specialty { get; set; }
    public string Specialization { get; set; }
    public int ExperienceYears { get; set; }
  }

  public class AppointmentAdminDto
  {
    public Guid AppointmentID { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientPhone { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = string.Empty; // Pending, Confirmed, Completed, Cancelled
  }

  // DTO لاستقبال طلب تحديث الحالة
  public class UpdateAppointmentStatusDto
  {
    public string Status { get; set; } = string.Empty;
  }

  public class getAppointmentDetailsAdminDto
  {
    public Guid AppointmentID { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientPhone { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
  }


  // DTO لاستقبال بيانات الإرسال
  public class SendBroadcastDto
  {
    public string TargetAudience { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // تم التعديل لتطابق الكيان
  }

  // DTO لعرض الإشعار للمستخدم
  public class NotificationResponseDto
  {
    public Guid NotificationID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; }
    public bool IsRead { get; set; }
  }

public class GlobalSettingsDto
    {
        public string ClinicName { get; set; } = string.Empty;
        public string ClinicDescription { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string EmergencyPhone { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string FacebookUrl { get; set; } = string.Empty;
        public string InstagramUrl { get; set; } = string.Empty;
        public string TwitterUrl { get; set; } = string.Empty;
        public string WebsiteUrl { get; set; } = string.Empty;
        public string LinkedinUrl { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
    }

}