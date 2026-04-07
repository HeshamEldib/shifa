import React, { useState, useEffect } from 'react';
import { Activity, Clock, Pill, Printer, FileText, CheckCircle, User } from 'lucide-react';
import { getPatientRecordsApi } from '../../services/medicalRecordService'; 
import './PatientRecords.css';

function PatientRecords() {
  const userId = localStorage.getItem("userId");
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyRecords = async () => {
      try {
        if (userId) {
          const data = await getPatientRecordsApi(userId);
          setRecords(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyRecords();
  }, [userId]);

  // دالة الطباعة السريعة للروشتة
  const handlePrint = (recordId) => {
    // في المشاريع المتقدمة نستخدم مكتبات مثل react-to-print أو jsPDF
    // للتبسيط الآن، سنقوم بطباعة الشاشة الحالية
    window.print(); 
  };

  if (isLoading) {
    return (
      <div className="records-loading">
        <div className="custom-spinner"></div>
        <p>جاري تحميل سجلك الطبي...</p>
      </div>
    );
  }

  if (error) {
    return <div className="records-error">{error}</div>;
  }

  return (
    <div className="patient-records-container fade-in-up">
      
      <div className="records-page-header">
        <h2>
          <Activity className="icon-cyan pulse" size={28} /> سجلي الطبي والروشتات
        </h2>
        <p>تابع تاريخك المرضي والأدوية الموصوفة لك من أطباء شفاء بخصوصية تامة.</p>
      </div>

      {records.length === 0 ? (
        <div className="glass-receipt empty-records">
          <CheckCircle size={56} className="icon-success" />
          <h4>سجلك الطبي فارغ</h4>
          <p>لم تقم بأي زيارات مسجلة حتى الآن. نتمنى لك دوام الصحة والعافية.</p>
        </div>
      ) : (
        <div className="records-timeline">
          {records.map((record) => (
            <div key={record.recordID} className="record-card glass-receipt print-section">
              
              <div className="record-card-header">
                <div className="record-meta">
                  <h5 className="record-date">
                    <Clock size={18} /> 
                    {new Date(record.visitDate).toLocaleDateString('ar-EG', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </h5>
                  <span className="record-doctor">
                    <User size={14} /> الطبيب المعالج: د. {record.doctorName}
                  </span>
                </div>
                
                {record.prescriptions?.length > 0 && (
                  <button onClick={handlePrint} className="print-btn hide-on-print">
                    <Printer size={16} /> طباعة الروشتة
                  </button>
                )}
              </div>
              
              <div className="record-grid">
                
                <div className="info-box">
                  <div className="info-group">
                    <h6><Activity size={16} className="icon-warning"/> التشخيص</h6>
                    <p className="highlight-text">{record.diagnosisDetails}</p>
                  </div>

                  <div className="info-group">
                    <h6><FileText size={16} className="icon-success"/> خطة العلاج والتوصيات</h6>
                    <p>{record.treatmentPlan || "لا توجد ملاحظات إضافية."}</p>
                  </div>
                </div>

                <div className="prescription-box">
                  <h6 className="prescription-title">
                    <Pill size={18} /> الأدوية المصروفة (الروشتة)
                  </h6>
                  
                  {record.prescriptions?.length > 0 ? (
                    <ul className="prescription-list">
                      {record.prescriptions.map((p) => (
                        <li key={p.prescriptionID} className="prescription-item">
                          <span className="med-name">{p.medicationName}</span>
                          <div className="med-details">
                            <span><strong>الجرعة:</strong> {p.dosage}</span>
                            <span><strong>التكرار:</strong> {p.frequency}</span>
                            <span><strong>المدة:</strong> {p.duration}</span>
                          </div>
                          {p.instructions && (
                            <div className="med-instructions">
                              <strong>ملاحظات:</strong> {p.instructions}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-meds">لا توجد أدوية مصروفة في هذه الزيارة.</p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientRecords;