using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Shifa.Core.Entities
{
    public class Role
    {
        [Key]
        public Guid RoleID { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; } = string.Empty;

        // علاقة عكسية: الدور الواحد يملكه مستخدمون كثر
        // (ICollection is better for performance in EF Core than List)
        public ICollection<User> Users { get; set; } = new HashSet<User>();
    }
}
