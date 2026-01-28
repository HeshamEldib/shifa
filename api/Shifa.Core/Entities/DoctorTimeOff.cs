using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class DoctorTimeOff
    {
        [Key]
        public Guid TimeOffID { get; set; } = Guid.NewGuid();

        public Guid DoctorID { get; set; } = Guid.NewGuid();
        [ForeignKey("DoctorID")]
        public User Doctor { get; set; } = null!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        [MaxLength(255)]
        public string? Reason { get; set; }
    }
}
