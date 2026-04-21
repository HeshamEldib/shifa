import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Edit3, Trash2, X, FlaskConical, Bookmark } from 'lucide-react';
import { getMedicinesApi, saveMedicineApi } from '../../services/medicineService';
import './DoctorMedicines.css';

function DoctorMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState({ name: '', genericName: '', category: '', dosageForm: 'Tablet' });

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    const data = await getMedicinesApi();
    setMedicines(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveMedicineApi(currentMed);
    fetchMedicines();
    setIsModalOpen(false);
  };

  const filteredMeds = medicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="medicines-page fade-in-up">
      <div className="page-header-flex">
        <div>
          <h2 className="text-white mb-1"><Pill className="text-cyan me-2" size={28}/> قاعدة الأدوية</h2>
          <p className="text-muted m-0">قم بإدارة قائمة الأدوية الخاصة بك لتسهيل كتابة الروشتات.</p>
        </div>
        <button className="btn-primary-action" onClick={() => { setCurrentMed({name:'', genericName:'', category:'', dosageForm:'Tablet'}); setIsModalOpen(true); }}>
          <Plus size={18} /> إضافة دواء جديد
        </button>
      </div>

      <div className="toolbar glass-receipt">
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="ابحث باسم الدواء أو المادة الفعالة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="medicines-grid">
        {filteredMeds.map(med => (
          <div key={med.medicationID} className="medicine-card glass-receipt">
            <div className="med-icon-wrapper">
              <FlaskConical size={24} className="text-cyan" />
            </div>
            <div className="med-info">
              <h4 className="text-white m-0">{med.name}</h4>
              {/* <p className="generic-name">{med.genericName}</p> */}
              <div className="med-tags">
                {/* <span className="tag-pill category">{med.category}</span> */}
                <span className="tag-pill form">{med.dosageForm}</span>
              </div>
            </div>
            <div className="med-actions">
              <button className="icon-btn edit" onClick={() => { setCurrentMed(med); setIsModalOpen(true); }}><Edit3 size={16}/></button>
              <button className="icon-btn delete"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content glass-receipt">
            <div className="modal-header">
              <h4 className="text-white m-0">تفاصيل الدواء</h4>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>اسم الدواء (تجاري)</label>
                <input required className="custom-input" value={currentMed.name} onChange={e => setCurrentMed({...currentMed, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>الشكل الدوائي</label>
                  <select className="custom-input" value={currentMed.dosageForm} onChange={e => setCurrentMed({...currentMed, dosageForm: e.target.value})}>
                    <option value="Tablet">أقراص</option>
                    <option value="Syrup">شراب</option>
                    <option value="Injection">حقن</option>
                    <option value="Topical">دهان/كريم</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions-wrapper">
                <button type="submit" className="btn-primary-action">حفظ الدواء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorMedicines;