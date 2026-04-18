import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCheck, Clock, ShieldAlert } from 'lucide-react';
import { getAdminNotificationsApi, sendBroadcastApi } from '../../services/adminNotificationService';
import './AdminNotifications.css';

function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('view'); // 'view' أو 'send'
  
  // حالات عرض الإشعارات
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // حالات نموذج الإرسال (تم تحديث message إلى content)
  const [broadcastForm, setBroadcastForm] = useState({ targetAudience: 'All', title: '', content: '' });
  const [isSending, setIsSending] = useState(false);

  // جلب الإشعارات عند فتح تبويب العرض
  useEffect(() => {
    if (activeTab === 'view') {
      loadNotifications();
    }
  }, [activeTab]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminNotificationsApi();
      setNotifications(data);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await sendBroadcastApi(broadcastForm);
      alert(res.message || "تم إرسال الإشعار بنجاح");
      // تفريغ النموذج بعد الإرسال
      setBroadcastForm({ targetAudience: 'All', title: '', content: '' });
    } catch (error) {
      alert(error.message || "حدث خطأ أثناء الإرسال");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="admin-notifications-page fade-in-up">
      <div className="page-header-flex mb-4">
        <div>
          <h2 className="text-white mb-1 d-flex align-items-center gap-2">
            <Bell className="text-cyan"/> مركز الإشعارات والتعميمات
          </h2>
          <p className="text-muted m-0">متابعة تنبيهات النظام وإرسال التعميمات للكادر الطبي والمرضى.</p>
        </div>
      </div>

      {/* شريط التبويبات */}
      <div className="tabs-container glass-receipt mb-4">
        <button 
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`} 
          onClick={() => setActiveTab('view')}
        >
          <Bell size={18} /> الإشعارات الواردة
        </button>
        <button 
          className={`tab-btn ${activeTab === 'send' ? 'active' : ''}`} 
          onClick={() => setActiveTab('send')}
        >
          <Send size={18} /> إرسال تعميم (Broadcast)
        </button>
      </div>

      {/* ----------------- تبويب: عرض الإشعارات ----------------- */}
      {activeTab === 'view' && (
        <div className="notifications-list glass-receipt">
          {isLoading ? (
            <div className="text-center py-5"><span className="custom-spinner"></span></div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <CheckCheck size={48} opacity="0.3" className="mb-3"/>
              <h5>لا توجد إشعارات جديدة</h5>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.notificationID} className={`notification-card ${notif.isRead ? 'read' : 'unread'}`}>
                <div className="notif-icon">
                  <ShieldAlert size={20} className={notif.isRead ? "text-muted" : "text-cyan"}/>
                </div>
                <div className="notif-content">
                  <h5 className="text-white m-0 mb-1">{notif.title}</h5>
                  <p className="text-muted m-0 text-sm">{notif.content}</p>
                  <span className="notif-time mt-2 d-block">
                    <Clock size={12}/> {new Date(notif.creationDate).toLocaleString('ar-EG')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ----------------- تبويب: إرسال إشعار ----------------- */}
      {activeTab === 'send' && (
        <div className="broadcast-form-container glass-receipt">
          <h4 className="text-white mb-4 d-flex align-items-center gap-2">
            <Send className="text-cyan"/> إنشاء تعميم إداري جديد
          </h4>
          
          <form onSubmit={handleSendBroadcast} className="admin-form">
            <div className="form-group mb-4">
              <label>الفئة المستهدفة</label>
              <div className="audience-selector">
                <label className={`audience-option ${broadcastForm.targetAudience === 'All' ? 'active' : ''}`}>
                  <input type="radio" name="audience" value="All" checked={broadcastForm.targetAudience === 'All'} onChange={e => setBroadcastForm({...broadcastForm, targetAudience: e.target.value})} /> 
                  <Users size={18}/> الجميع
                </label>
                <label className={`audience-option ${broadcastForm.targetAudience === 'Doctors' ? 'active' : ''}`}>
                  <input type="radio" name="audience" value="Doctors" checked={broadcastForm.targetAudience === 'Doctors'} onChange={e => setBroadcastForm({...broadcastForm, targetAudience: e.target.value})} /> 
                  <Users size={18}/> الأطباء فقط
                </label>
                <label className={`audience-option ${broadcastForm.targetAudience === 'Patients' ? 'active' : ''}`}>
                  <input type="radio" name="audience" value="Patients" checked={broadcastForm.targetAudience === 'Patients'} onChange={e => setBroadcastForm({...broadcastForm, targetAudience: e.target.value})} /> 
                  <Users size={18}/> المرضى فقط
                </label>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>عنوان الإشعار</label>
              <input required className="custom-input" placeholder="مثال: تحديث في مواعيد العمل، عطلة رسمية..." value={broadcastForm.title} onChange={e => setBroadcastForm({...broadcastForm, title: e.target.value})} />
            </div>

            <div className="form-group mb-4">
              <label>محتوى الإشعار</label>
              <textarea required className="custom-input" rows="4" placeholder="اكتب التفاصيل هنا..." value={broadcastForm.content} onChange={e => setBroadcastForm({...broadcastForm, content: e.target.value})} />
            </div>

            <div className="text-left">
              <button type="submit" className="btn-primary-action px-5" disabled={isSending}>
                {isSending ? <span className="custom-spinner-sm"></span> : <><Send size={18}/> إرسال الإشعار الآن</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;