using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Appointment
    {
        [Key]
        public Guid AppointmentID { get; set; } = Guid.NewGuid();

        public Guid PatientID { get; set; } = Guid.NewGuid();
        public Patient Patient { get; set; } = null!;

        public Guid DoctorID { get; set; } = Guid.NewGuid();
        [ForeignKey("DoctorID")]
        public User Doctor { get; set; } = null!;

        public Guid ServiceID { get; set; } = Guid.NewGuid();
        public Service Service { get; set; } = null!;

        public DateTime AppointmentDate { get; set; }

        [MaxLength(50)]
        public string AppointmentStatus { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled

        [MaxLength(50)]
        public string Type { get; set; } = "InClinic"; // InClinic, Telemedicine

        [MaxLength(255)]
        public string? Reason { get; set; }

        // العلاقة مع جلسة الفيديو (1:0..1)
        public TelemedicineSession? TelemedicineSession { get; set; }

        // العلاقة مع الفاتورة (1:0..1)
        public Invoice? Invoice { get; set; }
    }
}
