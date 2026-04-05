namespace Shifa.API.Dtos.Doctors
{
    public class DoctorDto
    {
        public Guid DoctorID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }
}
