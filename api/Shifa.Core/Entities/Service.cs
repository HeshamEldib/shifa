using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Service
    {
        [Key]
        public Guid ServiceID { get; set; } = Guid.NewGuid();
        public Guid DoctorID { get; set; }
        [ForeignKey("DoctorID")]
        public Doctor Doctor { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string ServiceName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;
        public double Rating { get; set; } = 0.0;
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }

        public string Type { get; set; } = "In-Clinic"; // أو "Telemedicine"
        public bool IsActive { get; set; } = true;
    }
}
