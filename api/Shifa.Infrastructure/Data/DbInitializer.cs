using Microsoft.EntityFrameworkCore;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Shifa.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            // 1. تطبيق الهجرات المعلقة وإنشاء قاعدة البيانات إذا لم تكن موجودة
            await context.Database.MigrateAsync();

            // 2. التحقق: هل يوجد أي أدوار في الجدول؟
            if (await context.Roles.AnyAsync())
            {
                return; // البيانات موجودة بالفعل، لا داعي لعمل شيء
            }

            // 3. إذا لم توجد أدوار، قم بإضافتها
            var roles = new List<Role>
            {
                new Role { RoleName = AppRoles.Admin },
                new Role { RoleName = AppRoles.Doctor },
                new Role { RoleName = AppRoles.Receptionist },
                new Role { RoleName = AppRoles.Patient }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }
    }
}
