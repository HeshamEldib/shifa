import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Users,
    Calendar,
    Clock,
    Activity,
    ArrowUpRight,
    CheckCircle,
    Video,
    MapPin,
} from "lucide-react";
import { getDoctorOverviewApi } from "../../services/doctorDashboardService";
import "./DoctorOverview.css";
import { Link } from "react-router-dom";

function DoctorOverview() {
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = useState({ stats: {}, todaySchedule: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const overviewData = await getDoctorOverviewApi();
                setData(overviewData);
            } catch (error) {
                console.error("خطأ في جلب بيانات اللوحة:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, []);

    if (isLoading) {
        return (
            <div className="overview-loading">
                <div className="custom-spinner"></div>
                <p>جاري تحضير عيادتك الرقمية...</p>
            </div>
        );
    }

    const { stats, todaySchedule } = data;
    const today = new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="doctor-overview-container fade-in-up">
            {/* رأس الصفحة */}
            <div className="overview-header">
                <div>
                    <h2 className="text-white mb-1">
                        مرحباً دكتور {user?.fullName?.split(" ")[0]} 👋
                    </h2>
                    <p className="text-muted m-0">
                        إليك ملخص سريع لعيادتك اليوم: {today}
                    </p>
                </div>
            </div>

            {/* 1. شبكة الإحصائيات (Stats Grid) */}
            <div className="stats-grid">
                <div className="stat-card glass-receipt border-cyan">
                    <div className="stat-icon bg-cyan-light">
                        <Calendar size={24} className="text-cyan" />
                    </div>
                    <div className="stat-info">
                        <p>مواعيد اليوم</p>
                        <h3>{stats.todayAppointments}</h3>
                    </div>
                </div>

                <div className="stat-card glass-receipt border-success">
                    <div className="stat-icon bg-success-light">
                        <Users size={24} className="text-success" />
                    </div>
                    <div className="stat-info">
                        <p>إجمالي المرضى</p>
                        <h3>{stats.totalPatients}</h3>
                    </div>
                </div>

                <div className="stat-card glass-receipt border-warning">
                    <div className="stat-icon bg-warning-light">
                        <Clock size={24} className="text-warning" />
                    </div>
                    <div className="stat-info">
                        <p>طلبات معلقة</p>
                        <h3>{stats.pendingRequests}</h3>
                    </div>
                </div>

                <div className="stat-card glass-receipt border-purple">
                    <div className="stat-icon bg-purple-light">
                        <Activity size={24} className="text-purple" />
                    </div>
                    <div className="stat-info">
                        <p>مكتمل (هذا الشهر)</p>
                        <h3>
                            {stats.completedThisMonth}{" "}
                            <ArrowUpRight size={16} className="text-success" />
                        </h3>
                    </div>
                </div>
            </div>

            {/* 2. القسم السفلي: مواعيد اليوم + نشاطات */}
            <div className="overview-bottom-grid">
                {/* جدول مواعيد اليوم */}
                <div className="today-schedule-section glass-receipt">
                    <div className="section-title d-flex justify-content-between align-items-center mb-4">
                        <h4 className="m-0 text-white">
                            <Calendar size={20} className="me-2 text-cyan" />{" "}
                            جدول اليوم
                        </h4>
                        <span className="badge-info">
                            {todaySchedule.length} مواعيد
                        </span>
                    </div>

                    {todaySchedule.length === 0 ? (
                        <div className="empty-schedule text-center py-4">
                            <CheckCircle
                                size={40}
                                className="text-muted mb-2"
                                opacity="0.5"
                            />
                            <p className="text-muted">
                                ليس لديك أي مواعيد مجدولة لهذا اليوم.
                            </p>
                        </div>
                    ) : (
                        <div className="schedule-list">
                            {todaySchedule.map((app) => (
                                <div
                                    key={app.appointmentID}
                                    className="schedule-item"
                                >
                                    <div className="schedule-time">
                                        <strong>{app.time}</strong>
                                    </div>
                                    <div className="schedule-details">
                                        <h5 className="patient-name">
                                            {app.patientName}
                                        </h5>
                                        <div className="app-meta">
                                            {app.type === "أونلاين" ? (
                                                <span className="meta-badge online">
                                                    <Video size={14} /> أونلاين
                                                </span>
                                            ) : (
                                                <span className="meta-badge clinic">
                                                    <MapPin size={14} /> في
                                                    العيادة
                                                </span>
                                            )}
                                            <span
                                                className={`status-dot ${app.status.toLowerCase()}`}
                                            ></span>
                                            <span className="status-label">
                                                {app.status === "Confirmed"
                                                    ? "مؤكد"
                                                    : "قيد الانتظار"}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to={
                                            app.type === "أونلاين" &&
                                            app.status === "Confirmed"
                                                ? `/doctor/video-call/${app.appointmentID}`
                                                : `/doctor/records/${app.patientID}`
                                        }
                                        className={`btn-action-sm ${app.type === "أونلاين" && app.status === "Confirmed" ? "btn-primary" : "btn-secondary"}`}
                                    >
                                        {/* className="btn-action-sm"  */}

                                        {app.type === "أونلاين"
                                            ? "بدء الجلسة"
                                            : "الملف الطبي"}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* مساحة لإضافة ميزات سريعة (مثل: ملاحظات، تذكيرات، أو آخر الروشتات) */}
                <div className="quick-actions-section glass-receipt">
                    <h4 className="header-title-action">
                        <Activity
                            size={20}
                            className="header-title-action-icon"
                        />{" "}
                        نشاط سريع
                    </h4>
                    <div className="action-buttons-grid">
                        <Link to="/doctor/appointments" className="action-btn">
                            <Calendar size={20} />
                            <span>إدارة جدول العمل</span>
                        </Link>
                        <Link to="/doctor/patients" className="action-btn">
                            <Users size={20} />
                            <span>البحث عن مريض</span>
                        </Link>
                        <Link to="/doctor/reports" className="action-btn">
                            <ArrowUpRight size={20} />
                            <span>تقارير الأرباح</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorOverview;
