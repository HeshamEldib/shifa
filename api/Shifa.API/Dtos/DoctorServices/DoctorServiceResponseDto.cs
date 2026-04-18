using System;

namespace Shifa.API.Dtos.DoctorServices
{
    public class DoctorServiceResponseDto
    {
        public Guid ServiceID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Rating { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
        public string Type { get; set; }
        public string DoctorName { get; set; } = string.Empty;
    }
}