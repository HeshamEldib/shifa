using System;

namespace Shifa.API.Dtos.Notifications
{
    public class NotificationDto
    {
        public Guid NotificationID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public bool IsRead { get; set; }
    }
}