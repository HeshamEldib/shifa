import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Stethoscope, Star, Users, Calendar, Award, BookOpen } from 'lucide-react';
// import { getAdminDoctorsApi } from '../../services/adminDoctorService'; // افترضنا أننا سنجلب من نفس الملف للتسهيل، لكن الأفضل إضافة دالة منفصلة
import './DoctorDetailDrawer.css';

// ملاحظة: قم بإضافة هذه الدالة في ملف adminDoctorService.js
export const getDoctorDetailsApi = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5038/api/Admin/doctors/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل في جلب تفاصيل الطبيب");
    return await response.json();
};

function DoctorDetailDrawer({ doctorId, isOpen, onClose }) {
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
    const loadDoctorDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getDoctorDetailsApi(doctorId);
        setDoctor(data);
      } catch (error) {
        console.error("خطأ في جلب تفاصيل الطبيب", error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (isOpen && doctorId) {
      loadDoctorDetails();
    }
  }, [isOpen, doctorId]);

  if (!isOpen) return null;

  return (
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer-content glass-receipt" onClick={e => e.stopPropagation()}>
        
        {/* رأس الدرج */}
        <div className="drawer-header">
          <div className="header-info">
            <h3 className="text-white m-0 d-flex align-items-center gap-2">
               ملف الكادر الطبي
            </h3>
            <span className="text-muted small">معرف النظام: {doctorId}</span>
          </div>
          <button className="btn-close-drawer" onClick={onClose}><X size={24}/></button>
        </div>

        {isLoading ? (
          <div className="drawer-loader"><span className="custom-spinner"></span></div>
        ) : doctor && (
          <div className="drawer-body">
            
            {/* قسم المعلومات الأساسية */}
            <div className="drawer-section">
              <div className="profile-header-brief mb-4">
                <div className="avatar-large doctor-avatar">
                  {doctor.image ? <img src={doctor.image} alt="" /> : <User size={40}/>}
                </div>
                <div className="name-meta">
                  <h2 className="text-white">د. {doctor.fullName}</h2>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="badge-specialty-primary">{doctor.specialty}</span>
                  </div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <Mail size={16} className="text-cyan"/>
                  <div className="details"><span>البريد الإلكتروني</span><strong>{doctor.email}</strong></div>
                </div>
                <div className="info-item">
                  <Phone size={16} className="text-cyan"/>
                  <div className="details"><span>رقم الهاتف</span><strong dir="ltr">{doctor.phone}</strong></div>
                </div>
              </div>
            </div>

            {/* قسم الإحصائيات والأداء */}
            <h4 className="section-divider">الإحصائيات والأداء</h4>
            <div className="drawer-section">
              <div className="stats-row">
                <div className="stat-card">
                  <Award size={20} className="text-warning"/>
                  <div className="details"><span>سنوات الخبرة</span><strong>{doctor.experienceYears}</strong></div>
                </div>
                <div className="stat-card">
                  <Star size={20} className="text-success"/>
                  <div className="details"><span>التقييم العام</span><strong>{doctor.rating > 0 ? doctor.rating : 'جديد'}</strong></div>
                </div>
                <div className="stat-card">
                  <Users size={20} className="text-cyan"/>
                  <div className="details"><span>إجمالي المرضى</span><strong>{doctor.patientsCount}</strong></div>
                </div>
              </div>
            </div>

            {/* قسم الملف المهني */}
            <h4 className="section-divider">الملف المهني</h4>
            <div className="drawer-section">
                <div className="info-item full-width mb-3">
                  <Stethoscope size={16} className="text-cyan"/>
                  <div className="details w-100">
                      <span>التخصص الدقيق</span>
                      <strong>{doctor.specialization || 'التخصص العام فقط'}</strong>
                  </div>
                </div>

              <div className="bio-area mt-3">
                <div className="d-flex align-items-center gap-2 mb-2 text-cyan">
                    <BookOpen size={16} /> <span className="font-weight-bold">النبذة التعريفية (Bio)</span>
                </div>
                <p className="text-muted m-0 lh-lg">
                    {doctor.bio || 'لم يقم الطبيب بإضافة نبذة تعريفية لملفه الشخصي حتى الآن.'}
                </p>
              </div>
            </div>

            <div className="drawer-footer-meta">
              <span><Calendar size={14}/> تاريخ الانضمام: {new Date(doctor.createdDate).toLocaleDateString('ar-EG')}</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDetailDrawer;