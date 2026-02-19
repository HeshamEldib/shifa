using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Doctors
{
    public class AvailabilityDto
    {
        public Guid AvailabilityID { get; set; }

        [Required]
        [Range(0, 6, ErrorMessage = "يجب اختيار يوم صحيح (0 = الأحد, 6 = السبت)")]
        public int DayOfWeek { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }
    }
}
