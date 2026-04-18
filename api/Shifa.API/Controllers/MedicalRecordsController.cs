using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.MedicalRecords;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // حماية الـ Endpoint
    public class MedicalRecordsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicalRecordsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. إضافة سجل طبي جديد (مع الروشتة)
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddRecord([FromBody] CreateMedicalRecordDto dto)
        {
            var doctorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(doctorIdClaim, out Guid doctorId)) 
                return Unauthorized("يجب تسجيل الدخول كطبيب");

            var patientExists = await _context.Patients.AnyAsync(p => p.PatientID == dto.PatientID);
            if (!patientExists) 
                return NotFound("المريض غير موجود في النظام");

            // 👈 الطريقة الصحيحة: ننشئ السجل ونضع بداخله الروشتة ليتولى EF Core الربط تلقائياً
            var newRecord = new MedicalRecord
            {
                PatientID = dto.PatientID,
                DoctorID = doctorId,
                AppointmentID = dto.AppointmentID, // إذا كان هناك موعد مرتبط، نربطه بالسجل
                VisitDate = dto.VisitDate,
                ChiefComplaint = dto.ChiefComplaint,
                DiagnosisDetails = dto.DiagnosisDetails, // سيتم تشفيره تلقائياً
                TreatmentPlan = dto.TreatmentPlan,
                VitalSignsJson = dto.VitalSignsJson,
                
                // إضافة الأدوية مباشرة داخل الكائن الأب (Navigation Property)
                Prescriptions = dto.Prescriptions?.Select(item => new Prescription
                {
                    MedicationID = item.MedicationID,
                    Dosage = item.Dosage,
                    Frequency = item.Frequency,
                    Duration = item.Duration,
                    Instructions = item.Instructions
                }).ToList() ?? new List<Prescription>()
            };

            // نضيف السجل الأب فقط، وهو سيأخذ أبناءه (الروشتات) معه إلى الداتا بيز
            _context.MedicalRecords.Add(newRecord);
            
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم حفظ السجل الطبي والروشتة بنجاح", RecordId = newRecord.RecordID });
        }

        // 2. عرض التاريخ المرضي لمريض معين
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetPatientRecords(Guid patientId)
        {
            var records = await _context.MedicalRecords
                .Include(m => m.Doctor) // لجلب اسم الطبيب المعالج
                .Include(m => m.Prescriptions)
                    .ThenInclude(p => p.Medication) // لجلب تفاصيل الأدوية من الروشتة
                .Where(m => m.PatientID == patientId)
                .OrderByDescending(m => m.VisitDate) // الترتيب من الأحدث للأقدم
                .Select(m => new 
                {
                    m.RecordID,
                    m.PatientID,
                    m.DoctorID,
                    m.AppointmentID,
                    m.VisitDate,
                    DoctorName = m.Doctor.FullName,
                    m.ChiefComplaint,
                    
                    // السحر يحدث هنا أيضاً: EF Core سيقوم بفك التشفير تلقائياً وتعود الكلمة مقروءة
                    m.DiagnosisDetails, 
                    
                    m.TreatmentPlan,
                    m.VitalSignsJson,
                    Prescriptions = m.Prescriptions.Select(p => new 
                    {
                        p.PrescriptionID,
                        MedicationName = p.Medication.Name,
                        p.Dosage,
                        p.Frequency,
                        p.Duration,
                        p.Instructions
                    })
                })
                .ToListAsync();

            if (!records.Any())
                return NotFound("لا توجد سجلات طبية لهذا المريض");

            return Ok(records);
        }
    }
}