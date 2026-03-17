import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import { 
  ArrowLeft, Menu, X, Activity, Search, Smile, Eye, Shield, User, Play, Facebook, Instagram, Linkedin
} from "lucide-react";

function HomeSection({
  onLoginClick, onContactClick, onAboutClick, onSignupClick,
  onGoAllServices, onGoAllDoctors, onServiceClick, onDoctorClick, role,
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false); 
  const videoRef = useRef(null);

  const isLoggedIn = role === "Patient" || role === "Doctor" || role === "Admin";

  // Video Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoMuted(false); 
            if (videoRef.current) videoRef.current.play().catch(() => {});
          } else {
            setIsVideoMuted(true); 
          }
        });
      },
      { threshold: 0.3 } 
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Cards Animation
  useEffect(() => {
    const showCards = () => {
      const cards = document.querySelectorAll('.bento-service-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in');
        }, index * 250);
      });
    };
    const timer = setTimeout(showCards, 500);
    return () => clearTimeout(timer);
  }, []);

  const unlockAudio = () => { 
    if (videoRef.current && isVideoMuted) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(()=>{});
      setIsVideoMuted(false);
    }
  };

  const handleServiceClick = (serviceId) => { 
    if (!isLoggedIn) { onLoginClick(); return; } 
    if (onServiceClick) onServiceClick(serviceId); 
  };
  
  const handleDoctorCardClick = (doctorId) => { if (onDoctorClick) onDoctorClick(doctorId); };
  const handleNavLinkClick = (callback) => { if (callback) callback(); setIsMobileNavOpen(false); };

  const services = [
    { id: 1, name: "فحص القلب الشامل", doctor: "د. أحمد محمد", price: "250ج", icon: <Activity size={44} /> },
    { id: 2, name: "تحليل دم كامل", doctor: "د. فاطمة علي", price: "180ج", icon: <Search size={40} /> },
    { id: 3, name: "تنظيف أسنان", doctor: "د. محمد سالم", price: "200ج", icon: <Smile size={40} /> },
    { id: 4, name: "فحص عيون", doctor: "د. سارة حسن", price: "220ج", icon: <Eye size={42} /> },
    { id: 5, name: "فحص جلدية", doctor: "د. خالد عبدالله", price: "190ج", icon: <Shield size={40} /> },
    { id: 6, name: "فحص أطفال", doctor: "د. نورا أحمد", price: "160ج", icon: <User size={42} /> },
  ];

  const doctors = [
    { id: 1, name: "د. أحمد محمد", specialty: "قلب وأوعية دموية", icon: <Activity size={32} /> },
    { id: 2, name: "د. فاطمة علي", specialty: "تحاليل مخبرية", icon: <Search size={32} /> },
    { id: 3, name: "د. محمد سالم", specialty: "طب أسنان", icon: <Smile size={32} /> },
  ];

  return (
    <div className="premium-dark-app" dir="rtl" onClick={unlockAudio}>
      
      {/* Backgrounds */}
      <div className="aurora-bg">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
        <div className="tech-grid"></div>
      </div>

      {/* Navbar */}
      <div className="navbar-wrapper">
        <nav className="capsule-navbar">
          <div className="navbar-brand">
            <div className="logo-icon-neon">S</div>
            <span className="logo-text">شــفاء</span>
          </div>
          <div className="nav-links desktop-only">
            <a href="#home" className="nav-item active">الرئيسية</a>
            <button className="nav-item" onClick={() => handleNavLinkClick(onAboutClick)}>من نحن</button>
            <button className="nav-item" onClick={() => handleNavLinkClick(onContactClick)}>تواصل معنا</button>
          </div>
          <div className="nav-actions desktop-only">
            <button className="btn-text" onClick={onLoginClick}>تسجيل دخول </button>
            <button className="btn-glow" onClick={onSignupClick}>حساب جديد</button>
          </div>
          <button className="mobile-menu-toggle mobile-only" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
            {isMobileNavOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
          </button>
        </nav>
      </div>

      {/* Hero */}
      <main id="home" className="hero-centered-section">
        <div className="container">
          <div className="hero-text-centered">
            <div className="status-badge">
              <span className="status-dot"></span>
              النظام الأذكى لإدارة العيادات
            </div>
            <h1 className="hero-title-massive">
              مستقبل الرعاية الصحية،<br />
              <span className="text-gradient">بين يديك الآن</span>
            </h1>
            <p className="hero-desc-centered">
              ارتقِ بتجربتك الطبية مع منصة شفاء. حجز مواعيد، إدارة ملفات طبية، وتواصل مباشر مع نخبة الأطباء.
            </p>
            <div className="hero-buttons-centered">
              <button className="btn-glow large" onClick={onSignupClick}>
                ابدأ الاستخدام مجاناً <ArrowLeft size={18} />
              </button>

              <button className="btn-outline large" onClick={() => {
                  document.querySelector('.services-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                <Play size={18} /> تصفح الخدمات
              </button>
            </div>
          </div>

          {/* فيديو كامل العرض */}
          <div className="full-width-video">
            <video
              ref={videoRef}
              src="/background-video.mp4"
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              className="hero-video-full"
            />
          </div>
        </div>
      </main>

      {/* Services - Bento Grid */}
      <section className="services-section">
        <div className="section-heading-center">
          <h2 className="title">خدماتنا الطبية</h2>
          <p className="subtitle">رعاية صحية شاملة مصممة خصيصاً لتلبية احتياجاتك</p>
        </div>
        
        <div className="bento-services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`bento-service-card bento-card-${index + 1}`}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="service-icon-glow">{service.icon}</div>
              <div className="service-price-badge">{service.price}</div>
              <div className="service-content">
                <h3 className="service-title">{service.name}</h3>
                <p className="service-doctor">{service.doctor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* زر جديد تحت الكروت */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <button 
            className="btn-glow large" 
            onClick={onGoAllServices}
          >
            تصفح كل الخدمات <ArrowLeft size={18} />
          </button>
        </div>
      </section>

      {/* Doctors */}
      <section className="doctors-section">
        <div className="container">
          <div className="section-heading flex-between">
            <div>
              <h2 className="title">نخبة الأطباء</h2>
              <p className="subtitle">أفضل المتخصصين لمتابعة حالتك</p>
            </div>
            <button className="btn-text-link desktop-only" onClick={onGoAllDoctors}>
              عرض الجميع <ArrowLeft size={16} />
            </button>
          </div>
          <div className="doctors-slider">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card-pro" onClick={() => handleDoctorCardClick(doctor.id)}>
                <div className="doc-avatar-pro">{doctor.icon}</div>
                <div className="doc-info">
                  <h3 className="doc-name">{doctor.name}</h3>
                  <p className="doc-spec">{doctor.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="container">
        <footer className="giant-footer-card">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="logo-icon-neon large">S</div>
              <span className="logo-text large">شــفاء</span>
              <p className="footer-desc-chic">الرعاية الصحية الأفضل، بين يديك في أي وقت وأي مكان.</p>
            </div>
            <div className="footer-links-col">
              <h4>روابط سريعة</h4>
              <button onClick={onAboutClick}>من نحن</button>
              <button onClick={onContactClick}>تواصل معنا</button>
              <button onClick={onGoAllServices}>الخدمات</button>
            </div>
            <div className="footer-links-col">
              <h4>بيانات التواصل</h4>
              <span>info@shifaa.com</span>
              <span>+20 123 456 7890</span>
              <span>القاهرة، مصر</span>
            </div>
            <div className="footer-newsletter-col">
              <h4>النشرة البريدية</h4>
              <p className="newsletter-desc">اشترك ليصلك أحدث المقالات الطبية.</p>
              <div className="elegant-input-group">
                <input type="email" placeholder="بريدك الإلكتروني" />
                <button className="btn-glow small">اشتراك</button>
              </div>
              <div className="social-chic-links-pro">
                <a href="#fb"><Facebook size={22}/></a>
                <a href="#ig"><Instagram size={22}/></a>
                <a href="#in"><Linkedin size={22}/></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-chic">
            <p>© 2026 شفاء - جميع الحقوق محفوظة</p>
            <div className="legal-links">
              <a href="#privacy">سياسة الخصوصية</a>
              <a href="#terms">شروط الاستخدام</a>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default HomeSection;