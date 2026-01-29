using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.DoctorServices
{
    public class AddDoctorServiceDto
    {
        [Required]
        public Guid ServiceID { get; set; }

        [Required]
        [Range(0, 100000)]
        public decimal Price { get; set; }

        [Required]
        [Range(5, 480)]
        public int DurationMinutes { get; set; }
    }
}
