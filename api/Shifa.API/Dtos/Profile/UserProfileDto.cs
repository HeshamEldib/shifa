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
    }
}