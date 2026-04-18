import React, { useState, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Eye, Filter, User } from 'lucide-react';
import { getAdminAppointmentsApi, updateAppointmentStatusApi } from '../../services/adminAppointmentService';
import './AdminAppointments.css';
import AppointmentDetailDrawer from './AppointmentDetailDrawer';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // فلاتر البحث
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]); 

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminAppointmentsApi();
      
      // تحويل البيانات القادمة من السيرفر لتلائم الواجهة
      const formattedData = data.map(app => {
        const dateObj = new Date(app.appointmentDate);
        return {
          id: app.appointmentID,
          patientName: app.patientName,
          patientPhone: app.patientPhone,
          doctorName: app.doctorName,
          specialty: app.specialty,
          // فصل التاريخ والوقت
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: app.status
        };
      });
      
      setAppointments(formattedData);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لتعديل حالة الموعد
  const handleStatusChange = async (id, newStatus) => {
    const statusTitles = { Confirmed: "تأكيد", Cancelled: "إلغاء", Completed: "إكمال" };
    const confirmMsg = `هل أنت متأكد من ${statusTitles[newStatus]} هذا الموعد؟`;
    
    if (!window.confirm(confirmMsg)) return;

    // 1. التحديث اللحظي في الواجهة (Optimistic Update)
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));

    try {
      // 2. إرسال الطلب للسيرفر
      await updateAppointmentStatusApi(id, newStatus);
    } catch (error) {
      alert(error.message);
      // 3. التراجع إذا فشل الطلب
      loadAppointments(); 
    }
  };

  // تطبيق الفلاتر
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.patientPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesDate = !dateFilter || app.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

  
  return (
    <div className="admin-appointments-page fade-in-up">
      <div className="page-header-flex mb-4">
        <div>
          <h2 className="text-white mb-1">المواعيد الشاملة</h2>
          <p className="text-muted m-0">مراقبة وإدارة جميع حجوزات العيادة، مع صلاحية التعديل والإلغاء.</p>
        </div>
      </div>

      {/* شريط الفلاتر والبحث */}
      <div className="admin-filters-bar glass-receipt mb-4">
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="بحث باسم المريض، الطبيب، الهاتف..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <CalendarIcon size={16} className="text-cyan" />
            <input 
              type="date" 
              className="custom-date-picker"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button className="btn-clear-date" onClick={() => setDateFilter('')}>الكل</button>
            )}
          </div>

          <div className="filter-item">
            <Filter size={16} className="text-cyan" />
            <select 
              className="custom-select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">جميع الحالات</option>
              <option value="Pending">قيد الانتظار</option>
              <option value="Confirmed">مؤكدة</option>
              <option value="Completed">مكتملة</option>
              <option value="Cancelled">ملغاة</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول المواعيد */}
      <div className="admin-table-container glass-receipt">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CalendarIcon size={48} opacity="0.3" className="mb-3" />
            <h5>لا توجد مواعيد مطابقة للبحث أو التاريخ المحدد</h5>
          </div>
        ) : (
          <table className="custom-admin-table">
            <thead>
              <tr>
                <th>المريض</th>
                <th>الطبيب المعالج</th>
                <th>التاريخ والوقت</th>
                <th>الحالة</th>
                <th>إدارة الموعد</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="font-weight-bold text-white">{app.patientName}</span>
                      <span className="text-muted small">{app.patientPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="doctor-mini-avatar"><User size={14}/></div>
                      <div className="d-flex flex-column">
                        <span className="text-white">{app.doctorName}</span>
                        <span className="text-cyan small">{app.specialty}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="datetime-cell">
                      <span className="date-text"><CalendarIcon size={14}/> {new Date(app.date).toLocaleDateString('ar-EG')}</span>
                      <span className="time-text"><Clock size={14}/> {app.time}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                      {app.status === 'Pending' ? 'انتظار' :
                       app.status === 'Confirmed' ? 'مؤكد' :
                       app.status === 'Completed' ? 'مكتمل' : 'ملغى'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
<button className="btn-icon-action view" onClick={() => {
    setSelectedAppId(app.id);
    setIsDrawerOpen(true);
}}>
  <Eye size={18} />
</button>                      
                      {app.status === 'Pending' && (
                        <button className="btn-icon-action approve" onClick={() => handleStatusChange(app.id, 'Confirmed')} title="تأكيد الحجز">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {(app.status === 'Pending' || app.status === 'Confirmed') && (
                        <button className="btn-icon-action reject" onClick={() => handleStatusChange(app.id, 'Cancelled')} title="إلغاء الموعد">
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


<AppointmentDetailDrawer
    appointmentId={selectedAppId} 
    isOpen={isDrawerOpen} 
    onClose={() => setIsDrawerOpen(false)} 
/>
    </div>
  );
}

export default AdminAppointments;