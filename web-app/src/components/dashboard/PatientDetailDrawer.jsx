import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Briefcase, Droplets, ShieldAlert, Heart, Ruler, Scale, FileText, Calendar } from 'lucide-react';
import { getPatientDetailsApi } from '../../services/adminPatientService';
import './PatientDetailDrawer.css';

function PatientDetailDrawer({ patientId, isOpen, onClose }) {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
    const loadPatientDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getPatientDetailsApi(patientId);
        setPatient(data);
      } catch (error) {
        console.error("خطأ في جلب تفاصيل المريض", error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (isOpen && patientId) {
      loadPatientDetails();
    }
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer-content glass-receipt" onClick={e => e.stopPropagation()}>
        
        {/* رأس الدرج */}
        <div className="drawer-header">
          <div className="header-info">
            <h3 className="text-white m-0">ملف المريض الكامل</h3>
            <span className="text-muted small">معرف النظام: {patientId}</span>
          </div>
          <button className="btn-close-drawer" onClick={onClose}><X size={24}/></button>
        </div>

        {isLoading ? (
          <div className="drawer-loader"><span className="custom-spinner"></span></div>
        ) : patient && (
          <div className="drawer-body">
            
            {/* قسم المعلومات الأساسية */}
            <div className="drawer-section">
              <div className="profile-header-brief mb-4">
                <div className="avatar-large">
                  {patient.image ? <img src={patient.image} alt="" /> : <User size={40}/>}
                </div>
                <div className="name-meta">
                  <h2 className="text-white">{patient.fullName}</h2>
                  <span className={`status-pill ${patient.isActive ? 'active' : 'suspended'}`}>
                    {patient.isActive ? 'حساب نشط' : 'حساب موقوف'}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <Mail size={16} className="text-cyan"/>
                  <div className="details"><span>البريد الإلكتروني</span><strong>{patient.email}</strong></div>
                </div>
                <div className="info-item">
                  <Phone size={16} className="text-cyan"/>
                  <div className="details"><span>رقم الهاتف</span><strong>{patient.phone}</strong></div>
                </div>
                <div className="info-item">
                  <MapPin size={16} className="text-cyan"/>
                  <div className="details"><span>العنوان</span><strong>{patient.address || 'غير مسجل'}</strong></div>
                </div>
                <div className="info-item">
                  <Briefcase size={16} className="text-cyan"/>
                  <div className="details"><span>المهنة</span><strong>{patient.job || 'غير مسجل'}</strong></div>
                </div>
              </div>
            </div>

            {/* قسم المؤشرات الحيوية والبيانات الطبية */}
            <h4 className="section-divider">البيانات الحيوية والطبية</h4>
            <div className="drawer-section">
              <div className="vitals-row">
                <div className="vital-card">
                  <Droplets size={20} className="text-danger"/>
                  <div className="details"><span>فصيلة الدم</span><strong>{patient.bloodType || '--'}</strong></div>
                </div>
                <div className="vital-card">
                  <Scale size={20} className="text-warning"/>
                  <div className="details"><span>الوزن</span><strong>{patient.weight ? `${patient.weight} كجم` : '--'}</strong></div>
                </div>
                <div className="vital-card">
                  <Ruler size={20} className="text-success"/>
                  <div className="details"><span>الطول</span><strong>{patient.height ? `${patient.height} سم` : '--'}</strong></div>
                </div>
              </div>

              <div className="medical-tags mt-4">
                <div className="tag-box warning">
                  <ShieldAlert size={18}/>
                  <div className="content">
                    <label>الحساسية</label>
                    <p>{patient.allergies || 'لا توجد بيانات مسجلة'}</p>
                  </div>
                </div>
                <div className="tag-box danger">
                  <Heart size={18}/>
                  <div className="content">
                    <label>الأمراض المزمنة</label>
                    <p>{patient.chronicDiseases || 'لا توجد بيانات مسجلة'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ملاحظات إضافية */}
            <div className="drawer-section mt-4">
              <h5 className="text-white d-flex align-items-center gap-2 mb-3">
                <FileText size={18} className="text-cyan"/> ملاحظات إضافية
              </h5>
              <div className="notes-area">
                {patient.patientNotes || 'لا توجد ملاحظات إضافية لهذا المريض.'}
              </div>
            </div>

            <div className="drawer-footer-meta">
              <span><Calendar size={14}/> تاريخ الانضمام: {new Date(patient.createdDate).toLocaleDateString('ar-EG')}</span>
              <span>جهة اتصال الطوارئ: {patient.emergencyContact || 'غير متوفر'}</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetailDrawer;