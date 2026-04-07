using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.DoctorServices
{
    public class AddDoctorServiceDto
    {
        [Required(ErrorMessage = "اسم الخدمة مطلوب")]
        [MaxLength(100)]
        public string ServiceName { get; set; } = string.Empty;

        [Required(ErrorMessage = "تصنيف أو قسم الخدمة مطلوب")]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int DurationMinutes { get; set; }
    }
}