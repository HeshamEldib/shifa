using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Auth
{
    public class ResetPasswordDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "كود التحقق مطلوب")]
        public string OTP { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل")]
        public string NewPassword { get; set; } = string.Empty;
    }
}