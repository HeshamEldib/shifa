using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Service
    {
        [Key]
        public Guid ServiceID { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(255)]
        public string ServiceName { get; set; } = string.Empty;

        public int DefaultDurationMinutes { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal BasePrice { get; set; }

        public ICollection<DoctorService> DoctorServices { get; set; } = new List<DoctorService>();
    }
}
