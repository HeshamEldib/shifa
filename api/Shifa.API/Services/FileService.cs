using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Shifa.API.Services
{
    // 1. تعريف الواجهة (Interface)
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string folderName);
        void DeleteFile(string fileUrl);
    }

    // 2. التنفيذ (Implementation)
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0) 
                throw new ArgumentException("الملف فارغ");

            // الوصول لمجلد wwwroot الأساسي
            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsFolder = Path.Combine(webRootPath, folderName);

            // إنشاء المجلد إذا لم يكن موجوداً
            if (!Directory.Exists(uploadsFolder)) 
                Directory.CreateDirectory(uploadsFolder);

            // إنشاء اسم فريد للملف باستخدام Guid لتجنب تعارض الأسماء
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // حفظ الملف فعلياً على السيرفر
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // إرجاع المسار النسبي لحفظه في قاعدة البيانات
            return $"/{folderName}/{uniqueFileName}";
        }

        public void DeleteFile(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            // إزالة الشرطة المائلة الأولى (/) لكي يتم دمج المسار بشكل صحيح
            var relativePath = fileUrl.TrimStart('/'); 
            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var fullPath = Path.Combine(webRootPath, relativePath);

            // التحقق من وجود الملف فعلياً على السيرفر، ثم حذفه
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
}