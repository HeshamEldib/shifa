using System;

namespace Shifa.API.Dtos.Services
{
    public class ServiceDto
    {
        public Guid ServiceID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public double Rating { get; set; }

        // 👈 بيانات الطبيب مقدم الخدمة لكي تظهر في الكارت
        public Guid DoctorID { get; set; }
        public string DoctorName { get; set; } = string.Empty;
    }
}