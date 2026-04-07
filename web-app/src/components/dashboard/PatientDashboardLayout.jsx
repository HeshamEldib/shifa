import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Activity, Calendar, Bell, Settings, CreditCard, LogOut } from 'lucide-react';
import { logout } from '../../store/slices/authSlice'; // افترض وجودها
import './PatientDashboardLayout.css';

function PatientDashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="premium-booking-page">
      <div className="security-aura"><div className="aura-glow blue-glow"></div></div>
      
      <div className="container py-5 fade-in-up">
        <div className="patient-portal-grid">
          
          {/* الجانب الأيمن: القائمة الجانبية (Sidebar) */}
          <aside className="portal-sidebar glass-receipt">
            <div className="sidebar-header border-bottom border-secondary mb-3 pb-3 text-center">
              <h5 className="text-white mb-0">حسابي</h5>
            </div>
            
            <nav className="portal-nav">
              {/* استخدمنا NavLink لأنها تضيف كلاس active تلقائياً للرابط النشط */}
              <NavLink to="/patient/profile" className="portal-link">
                <User size={20} /> الملف الشخصي
              </NavLink>
              
              <NavLink to="/patient/appointments" className="portal-link">
                <Calendar size={20} /> الحجوزات والمواعيد
              </NavLink>
              
              <NavLink to="/patient/records" className="portal-link">
                <Activity size={20} /> السجل الطبي والروشتات
              </NavLink>
              
              <NavLink to="/patient/notifications" className="portal-link">
                <Bell size={20} /> الإشعارات
              </NavLink>
              
              {/* <NavLink to="/patient/payments" className="portal-link disabled-link" title="قريباً">
                <CreditCard size={20} /> سجل المدفوعات (قريباً)
              </NavLink>
              
              <NavLink to="/patient/settings" className="portal-link disabled-link" title="قريباً">
                <Settings size={20} /> الإعدادات (قريباً)
              </NavLink> */}
            </nav>

            <div className="sidebar-footer border-top border-secondary mt-4 pt-3">
              <button onClick={handleLogout} className="portal-link logout-link w-100 text-start">
                <LogOut size={20} /> تسجيل الخروج
              </button>
            </div>
          </aside>

          {/* الجانب الأيسر: المحتوى المتغير (Outlet) */}
          <main className="portal-content">
            {/* هنا سيتم حقن صفحة (Profile) أو (Records) بناءً على الرابط */}
            <Outlet /> 
          </main>

        </div>
      </div>
    </div>
  );
}

export default PatientDashboardLayout;