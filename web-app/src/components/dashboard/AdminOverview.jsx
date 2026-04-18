import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Activity, CheckCircle, Clock } from 'lucide-react';
import { getAdminOverviewApi } from '../../services/adminOverviewService';
import './AdminOverview.css';

function AdminOverview() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getAdminOverviewApi();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading || !data) return <div className="custom-spinner mx-auto mt-5"></div>;

  return (
    <div className="admin-overview fade-in-up">
      <div className="admin-header">
        <h2 className="text-white">لوحة التحكم الإدارية</h2>
        <p className="text-muted">مرحباً بك مجدداً، إليك ملخص أداء منصة شفاء اليوم.</p>
      </div>

      {/* 1. بطاقات الإحصائيات */}
      <div className="stats-grid">
        <div className="stat-card glass-receipt">
          <div className="stat-icon-wrapper doctors"><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">إجمالي الأطباء</span>
            <h3 className="stat-value">{data.totalDoctors}</h3>
          </div>
        </div>

        <div className="stat-card glass-receipt">
          <div className="stat-icon-wrapper patients"><UserPlus size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">المرضى النشطين</span>
            <h3 className="stat-value">{data.activePatients}</h3>
          </div>
        </div>

        <div className="stat-card glass-receipt">
          <div className="stat-icon-wrapper appointments"><Calendar size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">مواعيد بانتظار التأكيد</span>
            <h3 className="stat-value">{data.pendingAppointments}</h3>
          </div>
        </div>

        <div className="stat-card glass-receipt">
          <div className="stat-icon-wrapper revenue"><Activity size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">مؤشر النمو</span>
            <h3 className="stat-value">{data.monthlyGrowth}</h3>
          </div>
        </div>
      </div>

      {/* 2. الأقسام التفصيلية */}
      <div className="admin-content-grid">
        
        {/* جدول أحدث الأطباء */}
        <div className="admin-section glass-receipt">
          <div className="section-title-flex">
            <h4 className="text-white m-0">أحدث الأطباء المنضمين</h4>
          </div>
          <div className="admin-table-wrapper">
            {data.recentDoctors && data.recentDoctors.length > 0 ? (
              <table className="custom-admin-table">
                <thead>
                  <tr>
                    <th>الطبيب</th>
                    <th>التخصص</th>
                    <th>تاريخ الإضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentDoctors.map(doc => (
                    <tr key={doc.doctorID}>
                      <td className="text-white font-weight-bold">د. {doc.name}</td>
                      <td className="text-cyan">{doc.specialty}</td>
                      <td className="text-muted">{new Date(doc.joinDate).toLocaleDateString('ar-EG')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted text-center mt-3">لا يوجد أطباء مضافين بعد.</p>
            )}
          </div>
        </div>

        {/* قائمة النشاط الأخير */}
        <div className="admin-section glass-receipt">
          <h4 className="text-white mb-4">العمليات الأخيرة</h4>
          <div className="activity-list">
            {data.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((act, index) => (
                <div key={index} className="activity-item">
                  <div className={`act-icon ${act.type.toLowerCase()}`}>
                    {act.type === 'Success' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                  </div>
                  <div className="act-details">
                    <p className="m-0 text-white">{act.message}</p>
                    <span className="text-muted small">
                      {new Date(act.time).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">لا توجد أنشطة مسجلة.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminOverview;