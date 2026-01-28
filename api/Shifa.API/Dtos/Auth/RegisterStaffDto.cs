using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Auth
{
    public class RegisterStaffDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        // هنا نسمح بتحديد الدور (2=Doctor, 3=Receptionist, 1=Admin)
        public Guid RoleID { get; set; }
    }
}
