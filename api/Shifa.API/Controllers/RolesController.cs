using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.Infrastructure.Data;
using Shifa.Core.Entities;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        // هذه الدالة ستعيد القائمة للفرونت إند لملء الـ Dropdown
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            //.Where(r => r.RoleName != "Patient") // اختياري: إذا أردت استبعاد المرضى من القائمة
            var roles = await _context.Roles
                .Select(r => new { r.RoleID, r.RoleName })
                .ToListAsync();

            return Ok(roles);
        }
    }
}
