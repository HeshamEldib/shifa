namespace Shifa.API.Dtos.Services
{
    // 1. تفاصيل الطبيب الذي يقدم الخدمة
    public class DoctorInfoForServiceDto
    {
        public Guid DoctorID { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public decimal Price { get; set; } // السعر الخاص بهذا الطبيب
        public int DurationMinutes { get; set; } // المدة الخاصة بهذا الطبيب
    }

    // 2. الخدمة نفسها وبداخلها قائمة الأطباء
    public class ServiceWithDoctorsDto
    {
        public Guid ServiceID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal BasePrice { get; set; } // السعر الاسترشادي (اختياري)

        // قائمة الأطباء المتاحين لهذه الخدمة
        public List<DoctorInfoForServiceDto> AvailableDoctors { get; set; } = new();
    }
}
