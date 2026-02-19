namespace Shifa.API.Dtos.DoctorServices
{
    public class DoctorServiceResponseDto
    {
        public Guid Id { get; set; }
        public Guid ServiceID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
    }
}
