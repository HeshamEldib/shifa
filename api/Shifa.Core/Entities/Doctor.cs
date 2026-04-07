using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shifa.Core.Entities
{
  public class Doctor
  {
    [Key]
    // ملاحظة: هنا نجعل الـ Key يدوي وليس تلقائي لأنه مرتبط بالـ UserID
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid DoctorID { get; set; } = Guid.NewGuid();

    [ForeignKey("DoctorID")]
    public User User { get; set; } = null!;

    // public DateTime DateOfBirth { get; set; }
    // [MaxLength(10)]

    public string Specialization { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Quote { get; set; }

    [MaxLength(555)]
    public string? Bio { get; set; }
    public double Rating { get; set; } = 0.0;
    public int ExperienceYears { get; set; } = 0;
    public int PatientsCount { get; set; } = 0;
  }
}
