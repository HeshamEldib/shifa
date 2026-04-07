using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class User
    {
        [Key]
        public Guid UserID { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(20)]
        public string? Gender { get; set; }

        [MaxLength(50)]
        public string? Country { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [Range(1, 120)]
        public int? Age { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string? Image { get; set; }

        public Doctor? Doctor { get; set; }
        public Patient? Patient { get; set; }
        
        // العلاقة مع الدور (Foreign Key)
        [ForeignKey("Role")]
        public Guid RoleID { get; set; }
        public Role Role { get; set; } = null!; // خاصية التنقل (Navigation Property)
    }
}
