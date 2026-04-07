using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;
using System.Threading.Tasks;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicationsController(AppDbContext context)
        {
            _context = context;
        }

        // إضافة دواء جديد
        [HttpPost]
        public async Task<IActionResult> AddMedication([FromBody] Medication medication)
        {
            _context.Medications.Add(medication);
            await _context.SaveChangesAsync();
            return Ok(medication);
        }

        // جلب كل الأدوية
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Medications.ToListAsync());
        }
    }
}