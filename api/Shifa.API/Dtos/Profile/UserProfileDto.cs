namespace Shifa.API.Dtos.Profile
{
    public class UserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? Country { get; set; }
        public int? Age { get; set; }
        public string Role { get; set; } = string.Empty;
        public string? Image { get; set; }
        public DateTime CreatedDate { get; set; }

        public string? Specialization { get; set; }
        public string? Specialty { get; set; }
        public string? Quote { get; set; }
        public string? Bio { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Address { get; set; }
        public double? Rating { get; set; }
        public int? PatientsCount { get; set; }

        public string? BloodType { get; set; }
        public string? Job { get; set; }
        public string? EmergencyContact { get; set; }
        public double? Weight { get; set; }
        public double? Height { get; set; }
        public string? PatientNotes { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}