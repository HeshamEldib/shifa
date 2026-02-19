using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Settings;
using Shifa.Core.Constants;
using Shifa.Core.Entities;
using Shifa.Infrastructure.Data;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. جلب الإعدادات الحالية (للعرض في لوحة تحكم الأدمن)
        [HttpGet("prayer-settings")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<ActionResult<PrayerSettingsDto>> GetPrayerSettings()
        {
            var settings = await _context.ClinicSettings.ToListAsync();

            // دالة مساعدة لاستخراج القيمة أو استخدام الافتراضي
            T GetVal<T>(string key, T defaultVal)
            {
                var item = settings.FirstOrDefault(s => s.SettingKey == key);
                return item != null ? (T)Convert.ChangeType(item.SettingValue, typeof(T)) : defaultVal;
            }

            var dto = new PrayerSettingsDto
            {
                BlockPrayerTimes = GetVal("BlockPrayerTimes", true),
                DefaultMinutesBefore = GetVal("Default_MinutesBefore", 15),
                DefaultMinutesAfter = GetVal("Default_MinutesAfter", 20),
                JumuahMinutesBefore = GetVal("Duration_Before_Jumuah", 30),
                JumuahMinutesAfter = GetVal("Duration_After_Jumuah", 45)
            };

            return Ok(dto);
        }

        // 2. تحديث الإعدادات
        [HttpPut("prayer-settings")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<IActionResult> UpdatePrayerSettings(PrayerSettingsDto dto)
        {
            await UpsertSetting("BlockPrayerTimes", dto.BlockPrayerTimes.ToString());
            await UpsertSetting("Default_MinutesBefore", dto.DefaultMinutesBefore.ToString());
            await UpsertSetting("Default_MinutesAfter", dto.DefaultMinutesAfter.ToString());
            await UpsertSetting("Duration_Before_Jumuah", dto.JumuahMinutesBefore.ToString());
            await UpsertSetting("Duration_After_Jumuah", dto.JumuahMinutesAfter.ToString());

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث إعدادات الصلاة بنجاح" });
        }

        // دالة مساعدة للتحديث أو الإضافة (Update or Insert)
        private async Task UpsertSetting(string key, string value)
        {
            var setting = await _context.ClinicSettings.FindAsync(key);
            if (setting == null)
            {
                _context.ClinicSettings.Add(new ClinicSetting { SettingKey = key, SettingValue = value });
            }
            else
            {
                setting.SettingValue = value;
            }
        }
    }
}
