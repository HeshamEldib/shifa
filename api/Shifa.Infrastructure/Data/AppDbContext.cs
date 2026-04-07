using Microsoft.EntityFrameworkCore;
using Shifa.Core.Entities;
using Shifa.Core.Constants;
using System.Linq;
using Shifa.Core.Helpers;

namespace Shifa.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<DoctorTimeOff> DoctorTimeOffs { get; set; }
        public DbSet<ClinicSetting> ClinicSettings { get; set; }
        public DbSet<TelemedicineSession> TelemedicineSessions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<NotificationTemplate> NotificationTemplates { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<UserNotificationStatus> UserNotificationStatuses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. ضمان عدم تكرار البريد الإلكتروني واسم الدور
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Role>().HasIndex(r => r.RoleName).IsUnique();

            // 2. ضمان عدم تكرار نوع الحدث
            modelBuilder.Entity<NotificationTemplate>().HasIndex(t => t.EventType).IsUnique();

            // 3. مفتاح مركب لجدول حالة الإشعارات
            modelBuilder.Entity<UserNotificationStatus>()
                .HasIndex(s => new { s.NotificationID, s.RecipientUserID })
                .IsUnique();

            // 4. العلاقات (Fluent API)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Invoice)
                .WithOne(i => i.Appointment)
                .HasForeignKey<Invoice>(i => i.AppointmentID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.TelemedicineSession)
                .WithOne(t => t.Appointment)
                .HasForeignKey<TelemedicineSession>(t => t.AppointmentID)
                .OnDelete(DeleteBehavior.Cascade);


            // 5. ضبط الأموال
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetColumnType("decimal(10,2)");
            }

            // 6. حل مشكلة Cycles (Restrict Delete)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(m => m.Doctor)
                .WithMany()
                .HasForeignKey(m => m.DoctorID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(m => m.Patient)
                .WithMany()
                .HasForeignKey(m => m.PatientID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .Property(m => m.DiagnosisDetails)
                .HasConversion(
                    v => EncryptionHelper.Encrypt(v),  // يتنفذ قبل الحفظ في قاعدة البيانات
                    v => EncryptionHelper.Decrypt(v)   // يتنفذ عند استخراج البيانات
                );
        }
    }
}
