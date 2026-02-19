using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class UserNotificationStatus
    {
        [Key]
        public long StatusID { get; set; }

        public Guid NotificationID { get; set; } = Guid.NewGuid();
        [ForeignKey("NotificationID")]
        public Notification Notification { get; set; } = null!;

        public Guid RecipientUserID { get; set; }
        [ForeignKey("RecipientUserID")]
        public User Recipient { get; set; } = null!;

        public bool ReadStatus { get; set; } = false;
        public DateTime? ReadDate { get; set; }
    }
}
