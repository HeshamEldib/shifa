using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Notification
    {
        [Key]
        public Guid NotificationID { get; set; } = Guid.NewGuid();

        public Guid? SenderUserID { get; set; }
        [ForeignKey("SenderUserID")]
        public User? Sender { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        public ICollection<UserNotificationStatus> RecipientStatuses { get; set; } = new List<UserNotificationStatus>();
    }
}
