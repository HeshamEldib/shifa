using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shifa.API.Dtos.Notifications;
using Shifa.Infrastructure.Data;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Shifa.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // كل الإشعارات تتطلب تسجيل الدخول
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. جلب إشعارات المستخدم الحالي (الأحدث أولاً)
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized();

            var notifications = await _context.UserNotificationStatuses
                .Include(ns => ns.Notification) // جلب محتوى الإشعار المرتبط
                .Where(ns => ns.RecipientUserID == userId)
                .OrderByDescending(ns => ns.Notification.CreationDate)
                .Select(ns => new NotificationDto
                {
                    NotificationID = ns.NotificationID,
                    Title = ns.Notification.Title,
                    Content = ns.Notification.Content,
                    CreationDate = ns.Notification.CreationDate,
                    IsRead = ns.ReadStatus
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // 2. جلب عدد الإشعارات غير المقروءة (لأيقونة الجرس في الهيدر)
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out Guid userId)) return Unauthorized();

            var count = await _context.UserNotificationStatuses
                .Where(ns => ns.RecipientUserID == userId && !ns.ReadStatus)
                .CountAsync();

            return Ok(new { Count = count });
        }

        // 3. تحديد إشعار كمقروء
        [HttpPut("{notificationId}/read")]
        public async Task<IActionResult> MarkAsRead(Guid notificationId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out Guid userId)) return Unauthorized();

            var status = await _context.UserNotificationStatuses
                .FirstOrDefaultAsync(ns => ns.NotificationID == notificationId && ns.RecipientUserID == userId);

            if (status == null) return NotFound();

            if (!status.ReadStatus)
            {
                status.ReadStatus = true;
                status.ReadDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        // 4. تحديد كل الإشعارات كمقروءة دفعة واحدة
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out Guid userId)) return Unauthorized();

            var unreadStatuses = await _context.UserNotificationStatuses
                .Where(ns => ns.RecipientUserID == userId && !ns.ReadStatus)
                .ToListAsync();

            if (unreadStatuses.Any())
            {
                foreach (var status in unreadStatuses)
                {
                    status.ReadStatus = true;
                    status.ReadDate = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}