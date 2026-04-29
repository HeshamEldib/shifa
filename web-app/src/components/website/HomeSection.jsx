import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
// import "./AllDoctors.css";
import {
    ArrowLeft,
    Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../store/slices/doctorsSlice";
import { fetchServices } from "../../store/slices/servicesSlice";
import CardDoctor from "./CardDoctor";
import CardService from "./CardService";

function HomeSection({
    role,
}) {
    const dispatch = useDispatch();

    // جلب الأطباء من Redux
    const { data:dataDoc } = useSelector(
        (state) => state.doctors || {},
    );
    const doctorsList = Array.isArray(dataDoc) ? dataDoc : [];

    const { data:dataSer } = useSelector((state) => state.services || {});
    const servicesList = Array.isArray(dataSer) ? dataSer : [];

    useEffect(() => {
        if (doctorsList.length === 0) {
            dispatch(fetchDoctors());
        }
    }, [dispatch, doctorsList.length]);

    useEffect(() => {
        if (servicesList.length === 0) {
            dispatch(fetchServices());
        }
    }, [dispatch, servicesList.length]);

    // 👈 السر هنا: ترتيب الأطباء حسب التقييم ثم أخذ أول 3 فقط
    const topDoctors = [...doctorsList]
        .sort((a, b) => b.rating - a.rating) // ترتيب تنازلي (الأعلى أولاً)
        .slice(0, 3); // قص المصفوفة لأول 3 عناصر فقط

    
    const topServices = [...servicesList]
        .sort((a, b) => b.rating - a.rating) // ترتيب تنازلي (الأعلى أولاً)
        .slice(0, 6); // قص المصفوفة لأول 6 عناصر فقط

    // const [isVideoMuted, setIsVideoMuted] = useState(false);
    // const videoRef = useRef(null);

    // const isLoggedIn =
    //     role === "Patient" || role === "Doctor" || role === "Admin";

    // Video Observer
    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         (entries) => {
    //             entries.forEach((entry) => {
    //                 if (entry.isIntersecting) {
    //                     setIsVideoMuted(false);
    //                     if (videoRef.current)
    //                         videoRef.current.play().catch(() => {});
    //                 } else {
    //                     setIsVideoMuted(true);
    //                 }
    //             });
    //         },
    //         { threshold: 0.3 },
    //     );
    //     if (videoRef.current) observer.observe(videoRef.current);
    //     return () => observer.disconnect();
    // }, []);

    // Cards Animation
    useEffect(() => {
        const showCards = () => {
            const cards = document.querySelectorAll(".bento-service-card");
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add("animate-in");
                }, index * 250);
            });
        };
        const timer = setTimeout(showCards, 500);
        return () => clearTimeout(timer);
    }, []);

    // const unlockAudio = () => {
    //     if (videoRef.current && isVideoMuted) {
    //         videoRef.current.muted = false;
    //         videoRef.current.play().catch(() => {});
    //         setIsVideoMuted(false);
    //     }
    // };

    return (
        <div className="premium-dark-app" dir="rtl">
            {/* Backgrounds */}
            <div className="aurora-bg">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="tech-grid"></div>
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
                            مستقبل الرعاية الصحية،
                            <br />
                            <span className="text-gradient">بين يديك الآن</span>
                        </h1>
                        <p className="hero-desc-centered">
                            ارتقِ بتجربتك الطبية مع منصة شفاء. حجز مواعيد، إدارة
                            ملفات طبية، وتواصل مباشر مع نخبة الأطباء.
                        </p>
                        <div className="hero-buttons-centered">
                            <Link to="/signup"
                                className="btn-glow large"
                            >
                                ابدأ الاستخدام مجاناً <ArrowLeft size={18} />
                            </Link>

                            <button
                                className="btn-outline large"
                                onClick={() => {
                                    document
                                        .querySelector(".services-section")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                            >
                                <Play size={18} /> تصفح الخدمات
                            </button>
                        </div>
                    </div>

                    {/* فيديو كامل العرض */}
                    {/* <div className="full-width-video">
                        <video
                            ref={videoRef}
                            src="/background-video.mp4"
                            autoPlay
                            loop
                            muted={isVideoMuted}
                            playsInline
                            className="hero-video-full"
                        />
                    </div> */}
                </div>
            </main>

            {/* Services - Bento Grid */}
            <section className="services-section">
                <div className="section-heading-center">
                    <h2 className="title">خدماتنا الطبية</h2>
                    <p className="subtitle">
                        رعاية صحية شاملة مصممة خصيصاً لتلبية احتياجاتك
                    </p>
                </div>

                <div className="crystal-grid">
                    {topServices.length > 0 &&
                        topServices.map((service, index) => (
                        <CardService
                            key={service.serviceID}
                            service={service}
                            index={index} />
                    ))}
                </div>

                {/* زر جديد تحت الكروت */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "40px",
                    }}
                >
                    <Link to="/services" className="btn-text-link large">
                        تصفح كل الخدمات <ArrowLeft size={18} />
                    </Link>
                </div>
            </section>

            {/* Doctors */}
            <section className="doctors-section">
                <div className="container">
                    <div className="section-heading flex-between">
                        <div>
                            <h2 className="title">نخبة الأطباء</h2>
                            <p className="subtitle">
                                أفضل المتخصصين لمتابعة حالتك
                            </p>
                        </div>
                        <Link
                            to="/doctors"
                            className="btn-text-link desktop-only"
                        >
                            عرض الجميع <ArrowLeft size={16} />
                        </Link>
                    </div>
                    <div className="crystal-grid">
                        {topDoctors.length > 0 &&
                            topDoctors.map((doctor, index) => (
                                <CardDoctor
                                    key={doctor.doctorID}
                                    doc={doctor}
                                    index={index}
                                />
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomeSection;
