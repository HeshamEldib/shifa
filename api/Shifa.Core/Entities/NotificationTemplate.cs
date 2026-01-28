using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class NotificationTemplate
    {
        [Key]
        public Guid TemplateID { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string EventType { get; set; } = string.Empty; // Unique

        [Required]
        [MaxLength(255)]
        public string TitleTemplate { get; set; } = string.Empty;

        [Required]
        public string ContentTemplate { get; set; } = string.Empty;

        public bool IsEnabled { get; set; } = true;
    }
}
