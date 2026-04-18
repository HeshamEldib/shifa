import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, HeartPulse, Activity, Stethoscope, Eye, Bone, Baby, Brain, X } from 'lucide-react';
import './AdminSpecialties.css';

function AdminSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // حالة المودال (للإضافة والتعديل)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState({ id: null, name: '', description: '', icon: 'Stethoscope' });

  useEffect(() => {
    // محاكاة جلب التخصصات
    const fetchSpecialties = async () => {
      setIsLoading(true);
      const mockData = [
        { id: 1, name: "طب القلب والأوعية", description: "تشخيص وعلاج أمراض القلب وضغط الدم.", icon: "HeartPulse", doctorsCount: 12 },
        { id: 2, name: "طب الأطفال", description: "رعاية صحية شاملة للأطفال وحديثي الولادة.", icon: "Baby", doctorsCount: 18 },
        { id: 3, name: "الباطنة العامة", description: "تشخيص وعلاج الأمراض الباطنية والجهاز الهضمي.", icon: "Activity", doctorsCount: 25 },
        { id: 4, name: "جراحة العظام", description: "علاج الكسور، المفاصل، وأمراض العمود الفقري.", icon: "Bone", doctorsCount: 8 },
        { id: 5, name: "طب العيون", description: "فحص النظر، جراحات الليزك، وعلاج أمراض العين.", icon: "Eye", doctorsCount: 5 },
        { id: 6, name: "المخ والأعصاب", description: "علاج اضطرابات الجهاز العصبي والدماغ.", icon: "Brain", doctorsCount: 4 }
      ];
      setTimeout(() => {
        setSpecialties(mockData);
        setIsLoading(false);
      }, 500);
    };
    fetchSpecialties();
  }, []);

  // دالة مساعدة لتحويل النص إلى أيقونة
  const renderIcon = (iconName, size = 24) => {
    const icons = {
      HeartPulse: <HeartPulse size={size} />,
      Baby: <Baby size={size} />,
      Activity: <Activity size={size} />,
      Bone: <Bone size={size} />,
      Eye: <Eye size={size} />,
      Brain: <Brain size={size} />,
      Stethoscope: <Stethoscope size={size} />
    };
    return icons[iconName] || <Stethoscope size={size} />;
  };

  const handleOpenModal = (specialty = null) => {
    if (specialty) {
      setCurrentSpecialty(specialty);
      setEditMode(true);
    } else {
      setCurrentSpecialty({ id: null, name: '', description: '', icon: 'Stethoscope' });
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setSpecialties(specialties.map(s => s.id === currentSpecialty.id ? { ...currentSpecialty, doctorsCount: s.doctorsCount } : s));
    } else {
      const newEntry = { ...currentSpecialty, id: Date.now(), doctorsCount: 0 };
      setSpecialties([newEntry, ...specialties]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, count) => {
    if (count > 0) {
      alert("لا يمكن حذف هذا التخصص لوجود أطباء مرتبطين به. قم بنقلهم لتخصص آخر أولاً.");
      return;
    }
    if (window.confirm("هل أنت متأكد من حذف هذا التخصص؟")) {
      setSpecialties(specialties.filter(s => s.id !== id));
    }
  };

  const filteredSpecialties = specialties.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

  return (
    <div className="admin-specialties-page fade-in-up">
      <div className="page-header-flex mb-4">
        <div>
          <h2 className="text-white mb-1">إدارة التخصصات الطبية</h2>
          <p className="text-muted m-0">تحكم في الأقسام المتاحة في العيادة لتنظيم تسجيل الأطباء وبحث المرضى.</p>
        </div>
        <button className="btn-primary-action" onClick={() => handleOpenModal()}>
          <Plus size={18} /> إضافة تخصص
        </button>
      </div>

      <div className="toolbar glass-receipt mb-4">
        <div className="search-box full-width">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="ابحث عن تخصص..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* عرض التخصصات في كروت (Cards Grid) بدلاً من جدول */}
      <div className="specialties-grid">
        {filteredSpecialties.length === 0 ? (
          <div className="empty-state text-center glass-receipt" style={{ gridColumn: '1 / -1' }}>
            <Activity size={48} opacity="0.3" className="mb-3 text-muted" />
            <h5 className="text-white">لا توجد تخصصات مطابقة للبحث</h5>
          </div>
        ) : (
          filteredSpecialties.map(spec => (
            <div key={spec.id} className="specialty-card glass-receipt">
              <div className="spec-card-header">
                <div className="spec-icon-box">
                  {renderIcon(spec.icon, 28)}
                </div>
                <div className="spec-actions">
                  <button className="icon-btn edit" onClick={() => handleOpenModal(spec)}><Edit2 size={16}/></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(spec.id, spec.doctorsCount)}><Trash2 size={16}/></button>
                </div>
              </div>
              
              <div className="spec-card-body">
                <h4 className="text-white m-0">{spec.name}</h4>
                <p className="text-muted small mt-2 mb-3">{spec.description}</p>
              </div>
              
              <div className="spec-card-footer">
                <span className="doctors-count">
                  <Stethoscope size={14} className="me-1"/> 
                  {spec.doctorsCount} أطباء
                </span>
                <span className="status-active">نشط</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* نافذة الإضافة/التعديل */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content glass-receipt">
            <div className="modal-header">
              <h4 className="text-white m-0">{editMode ? 'تعديل التخصص' : 'إضافة تخصص جديد'}</h4>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group mb-3">
                <label>اسم التخصص</label>
                <input required className="custom-input" placeholder="مثال: طب وجراحة العيون" value={currentSpecialty.name} onChange={e => setCurrentSpecialty({...currentSpecialty, name: e.target.value})} />
              </div>
              <div className="form-group mb-3">
                <label>وصف قصير (يظهر للمرضى)</label>
                <textarea required className="custom-input" rows="2" placeholder="وصف مبسط للأمراض التي يعالجها هذا القسم..." value={currentSpecialty.description} onChange={e => setCurrentSpecialty({...currentSpecialty, description: e.target.value})} />
              </div>
              
              <div className="form-group mb-4">
                <label>اختر أيقونة القسم</label>
                <div className="icon-selector-grid">
                  {['Stethoscope', 'HeartPulse', 'Baby', 'Activity', 'Bone', 'Eye', 'Brain'].map(icon => (
                    <button 
                      key={icon} 
                      type="button" 
                      className={`icon-select-btn ${currentSpecialty.icon === icon ? 'selected' : ''}`}
                      onClick={() => setCurrentSpecialty({...currentSpecialty, icon})}
                    >
                      {renderIcon(icon, 20)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions-wrapper">
                <button type="button" className="btn-secondary-action" onClick={() => setIsModalOpen(false)}>إلغاء</button>
                <button type="submit" className="btn-primary-action">{editMode ? 'حفظ التعديلات' : 'إضافة التخصص'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminSpecialties;