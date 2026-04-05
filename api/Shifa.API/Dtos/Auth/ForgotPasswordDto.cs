using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Auth
{
    public class ForgotPasswordDto
    {
        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}