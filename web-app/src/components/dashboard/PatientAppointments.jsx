import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Video, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { getPatientAppointmentsApi, cancelAppointmentApi } from '../../services/appointmentService';
import './appointments.css';

function PatientAppointments() {
  const userId = localStorage.getItem("userId");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      if (userId) {
        const data = await getPatientAppointmentsApi(userId);
        setAppointments(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("app =>", appointments);
  
  const handleCancel = async (appointmentId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) return;
    
    try {
      await cancelAppointmentApi(appointmentId);
      // تحديث الحالة محلياً لتجنب جلب البيانات من السيرفر مرة أخرى
      setAppointments(prev => prev.map(app => 
        app.appointmentID === appointmentId ? { ...app, status: 'Cancelled' } : app
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  // تصفية المواعيد بناءً على الوقت
  const now = new Date();
  const upcomingAppointments = appointments.filter(app => new Date(app.appointmentDate) >= now);
  const pastAppointments = appointments.filter(app => new Date(app.appointmentDate) < now);

  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  // دالة مساعدة لتحديد لون وشكل حالة الموعد
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <span className="status-badge confirmed"><CheckCircle size={14}/> مؤكد</span>;
      case 'Pending': return <span className="status-badge pending"><AlertCircle size={14}/> قيد الانتظار</span>;
      case 'Cancelled': return <span className="status-badge cancelled"><XCircle size={14}/> ملغي</span>;
      case 'Completed': return <span className="status-badge completed"><CheckCircle size={14}/> مكتمل</span>;
      default: return <span className="status-badge"><Clock size={14}/> مجدول</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="records-loading">
        <div className="custom-spinner"></div>
        <p>جاري تحميل المواعيد...</p>
      </div>
    );
  }

  return (
    <div className="appointments-container fade-in-up">
      
      <div className="records-page-header">
        <h2><Calendar className="icon-cyan pulse" size={28} /> حجوزاتي ومواعيدي</h2>
        <p>إدارة مواعيدك القادمة والاطلاع على سجل زياراتك السابقة.</p>
      </div>

      {/* نظام التبويب (Tabs) */}
      <div className="custom-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          المواعيد القادمة ({upcomingAppointments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          المواعيد السابقة ({pastAppointments.length})
        </button>
      </div>

      {error && <div className="records-error">{error}</div>}

      {/* قائمة المواعيد */}
      <div className="appointments-grid">
        {displayAppointments.length === 0 ? (
          <div className="glass-receipt empty-records" style={{ gridColumn: '1 / -1' }}>
            <Calendar size={56} className="text-muted mb-3" opacity="0.5" />
            <h4>لا توجد مواعيد {activeTab === 'upcoming' ? 'قادمة' : 'سابقة'}</h4>
            <p>يمكنك حجز موعد جديد من صفحة الأطباء والخدمات.</p>
          </div>
        ) : (
          displayAppointments.map(app => (
            <div key={app.appointmentID} className="appointment-card glass-receipt">
              
              <div className="appointment-header">
                {getStatusBadge(app.status)}
                {app.type === 'Telemedicine' ? (
                  <span className="type-badge online"><Video size={14}/> أونلاين</span>
                ) : (
                  <span className="type-badge clinic"><MapPin size={14}/> في العيادة</span>
                )}
              </div>

              <div className="appointment-body">
                <h4 className="doctor-name">د. {app.doctorName}</h4>
                <p className="service-name">{app.serviceName}</p>
                
                <div className="time-details">
                  <div className="detail-item">
                    <Calendar size={16} className="icon-cyan" />
                    <span>{new Date(app.appointmentDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} className="icon-cyan" />
                    <span>{new Date(app.appointmentDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات (تظهر فقط في المواعيد القادمة غير الملغاة) */}
              {activeTab === 'upcoming' && app.status !== 'Cancelled' && (
                <div className="appointment-footer">
                  {app.type === 'Telemedicine' && app.status === 'Confirmed' && (
                    <button className="btn-join-call">
                      <Video size={16}/> الانضمام للجلسة
                    </button>
                  )}
                  <button 
                    className="btn-cancel-app" 
                    onClick={() => handleCancel(app.appointmentID)}
                  >
                    <XCircle size={16}/> إلغاء الموعد
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;