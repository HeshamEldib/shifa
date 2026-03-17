// src/components/website/DoctorDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Award, Users, CheckCircle, Calendar, Clock, CreditCard, Shield } from "lucide-react";
import "./DoctorDetails.css";

function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  // ==========================================
  // 💾 STATES FOR BACKEND INTEGRATION
  // ==========================================
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // States لحجز المواعيد
  const [selectedDay, setSelectedDay] = useState("اليوم");
  const [selectedTime, setSelectedTime] = useState(null);

  // =========================================================================
  //  [BACKEND DEV INSTRUCTION] GET API (جلب بيانات الطبيب بناءً على الـ ID)
  // =========================================================================
  useEffect(() => {
    setIsLoaded(true);

    /*
      1. مسح دالة الـ setTimeout الوهمية دي.
      2. عمل Fetch لجلب تفاصيل الدكتور باستخدام المتغير (doctorId).
      3. شكل الاستجابة (Object) المفروض يكون كده:
      {
        id: 1,
        name: "...",
        specialty: "...",
        quote: "...",
        bio: "...",
        rating: "4.9",
        reviewsCount: 120,
        experience: "+15 سنة",
        patients: "+2000",
        price: "350",
        image: "URL",
        services: ["خدمة 1", "خدمة 2", ...],
        schedule: {
          "اليوم": ["10:00 ص", "11:30 ص"],
          "غداً": ["01:00 م", "03:30 م"],
          "الخميس": ["10:00 ص"]
        }
      }
    */

    const fetchDoctorDetails = async () => {
      try {
        // --- Mock Data (للتجربة حالياً) ---
        setTimeout(() => {
          setDoctor({
            id: doctorId || 1,
            name: "د. أحمد محمد",
            specialty: "استشاري جراحة القلب والأوعية الدموية",
            quote: "رعايتك تبدأ من التشخيص الدقيق والاستماع الجيد.",
            bio: "حاصل على زمالة الكلية الملكية للجراحين بلندن. متخصص في جراحات القلب المفتوح، القسطرة العلاجية، ومتابعة حالات ضغط الدم المتقدمة.",
            rating: "4.9",
            reviewsCount: 120,
            experience: "+15 سنة",
            patients: "+2000",
            price: "350",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
            services: ["رسم قلب بالمجهود", "قسطرة قلبية", "إيكو 4D", "علاج ارتفاع ضغط الدم"],
            schedule: {
              "اليوم": ["10:00 ص", "11:30 ص", "02:00 م"],
              "غداً": ["01:00 م", "03:30 م", "05:00 م", "07:00 م"],
              "الخميس": ["10:00 ص", "12:00 م"]
            }
          });
          setIsLoading(false);
        }, 1000);

        /*
        // --- Real API Example (الكود الفعلي للربط) ---
        // const response = await fetch(`https://your-api.com/api/doctors/${doctorId}`);
        // if (!response.ok) throw new Error("Failed to fetch doctor details");
        // const data = await response.json();
        // setDoctor(data);
        // setIsLoading(false);
        */

      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setIsLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBooking = () => {
    if (selectedTime) {
      navigate(`/booking/${doctor.id}`, { state: { day: selectedDay, time: selectedTime } });
    }
  };

  if (isLoading) {
    return (
      <div className="premium-doctor-details loading-screen">
        <div className="pulse-loader"></div>
      </div>
    );
  }

  return (
    <div className="premium-doctor-details">
      <div className="aura-background">
        <div className="aura-orb cyan-orb"></div>
        <div className="aura-orb purple-orb"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="details-container">
        <button className="back-btn-premium" onClick={() => navigate(-1)}>
          <ArrowRight size={20} />
          <span>العودة للأطباء</span>
        </button>

        <div className="layout-grid">
          
          {/* ========================================= */}
          {/* القسم الأيمن: السيرة الذاتية (Bio & Info) */}
          {/* ========================================= */}
          <div className={`main-info-section ${isLoaded ? "fade-in-left" : ""}`}>
            
            <div className="doctor-hero-profile">
              <div className="hero-image-wrapper">
                <img src={doctor.image} alt={doctor.name} className="hero-image" />
                <div className="image-gradient-mask"></div>
              </div>
              <div className="hero-text">
                <div className="verified-badge">
                  <Shield size={16} /> طبيب موثق
                </div>
                <h1 className="hero-name">{doctor.name}</h1>
                <h2 className="hero-specialty">{doctor.specialty}</h2>
                <p className="hero-quote">"{doctor.quote}"</p>
              </div>
            </div>

            <div className="trust-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon gold"><Star size={24} /></div>
                <div className="metric-data">
                  <span className="metric-value">{doctor.rating}</span>
                  <span className="metric-label">التقييم</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon cyan"><Award size={24} /></div>
                <div className="metric-data">
                  <span className="metric-value">{doctor.experience}</span>
                  <span className="metric-label">خبرة</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon purple"><Users size={24} /></div>
                <div className="metric-data">
                  <span className="metric-value">{doctor.patients}</span>
                  <span className="metric-label">مريض</span>
                </div>
              </div>
            </div>

            <div className="content-block">
              <h3 className="block-title">نبذة عن الطبيب</h3>
              <p className="block-text">{doctor.bio}</p>
            </div>

            <div className="content-block">
              <h3 className="block-title">الخدمات التي يقدمها</h3>
              <div className="services-tags">
                {doctor.services.map((service, index) => (
                  <span key={index} className="service-tag">
                    <CheckCircle size={16} className="tag-icon" />
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* القسم الأيسر: كابينة الحجز (Sticky Widget) */}
          {/* ========================================= */}
          <div className={`booking-sidebar ${isLoaded ? "fade-in-right" : ""}`}>
            <div className="sticky-booking-widget crystal-panel">
              
              <div className="widget-header">
                <h3>احجز موعدك الآن</h3>
                <div className="price-badge">
                  <CreditCard size={18} />
                  <span>{doctor.price} ج.م</span>
                </div>
              </div>

              <div className="days-tabs">
                {Object.keys(doctor.schedule).map((day) => (
                  <button 
                    key={day}
                    className={`day-tab ${selectedDay === day ? "active" : ""}`}
                    onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                  >
                    <Calendar size={16} />
                    {day}
                  </button>
                ))}
              </div>

              <div className="times-grid">
                {doctor.schedule[selectedDay].map((time) => (
                  <button 
                    key={time}
                    className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    <Clock size={16} />
                    {time}
                  </button>
                ))}
              </div>

              <div className="booking-action-area">
                {!selectedTime ? (
                  <p className="select-prompt">الرجاء اختيار الموعد المناسب لإتمام الحجز.</p>
                ) : (
                  <p className="selected-summary">
                    موعدك: <strong>{selectedDay}</strong> الساعة <strong>{selectedTime}</strong>
                  </p>
                )}
                
                <button 
                  className={`confirm-book-btn ${selectedTime ? "ready" : "disabled"}`}
                  onClick={handleBooking}
                  disabled={!selectedTime}
                >
                  {selectedTime ? "تأكيد الموعد والدفع" : "اختر موعداً"}
                  <div className="btn-glow"></div>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
