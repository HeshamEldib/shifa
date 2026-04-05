using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Auth
{
    public class RegisterStaffDto
    {
        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required]
        [Range(1, 120)]
        public int Age { get; set; } = 1;

        [Required]
        // هنا نسمح بتحديد الدور (2=Doctor, 3=Receptionist, 1=Admin)
        public Guid RoleID { get; set; }
    }
}
