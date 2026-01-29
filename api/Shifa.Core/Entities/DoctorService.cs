using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    // جدول وسيط يربط الطبيب بالخدمة ويحدد تفاصيلها الخاصة
    public class DoctorService
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid DoctorID { get; set; }
        [ForeignKey("DoctorID")]
        public User Doctor { get; set; } = null!;

        public Guid ServiceID { get; set; }
        [ForeignKey("ServiceID")]
        public Service Service { get; set; } = null!;

        // السعر الخاص بهذا الطبيب (مثلاً الاستشاري أغلى من المبتدئ)
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // المدة الخاصة بهذا الطبيب (بالدقائق)
        public int DurationMinutes { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
