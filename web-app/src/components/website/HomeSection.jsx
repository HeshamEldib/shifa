import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Star, Quote } from "lucide-react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../store/slices/doctorsSlice";
import { fetchServices } from "../../store/slices/servicesSlice";

const API_URL = process.env.REACT_APP_API_URL;

function HomeSection({
    onLoginClick,
    onContactClick,
    onAboutClick,
    onSignupClick,
    onGoAllServices,
    onGoAllDoctors,
    onServiceClick,
    onDoctorClick,
    role,
}) {
    const dispatch = useDispatch();

    // جلب الأطباء من Redux
    const { data: dataDoc } = useSelector((state) => state.doctors || {});
    const doctorsList = Array.isArray(dataDoc) ? dataDoc : [];

    const { data: dataSer } = useSelector((state) => state.services || {});
    const servicesList = Array.isArray(dataSer) ? dataSer : [];

    const { t, i18n, ready } = useTranslation();
    const navigate = useNavigate();

    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const videoRef = useRef(null);

    // const [services, setServices] = useState([]);
    // const [doctors, setDoctors] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    const [langKey, setLangKey] = useState(i18n.language);

    const isLoggedIn =
        role === "Patient" || role === "Doctor" || role === "Admin";

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

    useEffect(() => {
        document.documentElement.dir = i18n.dir();
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    useEffect(() => {
        const handleLangChange = (lng) => setLangKey(lng);
        i18n.on("languageChanged", handleLangChange);
        return () => i18n.off("languageChanged", handleLangChange);
    }, [i18n]);

    useEffect(() => {
        if (!ready) return;

        // const updateServices = () => {
        //     setServices([
        //         {
        //             id: 1,
        //             name: t("services.list.0.name"),
        //             doctor: t("services.list.0.doctor"),
        //             price: t("services.list.0.price"),
        //             img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 2,
        //             name: t("services.list.1.name"),
        //             doctor: t("services.list.1.doctor"),
        //             price: t("services.list.1.price"),
        //             img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 3,
        //             name: t("services.list.2.name"),
        //             doctor: t("services.list.2.doctor"),
        //             price: t("services.list.2.price"),
        //             img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 4,
        //             name: t("services.list.3.name"),
        //             doctor: t("services.list.3.doctor"),
        //             price: t("services.list.3.price"),
        //             img: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 5,
        //             name: t("services.list.4.name"),
        //             doctor: t("services.list.4.doctor"),
        //             price: t("services.list.4.price"),
        //             img: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 6,
        //             name: t("services.list.5.name"),
        //             doctor: t("services.list.5.doctor"),
        //             price: t("services.list.5.price"),
        //             img: "https://images.pexels.com/photos/3779711/pexels-photo-3779711.jpeg?auto=compress&cs=tinysrgb&w=300",
        //         },
        //     ]);
        // };
        // const updateDoctors = () => {
        //     setDoctors([
        //         {
        //             id: 1,
        //             name: t("doctors.list.0.name"),
        //             specialty: t("doctors.list.0.specialty"),
        //             img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 2,
        //             name: t("doctors.list.1.name"),
        //             specialty: t("doctors.list.1.specialty"),
        //             img: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4816dffb6893ee2feb6aaf41835d601f4fd3a9cb.jpg",
        //         },
        //         {
        //             id: 3,
        //             name: t("doctors.list.2.name"),
        //             specialty: t("doctors.list.2.specialty"),
        //             img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
        //         },
        //         {
        //             id: 4,
        //             name: t("doctors.list.3.name"),
        //             specialty: t("doctors.list.3.specialty"),
        //             img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
        //         },
        //     ]);
        // };

        const updateTestimonials = () => {
            setTestimonials([
                {
                    id: 1,
                    name: t("testimonials.list.0.name"),
                    review: t("testimonials.list.0.review"),
                    role: t("testimonials.list.0.role"),
                    img: "https://ui-avatars.com/api/?name=Mahmoud&background=0f172a&color=38bdf8",
                },
                {
                    id: 2,
                    name: t("testimonials.list.1.name"),
                    review: t("testimonials.list.1.review"),
                    role: t("testimonials.list.1.role"),
                    img: "https://ui-avatars.com/api/?name=Sara&background=0f172a&color=38bdf8",
                },
                {
                    id: 3,
                    name: t("testimonials.list.2.name"),
                    review: t("testimonials.list.2.review"),
                    role: t("testimonials.list.2.role"),
                    img: "https://ui-avatars.com/api/?name=Ahmed&background=0f172a&color=38bdf8",
                },
            ]);
        };

        // updateServices();
        // updateDoctors();
        updateTestimonials();

        const handleLanguageChange = () => {
            // updateServices();
            // updateDoctors();
            updateTestimonials();
        };

        i18n.on("languageChanged", handleLanguageChange);
        return () => i18n.off("languageChanged", handleLanguageChange);
    }, [t, i18n, ready]);

    useEffect(() => {
        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVideoMuted(false);
                        if (videoRef.current)
                            videoRef.current.play().catch(() => {});
                    } else {
                        setIsVideoMuted(true);
                    }
                });
            },
            { threshold: 0.3 },
        );

        if (videoRef.current) videoObserver.observe(videoRef.current);
        return () => videoObserver.disconnect();
    }, []);

    useEffect(() => {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
        );

        const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
        hiddenElements.forEach((el) => revealObserver.observe(el));

        return () => revealObserver.disconnect();
    }, [testimonials]);

    const unlockAudio = () => {
        if (videoRef.current && isVideoMuted) {
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {});
            setIsVideoMuted(false);
        }
    };

    const handleDoctorCardClick = (doctorId) => {
        if (onDoctorClick) onDoctorClick(doctorId);
    };

    if (!ready) {
        return <div>{t("contact.loading", "جاري التحميل...")}</div>;
    }

    return (
        <div
            className="shifaa-blue-theme force-edge-to-edge"
            dir={i18n.dir()}
            key={langKey}
            onClick={unlockAudio}
        >
            <section id="home" className="hero-full-edge">
                <div className="hero-video-layer reveal-on-scroll delay-1">
                    <div className="video-navy-overlay"></div>
                    <video
                        ref={videoRef}
                        key={langKey}
                        src={`${process.env.PUBLIC_URL}/shifaa-hero.mp4`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="video-full-screen"
                    />
                </div>

                <div className="hero-text-layer reveal-on-scroll delay-3">
                    <div className="container-inner">
                        <div className="hero-content-box">
                            <h1
                                className="hero-main-title"
                                dangerouslySetInnerHTML={{
                                    __html: t("hero.title"),
                                }}
                            />

                            <p className="hero-main-desc">{t("hero.desc")}</p>

                            <div className="hero-actions-group">
                                <Link className="btn-solid-cyan" to="/signup">
                                    {t("hero.startBtn")}
                                    {i18n.language === "ar" && (
                                        <ArrowLeft size={18} />
                                    )}
                                </Link>

                                <button
                                    className="btn-outline-cyan"
                                    onClick={() =>
                                        document
                                            .querySelector(
                                                ".features-navy-section",
                                            )
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                            })
                                    }
                                >
                                    {t("hero.browseBtn")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-navy-section">
                <div className="container-inner">
                    <div className="feature-row">
                        <div className="feature-img-box reveal-on-scroll delay-1">
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                                alt="img"
                                className="img-zoom-hover"
                            />
                        </div>

                        <div className="feature-text-box reveal-on-scroll delay-2">
                            <span className="badge-cyan-glow">
                                {t("features.f1_badge")}
                            </span>
                            <h2 className="feature-blue-title">
                                {t("features.f1_title")}
                            </h2>
                            <p className="feature-blue-desc">
                                {t("features.f1_desc")}
                            </p>
                        </div>
                    </div>

                    <div className="feature-row row-reverse mt-100">
                        <div className="feature-img-box reveal-on-scroll delay-1">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                                alt="img"
                                className="img-zoom-hover"
                            />
                        </div>

                        <div className="feature-text-box reveal-on-scroll delay-2">
                            <span className="badge-royal-glow">
                                {t("features.f2_badge")}
                            </span>
                            <h2 className="feature-blue-title">
                                {t("features.f2_title")}
                            </h2>
                            <p className="feature-blue-desc">
                                {t("features.f2_desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="services-ocean-section">
                <div className="container-inner">
                    <div className="section-title-wrap reveal-on-scroll delay-1">
                        <h2 className="blue-section-title">
                            {t("services.title")}
                        </h2>
                        <p className="blue-section-sub">
                            {t("services.subtitle")}
                        </p>
                    </div>

                    <div className="services-blue-grid">
                        {servicesList.map((service, index) => (
                            <Link
                                to={`/service/${service.serviceID}`}
                                className="service-link-overlay"
                            >
                                <div
                                    key={service.serviceID}
                                    className={`service-glass-card delay-${(index % 3) + 1}`}
                                    // onClick={() => handleServiceClick(service.serviceID)}
                                >
                                    <div className="card-top-row">
                                        <div className="service-img-circle">
                                            <img
                                                src="/ser-1.avif"
                                                alt={service.serviceName}
                                                className="service-img-real"
                                            />
                                        </div>
                                        <span className="price-blue-badge">
                                            {service.price}
                                        </span>
                                    </div>
                                    <h3 className="service-title-glow">
                                        {service.serviceName}
                                    </h3>
                                    <p className="service-doc-sub">
                                        {service.doctorName}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="center-btn-wrap reveal-on-scroll delay-2">
                        <Link to="/services" className="btn-solid-cyan">
                            {t("services.viewAll")}
                            {i18n.language === "ar" && <ArrowLeft size={16} />}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="doctors-navy-section">
                <div className="container-inner">
                    <div className="section-title-row reveal-on-scroll delay-1">
                        <div>
                            <h2 className="blue-section-title">
                                {t("doctors.title")}
                            </h2>
                            <p className="blue-section-sub">
                                {t("doctors.subtitle")}
                            </p>
                        </div>

                        <Link
                            to="/doctors"
                            className="link-cyan-text desktop-only"
                        >
                            {t("doctors.viewAll")}
                            {i18n.language === "ar" && <ArrowLeft size={16} />}
                        </Link>
                    </div>

                    <div className="doctors-blue-slider reveal-on-scroll delay-2">
                        {doctorsList.map((doctor) => (
                            <Link
                                to={`/doctor/${doctor.doctorID}`}
                                className="doctor-link-overlay"
                            >
                                <div
                                    key={doctor.doctorID}
                                    className="doctor-glass-card"
                                    // onClick={() => handleDoctorCardClick(doctor.doctorID)}
                                >
                                    <div className="doc-avatar-blue">
                                        <img
                                            src={
                                                !doctor.image
                                                    ? "/doctor.png"
                                                    : API_URL + doctor.image
                                            }
                                            alt={doctor.fullName}
                                            className="img-zoom-hover"
                                        />
                                    </div>

                                    <div className="doc-info-blue">
                                        <h3 className="doc-name-glow">
                                            {doctor.fullName}
                                        </h3>
                                        <p className="doc-specialty-sub">
                                            {doctor.specialty}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="testimonials-chat-section">
                <div className="container-inner">
                    <div className="section-title-wrap reveal-on-scroll delay-1">
                        <h2 className="blue-section-title">
                            {t("testimonials.title")}
                        </h2>
                        <p className="blue-section-sub">
                            {t("testimonials.subtitle")}
                        </p>
                    </div>

                    <div className="chat-bubbles-container">
                        {testimonials.map((testi, index) => (
                            <div
                                key={testi.id}
                                className={`chat-bubble-wrapper reveal-on-scroll delay-${(index % 3) + 1} ${
                                    index % 2 === 0
                                        ? "align-right"
                                        : "align-left"
                                }`}
                            >
                                <div className="chat-avatar-box">
                                    <img
                                        src={testi.img}
                                        alt={testi.name}
                                        className="chat-avatar"
                                    />
                                </div>

                                <div className="chat-bubble-content">
                                    <div className="chat-bubble-header">
                                        <span className="chat-name">
                                            {testi.name}
                                        </span>
                                        <span className="chat-role">
                                            ({testi.role})
                                        </span>

                                        <div className="chat-stars">
                                            <Star
                                                size={12}
                                                fill="#fbbf24"
                                                color="#fbbf24"
                                            />
                                            <Star
                                                size={12}
                                                fill="#fbbf24"
                                                color="#fbbf24"
                                            />
                                            <Star
                                                size={12}
                                                fill="#fbbf24"
                                                color="#fbbf24"
                                            />
                                            <Star
                                                size={12}
                                                fill="#fbbf24"
                                                color="#fbbf24"
                                            />
                                            <Star
                                                size={12}
                                                fill="#fbbf24"
                                                color="#fbbf24"
                                            />
                                        </div>
                                    </div>

                                    <div className="chat-message">
                                        <Quote
                                            size={16}
                                            className="chat-quote-icon"
                                        />
                                        <p>{testi.review}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomeSection;
