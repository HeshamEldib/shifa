using Microsoft.EntityFrameworkCore;
using Shifa.Infrastructure.Data;

namespace Shifa.API.Services
{
    public class SettingsService
    {
        private readonly AppDbContext _context;

        public SettingsService(AppDbContext context)
        {
            _context = context;
        }

        // دالة لجلب قيمة إعداد معين، مع قيمة افتراضية إذا لم يكن موجوداً
        public async Task<T> GetSettingAsync<T>(string key, T defaultValue)
        {
            var setting = await _context.ClinicSettings.FindAsync(key);

            if (setting == null) return defaultValue;

            try
            {
                // تحويل النص (String) إلى النوع المطلوب (bool, int, etc.)
                return (T)Convert.ChangeType(setting.SettingValue, typeof(T));
            }
            catch
            {
                return defaultValue;
            }
        }
    }
}
