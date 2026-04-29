import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../../services/notificationService';
import './Notifications.css';

function PatientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsApi();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsReadApi(id);
      setNotifications(notifications.map(n => 
        n.notificationID === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("فشل تحديث الإشعار");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("فشل تحديث الإشعارات");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="records-loading">
        <div className="custom-spinner"></div>
        <p>جاري تحميل الإشعارات...</p>
      </div>
    );
  }

  return (
    <div className="notifications-container fade-in-up">
      <div className="records-page-header d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h2><Bell className="icon-cyan pulse" size={28} /> الإشعارات</h2>
          <p>تابع آخر التحديثات بخصوص مواعيدك وحسابك.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="mark-all-btn">
            <CheckCircle2 size={16} /> تحديد الكل كمقروء
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-receipt empty-records">
          <Bell size={56} className="text-muted" opacity="0.4" />
          <h4>لا توجد إشعارات حالياً</h4>
          <p>سنقوم بإعلامك فور وجود أي تحديثات جديدة.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, index) => (
            <div 
              key={notif.notificationID + '-' + index} 
              className={`notification-card glass-receipt ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.notificationID)}
            >
              <div className="notification-icon">
                <Bell size={20} className={!notif.isRead ? 'icon-warning pulse' : 'text-muted'} />
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h5>{notif.title}</h5>
                  <span className="time-stamp">
                    <Clock size={12} /> 
                    {new Date(notif.creationDate).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p>{notif.content}</p>
              </div>

              {!notif.isRead && (
                <div className="notification-action" title="تحديد كمقروء">
                  <div className="unread-dot"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientNotifications;