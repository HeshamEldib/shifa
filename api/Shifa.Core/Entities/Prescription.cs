using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Prescription
    {
        [Key]
        public Guid PrescriptionID { get; set; } = Guid.NewGuid();

        public Guid RecordID { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;

        public Guid MedicationID { get; set; }
        public Medication Medication { get; set; } = null!;

        [MaxLength(100)]
        public string? Dosage { get; set; }
        [MaxLength(100)]
        public string? Frequency { get; set; }
        [MaxLength(100)]
        public string? Duration { get; set; }

        public string? Instructions { get; set; }
    }
}
