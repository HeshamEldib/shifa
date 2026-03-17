// src/components/website/AllDoctors.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star, Briefcase, Users, Calendar, Loader2, Shield } from "lucide-react";
import "./AllDoctors.css";

function AllDoctors() {
  const navigate = useNavigate();
  
  // ==========================================
  //  STATES FOR BACKEND INTEGRATION
  // ==========================================
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState(["الكل"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States للبحث والفلاتر (Front-end filtering)
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State لنظام التركيز البصري (Focus Mode)
  const [hoveredDoctorId, setHoveredDoctorId] = useState(null);

  // =========================================================================
  //  [BACKEND DEV INSTRUCTION] GET API (جلب قائمة الأطباء)
  // =========================================================================
  useEffect(() => {
    setIsLoaded(true);

    /*
      1. مسح دالة الـ setTimeout والمصفوفة الوهمية (mockData).
      2. جلب قائمة الأطباء من قاعدة البيانات.
      3. شكل الاستجابة (Array of Objects) المفروض يكون كده:
      [
        { 
          id: 1, 
          name: "...", 
          specialty: "...", 
          category: "...", // مهم جداً عشان الفلاتر تتولد أوتوماتيك
          rating: "4.9", 
          experience: "15 سنة", 
          patients: "+1200", 
          image: "URL", 
          availability: "متاح: غداً 10:00 ص" 
        }, ...
      ]
    */

    const fetchDoctors = async () => {
      try {
        // --- Mock Data (للتجربة حالياً) ---
        const mockData = [
          { 
            id: 1, name: "د. أحمد محمد", specialty: "استشاري جراحة القلب", category: "قلب", rating: "4.9", experience: "15 سنة", patients: "+1200", 
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop", 
            availability: "متاح: غداً 10:00 ص" 
          },
          { 
            id: 2, name: "د. فاطمة علي", specialty: "استشاري الأمراض الباطنية", category: "باطنة", rating: "4.8", experience: "12 سنة", patients: "+850", 
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop", 
            availability: "متاح: اليوم 05:00 م" 
          },
          { 
            id: 3, name: "د. محمد سالم", specialty: "أخصائي طب وجراحة الأسنان", category: "أسنان", rating: "4.7", experience: "8 سنوات", patients: "+600", 
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop", 
            availability: "متاح: الإثنين 12:00 م" 
          },
          { 
            id: 4, name: "د. سارة حسن", specialty: "استشاري طب العيون", category: "عيون", rating: "5.0", experience: "20 سنة", patients: "+2000", 
            image: "https://images.unsplash.com/photo-1594824436998-ef2282de3b5f?q=80&w=2070&auto=format&fit=crop", 
            availability: "متاح: غداً 02:00 م" 
          },
          { 
            id: 5, name: "د. ندى كمال", specialty: "أخصائي الأمراض الجلدية", category: "جلدية", rating: "4.9", experience: "10 سنوات", patients: "+900", 
            image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1974&auto=format&fit=crop", 
            availability: "متاح: اليوم 07:00 م" 
          },
          { 
            id: 6, name: "د. خالد عبدالله", specialty: "استشاري طب الأطفال", category: "أطفال", rating: "4.8", experience: "14 سنة", patients: "+1500", 
            image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d0?q=80&w=2070&auto=format&fit=crop", 
            availability: "متاح: غداً 11:00 ص" 
          }
        ];

        setTimeout(() => {
          setDoctors(mockData);
          // استخراج الأقسام أوتوماتيكياً من البيانات وبناء الفلاتر
          const uniqueCategories = ["الكل", ...new Set(mockData.map(d => d.category))];
          setCategories(uniqueCategories);
          setIsLoading(false);
        }, 1500);

        /*
        // --- Real API Example (الكود الفعلي للربط) ---
        // const response = await fetch("https://your-api.com/api/doctors");
        // if (!response.ok) throw new Error("Failed to fetch");
        // const data = await response.json();
        // setDoctors(data);
        // const uniqueCategories = ["الكل", ...new Set(data.map(d => d.category))];
        // setCategories(uniqueCategories);
        // setIsLoading(false);
        */

      } catch (err) {
        setError("حدث خطأ أثناء تحميل بيانات الأطباء.");
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // دالة لحساب الـ Spotlight وتتبع العين (Micro Eye Tracking)
  const handleMouseMove = (e, doctorId) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Spotlight (موقع الماوس بالنسبة للكارت)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = (x - centerX) / 30; 
    const moveY = (y - centerY) / 30;
    card.style.setProperty("--avatar-x", `${moveX}px`);
    card.style.setProperty("--avatar-y", `${moveY}px`);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchCategory = activeCategory === "الكل" || doc.category === activeCategory;
    const matchSearch = doc.name.includes(searchQuery) || doc.specialty.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="premium-doctors-page">
      {/* 1. النسيج السينمائي والـ Aura الغامقة */}
      <div className="aura-background">
        <div className="aura-orb cyan-orb"></div>
        <div className="aura-orb purple-orb"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="doctors-container">
        <button className="back-btn-premium" onClick={() => navigate("/")}>
          <ArrowRight size={20} />
          <span>العودة للرئيسية</span>
        </button>

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-glow-border"></div>
          </div>

          <div className="filters-premium">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
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
          <div className={`crystal-grid ${hoveredDoctorId ? "is-focus-mode" : ""}`}>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <div 
                  key={doc.id} 
                  className={`crystal-card doctor-card ${hoveredDoctorId === doc.id ? "active-focus" : ""}`}
                  onMouseMove={(e) => handleMouseMove(e, doc.id)}
                  onMouseEnter={() => setHoveredDoctorId(doc.id)}
                  onMouseLeave={() => setHoveredDoctorId(null)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="scan-line"></div>
                  
                  {/* الاقتباس المخفي بيظهر عند الـ Hover */}
                  <div className="hidden-quote">"صحتك هي أولويتي القصوى"</div>

                  <div className="card-inner">
                    <div className="doctor-header">
                      {/* 3. الصورة مع النبض والـ Tracking */}
                      <div className="avatar-wrapper">
                        <div className="trust-ring"></div>
                        <img src={doc.image} alt={doc.name} className="doctor-avatar" />
                      </div>
                      
                      {/* 4. نبض الإتاحة (Smart Availability) */}
                      <div className="smart-availability">
                        <span className="pulse-dot"></span>
                        <span className="avail-text">{doc.availability}</span>
                      </div>
                    </div>

                    <div className="doctor-info">
                      <h3 className="doctor-name">{doc.name}</h3>
                      <p className="doctor-specialty">{doc.specialty}</p>
                      
                      <div className="trust-stats">
                        <div className="stat-item gold-stat">
                          <Star size={14} className="stat-icon" />
                          <span>{doc.rating}</span>
                        </div>
                        <div className="stat-item">
                          <Briefcase size={14} className="stat-icon" />
                          <span>{doc.experience}</span>
                        </div>
                        <div className="stat-item">
                          <Users size={14} className="stat-icon" />
                          <span>{doc.patients}</span>
                        </div>
                      </div>
                    </div>

                    {/* 5. الأزرار المخفية المغناطيسية */}
                    <div className="unfold-action multi-buttons">
                      <button 
                        className="btn-outline-premium"
                        onClick={() => navigate(`/doctor/${doc.id}`)}
                      >
                        عرض الملف
                      </button>
                      <button 
                            className="book-btn-premium"
                            onClick={() => navigate(`/booking/${doc.id}`)}
                          >

                        <span>احجز موعد</span>
                        <div className="btn-glow-effect"></div>
                      </button>
                    </div>
                  </div>
                </div>
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
