using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
    public class InvoiceItem
    {
        [Key]
        public Guid ItemID { get; set; } = Guid.NewGuid();

        public Guid InvoiceID { get; set; } = Guid.NewGuid();
        [ForeignKey("InvoiceID")]
        public Invoice Invoice { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string ItemName { get; set; } = string.Empty;

        public int Quantity { get; set; } = 1;

        [Column(TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }
    }
}
