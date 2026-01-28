using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class AuditLog
    {
        [Key]
        public long LogID { get; set; }

        public Guid UserID { get; set; } = Guid.NewGuid();
        [ForeignKey("UserID")]
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string ActionType { get; set; } = string.Empty; // LOGIN, VIEW_RECORD

        [MaxLength(100)]
        public string? TableNameAffected { get; set; }

        [MaxLength(100)]
        public string? RecordIDAffected { get; set; }

        public string? DetailsJson { get; set; } // القيم القديمة والجديدة
        [MaxLength(50)]
        public string? IPAddress { get; set; }

        public DateTime ActionTimestamp { get; set; } = DateTime.UtcNow;
    }
}
