namespace Shifa.API.Dtos.Settings
{
    public class PrayerSettingsDto
    {
        public bool BlockPrayerTimes { get; set; }
        public int DefaultMinutesBefore { get; set; }
        public int DefaultMinutesAfter { get; set; }

        // إعدادات خاصة للجمعة
        public int JumuahMinutesBefore { get; set; }
        public int JumuahMinutesAfter { get; set; }
    }
}
