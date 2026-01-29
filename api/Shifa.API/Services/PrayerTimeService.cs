using Newtonsoft.Json.Linq;

namespace Shifa.API.Services
{
    public class TimeRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class PrayerTimeService
    {
        private readonly HttpClient _httpClient;
        private readonly SettingsService _settingsService;

        public PrayerTimeService(HttpClient httpClient, SettingsService settingsService)
        {
            _httpClient = httpClient;
            _settingsService = settingsService;
        }

        public async Task<List<TimeRange>> GetPrayerBlockersAsync(DateTime date)
        {
            var blockers = new List<TimeRange>();

            // 1. هل الميزة مفعلة؟
            bool blockEnabled = await _settingsService.GetSettingAsync<bool>("BlockPrayerTimes", true);
            if (!blockEnabled) return blockers;

            // 2. جلب الإعدادات الافتراضية العامة (لأي صلاة ليس لها إعداد خاص)
            int defaultBefore = await _settingsService.GetSettingAsync<int>("Default_MinutesBefore", 15);
            int defaultAfter = await _settingsService.GetSettingAsync<int>("Default_MinutesAfter", 20);

            // 3. جلب المواقيت مع أسمائها (Dictionary)
            var prayerTimes = await GetPrayerTimesWithNamesFromApi(date);

            foreach (var prayer in prayerTimes)
            {
                string prayerName = prayer.Key; // Fajr, Dhuhr, Asr...
                DateTime prayerTime = prayer.Value;

                // 4. تحديد المدة الخاصة بناءً على اسم الصلاة
                int minutesBefore = defaultBefore;
                int minutesAfter = defaultAfter;

                // التعامل الخاص مع يوم الجمعة (Jumuah)
                if (date.DayOfWeek == DayOfWeek.Friday && prayerName == "Dhuhr")
                {
                    // يوم الجمعة، الظهر يصبح جمعة -> نبحث عن إعداد "Duration_Jumuah"
                    // الافتراضي للجمعة عادة أطول (مثلاً 45 دقيقة للصلاة والخطبة)
                    minutesAfter = await _settingsService.GetSettingAsync<int>("Duration_After_Jumuah", 45);
                    minutesBefore = await _settingsService.GetSettingAsync<int>("Duration_Before_Jumuah", 30);
                }
                else
                {
                    // محاولة جلب إعداد خاص لهذه الصلاة تحديداً (مثلاً: Duration_After_Maghrib)
                    // إذا لم يوجد، نستخدم الافتراضي (defaultValue: defaultAfter)
                    minutesAfter = await _settingsService.GetSettingAsync<int>($"Duration_After_{prayerName}", defaultAfter);
                    minutesBefore = await _settingsService.GetSettingAsync<int>($"Duration_Before_{prayerName}", defaultBefore);
                }

                // 5. إنشاء فترة الحظر
                blockers.Add(new TimeRange
                {
                    Start = prayerTime.AddMinutes(-minutesBefore),
                    End = prayerTime.AddMinutes(minutesAfter),
                    Reason = date.DayOfWeek == DayOfWeek.Friday && prayerName == "Dhuhr" ? "Jumuah Prayer" : $"{prayerName} Prayer"
                });
            }

            return blockers;
        }

        // دالة محدثة ترجع الاسم والوقت
        private async Task<Dictionary<string, DateTime>> GetPrayerTimesWithNamesFromApi(DateTime date)
        {
            var result = new Dictionary<string, DateTime>();
            try
            {
                double lat = 29.3084; // الفيوم
                double lng = 30.8428;
                string dateStr = date.ToString("dd-MM-yyyy");

                string url = $"https://api.aladhan.com/v1/timings/{dateStr}?latitude={lat}&longitude={lng}&method=5";

                var response = await _httpClient.GetStringAsync(url);
                var json = JObject.Parse(response);
                var timings = json["data"]?["timings"];

                if (timings == null) return result;

                string[] targetPrayers = { "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha" };

                foreach (var name in targetPrayers)
                {
                    string timeStr = timings[name]?.ToString() ?? "";
                    timeStr = timeStr.Split(' ')[0];

                    if (TimeSpan.TryParse(timeStr, out TimeSpan time))
                    {
                        result.Add(name, date.Date.Add(time));
                    }
                }
            }
            catch
            {
                // يمكن إضافة Log هنا
            }
            return result;
        }

        public async Task<bool> IsDuringPrayerTimeAsync(DateTime appointmentStart, DateTime appointmentEnd)
        {
            // 1. جلب فترات الحظر لهذا اليوم باستخدام الدالة الجديدة
            var blockers = await GetPrayerBlockersAsync(appointmentStart);

            // 2. هل يوجد أي تقاطع؟
            // معادلة التقاطع: (بداية الموعد < نهاية الحظر) AND (نهاية الموعد > بداية الحظر)
            return blockers.Any(b => appointmentStart < b.End && appointmentEnd > b.Start);
        }
    }
}
