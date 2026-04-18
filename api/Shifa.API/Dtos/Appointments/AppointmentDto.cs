namespace Shifa.API.Dtos.Appointments
{
    public class AppointmentDto
    {
        public Guid AppointmentID { get; set; }
        public Guid DoctorID { get; set; }
        public Guid PatientID { get; set; }
        public Guid ServiceID { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool HasMedicalRecord { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}
