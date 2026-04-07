// src/components/website/AllDoctors.jsx
import React, { useState, useEffect } from "react";
import { Search, Loader2, Shield } from "lucide-react";
import "./AllDoctors.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../store/slices/doctorsSlice";
import CardDoctor from "./CardDoctor";

function AllDoctors() {
  const dispatch = useDispatch();

  const { data, isLoading, isLoaded, error } = useSelector((state) => state.doctors || {});
  const doctors = Array.isArray(data) ? data : [];
  
  // حالات (States) البحث والتصنيف
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (doctors.length === 0) {
            dispatch(fetchDoctors());
        }
    }, [dispatch, doctors.length]);

    // استخراج التخصصات الفريدة من قائمة الأطباء (لعمل قائمة التصنيف ديناميكياً)
    const specialization = ["الكل", ...new Set(doctors.map(doc => doc.specialization))];

    // فلترة الأطباء بناءً على البحث والتصنيف
    const filteredDoctors = doctors.filter((doctor) => {
        const matchName = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === '' || doctor.specialization === selectedCategory || selectedCategory === "الكل";
        return matchName && matchCategory;
    });

    // if (loading) return <div className="loading-spinner">جاري تحميل الأطباء...</div>;
    if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="premium-doctors-page">
      {/* 1. النسيج السينمائي والـ Aura الغامقة */}
      <div className="aura-background">
        <div className="aura-orb cyan-orb"></div>
        <div className="aura-orb purple-orb"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="doctors-container">
        <div className={`services-header ${isLoaded ? "fade-in" : ""}`}>
          <div className="badge-glow">نخبة الطب الحديث</div>
          <h1 className="main-title">
            أطباؤنا <span className="gradient-text">المتميزون</span>
          </h1>
          <p className="sub-title">اختر طبيبك بثقة. نقدم لك أمهر الاستشاريين والأخصائيين لرعايتك.</p>
        </div>

        <div className={`controls-section ${isLoaded ? "slide-up" : ""}`}>
          <div className="search-box-premium">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="ابحث باسم الطبيب أو التخصص..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-glow-border"></div>
          </div>

          <div className="filters-premium">
            {specialization.map((cat) => (
              <button 
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="empty-state error-state">
            <Shield size={48} className="error-icon" />
            <h3>{error}</h3>
            <button className="retry-btn" onClick={() => window.location.reload()}>إعادة المحاولة</button>
          </div>
        ) : isLoading ? (
          <div className="loading-state">
            <Loader2 size={48} className="spinner-icon" />
            <p>جاري تحميل قائمة الأطباء...</p>
          </div>
        ) : (
          /* 2. نظام التركيز البصري (إضافة كلاس focus-mode للشبكة) */
          <div className={`crystal-grid`}>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <CardDoctor key={doc.doctorID} doc={doc} index={index} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👨‍⚕️</div>
                <h3>لم نجد الطبيب المطلوب...</h3>
                <p>تأكد من كتابة الاسم صحيحاً أو جرب قسماً آخر.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllDoctors;