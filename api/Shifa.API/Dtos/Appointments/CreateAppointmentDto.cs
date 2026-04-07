using System.ComponentModel.DataAnnotations;

namespace Shifa.API.Dtos.Appointments
{
    public class CreateAppointmentDto
    {
        [Required]
        public Guid DoctorID { get; set; }

        [Required]
        public Guid ServiceID { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        public string Notes { get; set; } = string.Empty;
    }
}
