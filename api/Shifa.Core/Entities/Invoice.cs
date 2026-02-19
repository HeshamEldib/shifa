using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class Invoice
    {
        [Key]
        public Guid InvoiceID { get; set; } = Guid.NewGuid();

        public Guid AppointmentID { get; set; } = Guid.NewGuid();
        [ForeignKey("AppointmentID")]
        public Appointment Appointment { get; set; } = null!;

        public Guid PatientID { get; set; }

        public bool IsPaid { get; set; } = false;

        public string PaymentMethod { get; set; } = "Cash";

        public DateTime IssueDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(50)]
        public string InvoiceStatus { get; set; } = "Pending";

        public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
