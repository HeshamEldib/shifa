namespace Shifa.API.Dtos.Services
{
    public class ServiceDto
    {
        public Guid ServiceID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public int DefaultDurationMinutes { get; set; }
        public decimal BasePrice { get; set; }
    }
}
