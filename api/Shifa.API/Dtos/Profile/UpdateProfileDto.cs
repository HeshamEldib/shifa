using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Profile
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "الاسم بالكامل مطلوب")]
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? Country { get; set; }
        public int? Age { get; set; }
    }
}