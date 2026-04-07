using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Patient
    {
        [Key]
        // ملاحظة: هنا نجعل الـ Key يدوي وليس تلقائي لأنه مرتبط بالـ UserID
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid PatientID { get; set; } = Guid.NewGuid();

        [ForeignKey("PatientID")]
        public User User { get; set; } = null!;

        public DateTime DateOfBirth { get; set; }
        // [MaxLength(10)]
        // public string Gender { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Job { get; set; }
        [MaxLength(5)]
        public string? BloodType { get; set; }
        public string? Allergies { get; set; } // الحساسية من أدوية معينة
        public string? ChronicDiseases { get; set; } // الأمراض المزمنة

        [MaxLength(100)]
        public string? EmergencyContact { get; set; }

        public double? Weight { get; set; }
        public double? Height { get; set; }
        public string? PatientNotes { get; set; }
        // public ICollection<MedicalRecord> MedicalRecords { get; set; }
    }
}
