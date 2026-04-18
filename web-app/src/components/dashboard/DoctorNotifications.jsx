import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, CalendarClock, AlertCircle, User, Info, Circle } from 'lucide-react';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../../services/notificationService';
import './DoctorNotifications.css';

function DoctorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotificationsApi();
      // افتراضياً، نعرض أحدث الإشعارات في الأعلى
      setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("خطأ في جلب الإشعارات", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id, relatedLink) => {
    try {
      // تحديث الواجهة فوراً (Optimistic UI)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      
      await markAsReadApi(id);
      
      // التوجيه الذكي إذا كان الإشعار يحتوي على رابط (مثال: /doctor/appointments)
      if (relatedLink) {
        navigate(relatedLink);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      await markAllAsReadApi();
    } catch (error) {
      console.error(error);
    }
  };

  // دالة مساعدة لاختيار الأيقونة بناءً على نوع الإشعار
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Appointment': return <CalendarClock className="text-cyan" size={24} />;
      case 'System': return <AlertCircle className="text-warning" size={24} />;
      case 'Patient': return <User className="text-purple" size={24} />;
      default: return <Info className="text-muted" size={24} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

  return (
    <div className="notifications-page fade-in-up">
      <div className="page-header-flex mb-4">
        <div>
          <h2 className="text-white mb-1 d-flex align-items-center gap-2">
            <Bell className="text-cyan" size={28}/> 
            الإشعارات 
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </h2>
          <p className="text-muted m-0">تابع أحدث الحجوزات، الإلغاءات، وتنبيهات النظام.</p>
        </div>
        
        {unreadCount > 0 && (
          <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
            <CheckCheck size={18} /> تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state text-center glass-receipt">
            <Bell size={48} className="text-muted mb-3" opacity="0.3" />
            <h5 className="text-white">لا توجد إشعارات حالياً</h5>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card glass-receipt ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(notification.id, notification.relatedLink)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="n-header">
                  <h5 className="m-0 text-white">{notification.title}</h5>
                  <span className="n-time">{new Date(notification.createdAt).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                </div>
                <p className="n-message text-muted mt-1 mb-0">{notification.message}</p>
              </div>

              {!notification.isRead && (
                <div className="unread-indicator">
                  <Circle size={10} className="text-cyan fill-cyan" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorNotifications;