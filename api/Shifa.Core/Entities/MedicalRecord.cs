using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class MedicalRecord
    {
        [Key]
        public Guid RecordID { get; set; } = Guid.NewGuid();
        public Guid? AppointmentID { get; set; }
        public Guid PatientID { get; set; } = Guid.NewGuid();
        public Patient Patient { get; set; } = null!;

        public Guid DoctorID { get; set; } = Guid.NewGuid();
        [ForeignKey("DoctorID")]
        public User Doctor { get; set; } = null!;

        public DateTime VisitDate { get; set; }

        [MaxLength(255)]
        public string? ChiefComplaint { get; set; }

        // يجب تشفيره في الـ Service قبل الحفظ
        public string? DiagnosisDetails { get; set; }

        public string? TreatmentPlan { get; set; }

        public string? VitalSignsJson { get; set; } // JSON

        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}
