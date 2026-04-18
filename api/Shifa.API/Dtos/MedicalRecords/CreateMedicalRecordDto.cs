using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.MedicalRecords
{
    public class CreateMedicalRecordDto
    {
        [Required]
        public Guid PatientID { get; set; }
        public Guid DoctorID { get; set; }
        public Guid AppointmentID { get; set; } 
        
        public DateTime VisitDate { get; set; } = DateTime.UtcNow;
        
        [MaxLength(255)]
        public string ChiefComplaint { get; set; }
        
        [Required]
        public string DiagnosisDetails { get; set; } // سيتم تشفيره تلقائياً!
        
        public string TreatmentPlan { get; set; }
        public string VitalSignsJson { get; set; }

        // قائمة الأدوية (الروشتة) التي سيتم إضافتها مع السجل في نفس اللحظة
        public List<PrescriptionItemDto> Prescriptions { get; set; } = new List<PrescriptionItemDto>();
    }

    public class PrescriptionItemDto
    {
        [Required]
        public Guid MedicationID { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public string Duration { get; set; }
        public string Instructions { get; set; }
    }
}