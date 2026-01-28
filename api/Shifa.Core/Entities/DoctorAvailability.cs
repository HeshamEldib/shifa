using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class DoctorAvailability
    {
        [Key]
        public Guid AvailabilityID { get; set; } = Guid.NewGuid();

        public Guid DoctorID { get; set; } = Guid.NewGuid();
        [ForeignKey("DoctorID")]
        public User Doctor { get; set; } = null!;

        public int DayOfWeek { get; set; } // 1=Sunday
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
