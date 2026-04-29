import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, UserX, Eye, X } from 'lucide-react';
import { getAdminPatientsApi, addPatientApi, togglePatientStatusApi } from '../../services/adminPatientService'; // استيراد الخدمات
import './AdminPatients.css';
import PatientDetailDrawer from './PatientDetailDrawer';

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'male',
    age: ''
  });

  // 1. جلب البيانات الفعلية عند تحميل الصفحة
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminPatientsApi();
      // تحويل مسميات الحقول لتطابق الـ DTO القادم من الباك إند
      const formattedData = data.map(p => ({
        id: p.patientID,
        name: p.fullName,
        phone: p.phone,
        email: p.email,
        isSuspended: !p.isActive,
        joinedAt: p.joinedAt
      }));
      setPatients(formattedData);
    } catch (err) {
      setError("تعذر جلب قائمة المرضى. تأكد من اتصال السيرفر.");
    } finally {
      setIsLoading(false);
    }
  };


const handleOpenDrawer = (id) => {
  setSelectedPatientId(id);
  setIsDrawerOpen(true);
};

  // 2. إرسال بيانات المريض الجديد للسيرفر
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // تجهيز البيانات بنفس تنسيق CreatePatientDto
      const payload = {
        fullName: newPatient.fullName,
        email: newPatient.email,
        phone: newPatient.phone,
        gender: newPatient.gender,
        age: parseInt(newPatient.age)
      };

      await addPatientApi(payload);
      
      alert("تم تسجيل المريض بنجاح.");
      setIsAddModalOpen(false);
      setNewPatient({ fullName: '', phone: '', email: '', gender: 'male', age: '' });
      
      // إعادة تحميل القائمة لتظهر الإضافة الجديدة
      loadPatients();
    } catch (err) {
      alert(err.message || "حدث خطأ أثناء التسجيل");
    }
  };

  const togglePatientStatus = async (patientId) => {
    // 1. إيجاد المريض للتحقق من حالته
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // 2. رسالة التأكيد
    const confirmMsg = patient.isSuspended 
        ? "تأكيد إعادة تفعيل الحساب؟ سيتمكن المريض من حجز مواعيد جديدة." 
        : "تأكيد إيقاف الحساب؟ لن يتمكن المريض من الدخول للنظام.";
    
    if (!window.confirm(confirmMsg)) return;

    // 3. التحديث اللحظي للواجهة (Optimistic Update)
    setPatients(patients.map(p => 
        p.id === patientId ? { ...p, isSuspended: !p.isSuspended } : p
    ));

    try {
        // 4. إرسال الطلب للباك إند
        await togglePatientStatusApi(patientId);
    } catch (err) {
        alert(err.message || "حدث خطأ أثناء تحديث حالة الحساب");
        // 5. التراجع عن التحديث في الواجهة إذا فشل الطلب
        setPatients(patients.map(p => 
            p.id === patientId ? { ...p, isSuspended: !p.isSuspended } : p // نعكسها مرة أخرى للوضع الأصلي
        ));
    }
};

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

  return (
    <div className="admin-patients-page fade-in-up">
      <div className="page-header-flex mb-4">
        <div>
          <h2 className="text-white mb-1">إدارة المرضى</h2>
          {error && <p className="text-danger small">{error}</p>}
        </div>
        <button className="btn-primary-action" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={18} /> تسجيل مريض جديد
        </button>
      </div>

      <div className="toolbar glass-receipt mb-4">
        <div className="search-box full-width">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="ابحث باسم المريض أو رقم الهاتف..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="admin-table-container glass-receipt">
        <table className="custom-admin-table">
          <thead>
            <tr>
              <th>المريض</th>
              <th>التواصل</th>
              <th>تاريخ الانضمام</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id} className={patient.isSuspended ? "suspended-row" : ""}>
                <td><div className="font-weight-bold text-white">{patient.name}</div></td>
                <td>
                  <div className="contact-info">
                    <span>{patient.phone}</span>
                    <span className="text-muted small">{patient.email}</span>
                  </div>
                </td>
                <td>{new Date(patient.joinedAt).toLocaleDateString('ar-EG')}</td>
                <td>
                  <span className={`status-pill ${patient.isSuspended ? 'suspended' : 'active'}`}>
                    {patient.isSuspended ? 'موقوف' : 'نشط'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon-action view" onClick={() => handleOpenDrawer(patient.id)}><Eye size={18} /></button>
                    <button 
                      className={`btn-icon-action ${patient.isSuspended ? 'activate' : 'suspend'}`}
                      onClick={() => togglePatientStatus(patient.id)}
                    >
                      {patient.isSuspended ? <UserCheck size={18} /> : <UserX size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة إضافة مريض (Modal) */}
      {isAddModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content glass-receipt">
            <div className="modal-header">
              <h4 className="text-white m-0">تسجيل مريض جديد</h4>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group mb-3">
                <label>الاسم الكامل</label>
                <input required className="custom-input" placeholder="أدخل اسم المريض" value={newPatient.fullName} onChange={e => setNewPatient({...newPatient, fullName: e.target.value})} />
              </div>

              <div className="form-row mb-3">
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input required type="tel" pattern="01[0-9]{9}" inputMode="tel" maxLength="11" minLength="11" className="custom-input" placeholder="01xxxxxxxxx" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>العمر</label>
                  <input required type="number" min="0" max="120" className="custom-input" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>البريد الإلكتروني</label>
                <input required type="email" className="custom-input" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
              </div>

              <div className="form-group mb-4">
                <label>الجنس</label>
                <div className="gender-selector">
                  <label className={`gender-option ${newPatient.gender === 'male' ? 'active' : ''}`}>
                    <input type="radio" name="gender" value="male" checked={newPatient.gender === 'male'} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} /> ذكر
                  </label>
                  <label className={`gender-option ${newPatient.gender === 'female' ? 'active' : ''}`}>
                    <input type="radio" name="gender" value="female" checked={newPatient.gender === 'female'} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} /> أنثى
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>إلغاء</button>
                <button type="submit" className="btn-primary-action">إتمام التسجيل</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PatientDetailDrawer
  patientId={selectedPatientId} 
  isOpen={isDrawerOpen} 
  onClose={() => setIsDrawerOpen(false)} 
/>
    </div>
  );
}

export default AdminPatients;