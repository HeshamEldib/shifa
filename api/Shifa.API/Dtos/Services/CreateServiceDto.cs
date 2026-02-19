using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Services
{
    public class CreateServiceDto
    {
        [Required(ErrorMessage = "اسم الخدمة مطلوب")]
        [MaxLength(255)]
        public string ServiceName { get; set; } = string.Empty;

        [Required]
        [Range(5, 480, ErrorMessage = "مدة الخدمة يجب أن تكون بين 5 دقائق و 8 ساعات")]
        public int DefaultDurationMinutes { get; set; } // مدة الخدمة بالدقائق

        [Required]
        [Range(0, 100000, ErrorMessage = "السعر يجب أن يكون قيمة موجبة")]
        public decimal BasePrice { get; set; } // السعر الأساسي
    }
}
