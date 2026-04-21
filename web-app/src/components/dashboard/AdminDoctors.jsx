import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, Mail, X, ShieldBan, UserCheck, Eye } from 'lucide-react';
import { getAdminDoctorsApi, addDoctorApi, toggleDoctorStatusApi } from '../../services/adminDoctorService';
import DoctorDetailDrawer from './DoctorDetailDrawer'; // سنقوم بإنشاء هذا المكون لاحقاً
import './AdminDoctors.css';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. حالات (States) نافذة إضافة طبيب جديد
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ 
    fullName: '', email: '', phone: '', specialty: '', specialization: '', experienceYears: 0 
  });

  // 2. حالات درج عرض الملف الشخصي (Side Drawer)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminDoctorsApi();
      setDoctors(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة إرسال بيانات الطبيب الجديد
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoctorApi(newDoctor);
      alert("تم إنشاء حساب الطبيب بنجاح. كلمة المرور الافتراضية: Doctor@1234");
      setIsAddModalOpen(false);
      setNewDoctor({ fullName: '', email: '', phone: '', specialty: '', specialization: '', experienceYears: 0 });
      loadDoctors(); // تحديث القائمة بعد الإضافة
    } catch (error) {
      alert(error.message);
    }
  };

  // دالة إيقاف / تفعيل الحساب (Optimistic Update)
  const handleToggleStatus = async (doctorId) => {
    const doctor = doctors.find(d => d.doctorID === doctorId);
    if (!doctor) return;

    const confirmMsg = doctor.isActive 
        ? "هل أنت متأكد من إيقاف حساب هذا الطبيب؟ لن يظهر للمرضى ولن يتمكن من الدخول." 
        : "تأكيد إعادة تفعيل حساب الطبيب؟";
    
    if (!window.confirm(confirmMsg)) return;

    // تحديث الواجهة فوراً
    setDoctors(doctors.map(d => 
        d.doctorID === doctorId ? { ...d, isActive: !d.isActive } : d
    ));

    try {
        await toggleDoctorStatusApi(doctorId);
    } catch (err) {
        alert(err.message || "حدث خطأ أثناء تحديث حالة الطبيب");
        // التراجع في حال الفشل
        setDoctors(doctors.map(d => 
            d.doctorID === doctorId ? { ...d, isActive: !d.isActive } : d
        ));
    }
  };

  // دالة فتح ملف الطبيب
  const handleOpenDrawer = (id) => {
    setSelectedDoctorId(id);
    setIsDrawerOpen(true);
  };

  // تصفية الأطباء بناءً على البحث
  const filteredDoctors = doctors.filter(d => 
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.includes(searchQuery)
  );

  if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

  return (
    <div className="admin-doctors-page fade-in-up">
      <div className="page-header-flex mb-4">
        <div>
          <h2 className="text-white mb-1">إدارة واعتماد الأطباء</h2>
          <p className="text-muted m-0">قم بإضافة أطباء الكادر وتعديل صلاحياتهم.</p>
        </div>
        <button className="btn-primary-action" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={18} /> إضافة طبيب جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="toolbar glass-receipt mb-4">
        <div className="search-box full-width">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو التخصص..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* جدول الأطباء */}
      <div className="admin-table-container glass-receipt">
        <table className="custom-admin-table">
          <thead>
            <tr>
              <th>الطبيب</th>
              <th>التواصل</th>
              <th>الخبرة</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(doctor => (
              <tr key={doctor.doctorID} className={!doctor.isActive ? "suspended-row" : ""}>
                <td>
                  <div className="d-flex flex-column">
                    <span className="text-white font-weight-bold">د. {doctor.fullName}</span>
                    <span className="text-cyan small">{doctor.specialty}</span>
                  </div>
                </td>
                <td>
                  <div className="text-muted small">
                    <div className="d-flex align-items-center gap-1"><Phone size={12}/> {doctor.phone}</div>
                    <div className="d-flex align-items-center gap-1"><Mail size={12}/> {doctor.email}</div>
                  </div>
                </td>
                <td>{doctor.experienceYears} سنوات</td>
                <td>
                  <span className={`status-pill ${doctor.isActive ? 'active' : 'suspended'}`}>
                    {doctor.isActive ? 'نشط' : 'موقوف'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon-action view" title="الملف والتقارير" onClick={() => handleOpenDrawer(doctor.doctorID)}>
                      <Eye size={18} />
                    </button>
                    
                    <button 
                      className={`btn-icon-action ${doctor.isActive ? 'suspend' : 'approve'}`} 
                      onClick={() => handleToggleStatus(doctor.doctorID)} 
                      title={doctor.isActive ? "إيقاف الحساب" : "إعادة تفعيل"}
                    >
                      {doctor.isActive ? <ShieldBan size={18} /> : <UserCheck size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة الإضافة (Modal) */}
      {isAddModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content glass-receipt">
            <div className="modal-header">
              <h4 className="text-white m-0">تسجيل طبيب جديد</h4>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group mb-3">
                <label>الاسم الكامل</label>
                <input required className="custom-input" placeholder="اسم الطبيب" value={newDoctor.fullName} onChange={e => setNewDoctor({...newDoctor, fullName: e.target.value})} />
              </div>
              <div className="form-row mb-3">
                <div className="form-group">
                  <label>القسم (التخصص العام)</label>
                  <input required className="custom-input" placeholder="مثال: أطفال" value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>التخصص الدقيق (اختياري)</label>
                  <input className="custom-input" placeholder="مثال: حديثي الولادة" value={newDoctor.specialization} onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})} />
                </div>
              </div>
              <div className="form-row mb-3">
                <div className="form-group">
                  <label>سنوات الخبرة</label>
                  <input required type="number" min="0" max="50" className="custom-input" value={newDoctor.experienceYears} onChange={e => setNewDoctor({...newDoctor, experienceYears: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input required type="tel" pattern="01[0-9]{9}" inputMode="tel" maxLength="11" minLength="11" className="custom-input" value={newDoctor.phone} onChange={e => setNewDoctor({...newDoctor, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group mb-4">
                <label>البريد الإلكتروني (لتسجيل الدخول)</label>
                <input required type="email" className="custom-input" value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} />
              </div>
              <div className="modal-actions-wrapper">
                <button type="button" className="btn-secondary-action" onClick={() => setIsAddModalOpen(false)}>إلغاء</button>
                <button type="submit" className="btn-primary-action">إنشاء الحساب</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* درج عرض ملف الطبيب الجانبي */}
      <DoctorDetailDrawer 
        doctorId={selectedDoctorId} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

    </div>
  );
}

export default AdminDoctors;