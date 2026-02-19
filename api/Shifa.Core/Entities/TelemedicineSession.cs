using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class TelemedicineSession
    {
        [Key]
        public Guid SessionID { get; set; } = Guid.NewGuid();

        public Guid AppointmentID { get; set; }
        [ForeignKey("AppointmentID")]
        public Appointment Appointment { get; set; } = null!;

        [MaxLength(500)]
        public string? MeetingLink { get; set; }
        [MaxLength(100)]
        public string? RoomID { get; set; }
        [MaxLength(500)]
        public string? RecordingURL { get; set; }
        [MaxLength(50)]
        public string? SessionStatus { get; set; }

        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
    }
}
