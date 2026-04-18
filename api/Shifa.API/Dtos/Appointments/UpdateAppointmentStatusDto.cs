namespace Shifa.API.Dtos.Appointments
{
    public class UpdateAppointmentStatusDto
    {
        public string Status { get; set; } // الأرقام المسموحة: Pending, Confirmed, Completed, Cancelled
    }
}