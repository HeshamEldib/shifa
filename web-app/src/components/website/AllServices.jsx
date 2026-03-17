// src/components/website/AllServices.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Activity, Smile, Eye, FlaskConical, Shield, Star, Clock, Search, Loader2 } from "lucide-react";
import "./AllServices.css";

function AllServices() {
  const navigate = useNavigate();
  
  // States - الحالات المجهزة للباك إند
  const [services, setServices] = useState([]); // الداتا هتيجي هنا
  const [categories, setCategories] = useState(["الكل"]); // التصنيفات ديناميكية
  const [isLoading, setIsLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ

  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // دالة لجلب البيانات من الباك إند
  useEffect(() => {
    setIsLoaded(true);

    const fetchServices = async () => {
      try {
        // ==========================================
        // هنا مكان الربط الحقيقي بالـ API
        // const response = await fetch("https://your-backend-api.com/api/services");
        // const data = await response.json();
        // ==========================================

        // داتا مؤقتة (Mock Data) لحد ما الباك إند يجهز
        const mockData = [
          { id: 1, name: "فحص القلب الشامل", category: "قلب", doctor: "د. أحمد محمد", price: "250ج", time: "30 دقيقة", rating: "4.9" },
          { id: 2, name: "تبييض وتلميع الأسنان", category: "أسنان", doctor: "د. محمد سالم", price: "200ج", time: "45 دقيقة", rating: "4.8" },
          { id: 3, name: "فحص نظر بالكمبيوتر", category: "عيون", doctor: "د. سارة حسن", price: "220ج", time: "20 دقيقة", rating: "4.7" },
          { id: 4, name: "باقة التحاليل الشاملة", category: "تحاليل", doctor: "د. فاطمة علي", price: "450ج", time: "15 دقيقة", rating: "5.0" },
          { id: 5, name: "جلسة نضارة للبشرة", category: "جلدية", doctor: "د. ندى كمال", price: "300ج", time: "40 دقيقة", rating: "4.9" },
          { id: 6, name: "رسم قلب بالمجهود", category: "قلب", doctor: "د. أحمد محمد", price: "350ج", time: "45 دقيقة", rating: "4.8" },
        ];

        // محاكاة تأخير السيرفر (1.5 ثانية) عشان تشوفي شكل الـ Loading الفخم
        setTimeout(() => {
          setServices(mockData);
          
          // استخراج التخصصات أوتوماتيك من الداتا (عشان لو الباك إند ضاف تخصص جديد يظهر لوحده)
          const uniqueCategories = ["الكل", ...new Set(mockData.map(item => item.category))];
          setCategories(uniqueCategories);
          
          setIsLoading(false);
        }, 1500);

      } catch (err) {
        setError("عذراً، حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقاً.");
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // دالة لتوزيع الأيقونات بناءً على اسم القسم اللي راجع من الداتا
  const getIconForCategory = (category) => {
    switch (category) {
      case "قلب": return <Activity size={32} />;
      case "أسنان": return <Smile size={32} />;
      case "عيون": return <Eye size={32} />;
      case "تحاليل": return <FlaskConical size={32} />;
      case "جلدية": return <Shield size={32} />;
      default: return <Activity size={32} />;
    }
  };

  // دالة تأثير الإضاءة (Spotlight)
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  // فلترة الداتا
  const filteredServices = services.filter((service) => {
    const matchCategory = activeCategory === "الكل" || service.category === activeCategory;
    const matchSearch = service.name.includes(searchQuery) || service.doctor.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="premium-services-page">
      {/* خلفية الـ Aura */}
      <div className="aura-background">
        <div className="aura-orb cyan-orb"></div>
        <div className="aura-orb purple-orb"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="services-container">
        <button className="back-btn-premium" onClick={() => navigate("/")}>
          <ArrowRight size={20} />
          <span>العودة للرئيسية</span>
        </button>

        <div className={`services-header ${isLoaded ? "fade-in" : ""}`}>
          <div className="badge-glow">رحلة شفائك تبدأ هنا</div>
          <h1 className="main-title">
            الخدمات <span className="gradient-text">الطبية</span>
          </h1>
          <p className="sub-title">نرشح لك أفضل الخدمات والرعاية بناءً على أعلى معايير الجودة العالمية.</p>
        </div>

        <div className={`controls-section ${isLoaded ? "slide-up" : ""}`}>
          <div className="search-box-premium">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="ابحث عن خدمة أو طبيب..." 
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

        {/* عرض الحالات: خطأ، تحميل، أو عرض البيانات */}
        {error ? (
          <div className="empty-state error-state">
            <Shield size={48} className="error-icon" />
            <h3>{error}</h3>
            <button className="retry-btn" onClick={() => window.location.reload()}>إعادة المحاولة</button>
          </div>
        ) : isLoading ? (
          <div className="loading-state">
            <Loader2 size={48} className="spinner-icon" />
            <p>جاري تحميل الخدمات الطبية...</p>
          </div>
        ) : (
          <div className="crystal-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div 
                  key={service.id} 
                  className="crystal-card"
                  onMouseMove={handleMouseMove}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="scan-line"></div>
                  
                  <div className="card-inner">
                    <div className="card-top">
                      <div className="icon-glass-wrapper">
                        {getIconForCategory(service.category)}
                      </div>
                      <div className="rating-badge">
                        <Star size={14} className="star-icon" />
                        <span>{service.rating}</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <h3 className="service-title">{service.name}</h3>
                      <p className="doctor-name">{service.doctor}</p>
                      
                      <div className="service-meta">
                        <div className="meta-item">
                          <Clock size={16} />
                          <span>{service.time}</span>
                        </div>
                        <div className="price-tag">{service.price}</div>
                      </div>
                    </div>

                    <div className="unfold-action">
                      <button 
                        className="book-btn-premium"
                        onClick={() => navigate(`/booking/${service.id}`)}
                      >
                        <span>احجز الآن</span>
                        <div className="btn-glow-effect"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🩺</div>
                <h3>لم نجد ما تبحث عنه...</h3>
                <p>حاول استخدام كلمات أخرى أو تصفح الأقسام المختلفة.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllServices;
