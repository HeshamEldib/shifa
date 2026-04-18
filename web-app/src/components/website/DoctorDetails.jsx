// src/components/website/DoctorDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Star,
    Award,
    Users,
    Calendar,
    Shield,
} from "lucide-react";
import "./DoctorDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../store/slices/doctorsSlice";
import {
    getDoctorServices,
} from "../../services/doctorsService";
import CardService from "./CardService";
import { getDoctorAvailability } from "../../services/doctorAvailabilityService";

const API_URL = process.env.REACT_APP_API_URL;

function DoctorDetails() {
    const { doctorId: id } = useParams();

    const dispatch = useDispatch();

    // 2. جلب قائمة الأطباء من Redux
    const {
        data,
        isLoading: doctorsLoading,
        isLoaded,
        error,
    } = useSelector((state) => state.doctors || {});
    const doctorsList = Array.isArray(data) ? data : [];

    // 3. البحث عن الطبيب المطلوب
    const doctor = doctorsList.find((doc) => doc.doctorID === id);

    // 4. حالة (State) خاصة بمواعيد الطبيب
    const [availability, setAvailability] = useState([]);
    const [services, setServices] = useState([]);

    const [loadingAvail, setLoadingAvail] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);

    
    // التأكد من تحميل قائمة الأطباء إذا دخل المستخدم للصفحة مباشرة (Refresh)
    useEffect(() => {
        if (doctorsList.length === 0) {
            dispatch(fetchDoctors());
        }
    }, [dispatch, doctorsList.length]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!id) return;
            try {
                setLoadingAvail(true);
                const schedule = await getDoctorAvailability(id);
                setAvailability(schedule);
            } catch (error) {
                console.error("خطأ في جلب المواعيد:", error);
            } finally {
                setLoadingAvail(false);
            }
        };

        fetchAvailability();
    }, [id]);

    useEffect(() => {
        const fetchDoctorServices = async () => {
            if (!id) return;
            try {
                setLoadingServices(true);
                const docServices = await getDoctorServices(id);
                setServices(docServices);
            } catch (error) {
                console.error("خطأ في جلب خدمات الطبيب:", error);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchDoctorServices();
    }, [id]);

    if (doctorsLoading)
        return (
            <div className="loading-spinner">جاري تحميل بيانات الطبيب...</div>
        );
    if (error) return <div className="error-message">{error}</div>;
    if (!doctor)
        return <div className="error-message">لم يتم العثور على الطبيب.</div>;

    const days = [
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
    ];
    function time(t) {
        const [hour, minute] = t.split(":");
        const period = hour >= 12 ? "م" : "ص";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minute} ${period}`;
    }

    return (
        <div className="premium-doctor-details">
            <div className="aura-background">
                <div className="aura-orb cyan-orb"></div>
                <div className="aura-orb purple-orb"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="details-container">
                <div className="layout-grid">
                    {/* ========================================= */}
                    {/* القسم الأيمن: السيرة الذاتية (Bio & Info) */}
                    {/* ========================================= */}
                    <div
                        className={`main-info-section ${isLoaded ? "fade-in-left" : ""}`}
                    >
                        <div className="doctor-hero-profile">
                            <div className="hero-image-wrapper">
                                <img
                                    src={
                                        doctor.image
                                            ? API_URL + doctor.image
                                            : "/doctor.png"
                                    }
                                    alt={doctor.fullName}
                                    className="hero-image"
                                />
                                <div className="image-gradient-mask"></div>
                            </div>
                            <div className="hero-text">
                                <div className="verified-badge">
                                    <Shield size={16} /> طبيب موثق
                                </div>
                                <h1 className="hero-name">{doctor.fullName}</h1>
                                <h2 className="hero-specialty">
                                    {doctor.specialty}
                                </h2>
                                <p className="hero-quote">"{doctor.quote}"</p>
                            </div>
                        </div>

                        <div className="trust-metrics-grid">
                            <div className="metric-card">
                                <div className="metric-icon gold">
                                    <Star size={24} />
                                </div>
                                <div className="metric-data">
                                    <span className="metric-value">
                                        {doctor.rating}
                                    </span>
                                    <span className="metric-label">
                                        التقييم
                                    </span>
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon cyan">
                                    <Award size={24} />
                                </div>
                                <div className="metric-data">
                                    <span className="metric-value">
                                        {doctor.experienceYears}
                                    </span>
                                    <span className="metric-label">خبرة</span>
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon purple">
                                    <Users size={24} />
                                </div>
                                <div className="metric-data">
                                    <span className="metric-value">
                                        {doctor.patientsCount}
                                    </span>
                                    <span className="metric-label">مريض</span>
                                </div>
                            </div>
                        </div>

                        <div className="content-block">
                            <h3 className="block-title">نبذة عن الطبيب</h3>
                            <p className="block-text">{doctor.bio}</p>
                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* القسم الأيسر: كابينة الحجز (Sticky Widget) */}
                    {/* ========================================= */}
                    <div
                        className={`booking-sidebar ${isLoaded ? "fade-in-right" : ""}`}
                    >
                        <div className="sticky-booking-widget crystal-panel">
                            <div className="widget-header">
                                <h3 className="block-title">
                                    أوقات العمل المتاحة
                                </h3>
                            </div>

                            {loadingAvail ? (
                                <p>جاري تحميل المواعيد...</p>
                            ) : availability.length > 0 ? (
                                <div className="days-tabs">
                                    {availability.map((slot) => (
                                        <div
                                            key={slot.availabilityID}
                                            className="days-tab"
                                        >
                                            <strong>
                                                يوم {days[slot.dayOfWeek]}
                                            </strong>
                                            <Calendar size={16} />
                                            <p>من: {time(slot.startTime)}</p>
                                            <p>إلى: {time(slot.endTime)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-availability">
                                    لا توجد مواعيد عمل مسجلة لهذا الطبيب حالياً.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="doctor-services-section">
                    <h3 className="block-title">الخدمات التي يقدمها الطبيب</h3>

                    {loadingServices ? (
                        <p>جاري تحميل الخدمات...</p>
                    ) : services.length > 0 ? (
                        <div className="crystal-grid">
                            {services.map((service) => (
                                <CardService
                                    key={service.serviceID}
                                    service={service}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="no-availability">
                            هذا الطبيب لم يضف أي خدمات بعد.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorDetails;
