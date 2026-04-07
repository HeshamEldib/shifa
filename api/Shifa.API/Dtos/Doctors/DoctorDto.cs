namespace Shifa.API.Dtos.Doctors
{
    public class DoctorDto
    {
        public Guid DoctorID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Image { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? Country { get; set; }
        public string? Address { get; set; }
        public string? Specialization { get; set; }
        public string? Specialty { get; set; }
        public string? Quote { get; set; }
        public string? Bio { get; set; }
        public int? ExperienceYears { get; set; }
        public double Rating { get; set; }
        public int PatientsCount { get; set; }
    }
}
