import React, { useState, useEffect } from "react";
import {
    Calendar,
    User,
    MapPin,
    Video,
    CheckCircle,
    XCircle,
    Filter,
    Search,
    FileText,
} from "lucide-react";
import {
    getDoctorAppointmentsApi,
    updateAppointmentStatusApi,
} from "../../services/doctorAppointmentService";
import "./DoctorAppointments.css";
import { Link } from "react-router-dom";

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All"); // All, Pending, Confirmed, Completed
    const [dateFilter, setDateFilter] = useState(""); // تصفية بالتاريخ
    const [searchQuery, setSearchQuery] = useState("");
    
    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                const data = await getDoctorAppointmentsApi(dateFilter);
                setAppointments(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [dateFilter]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateAppointmentStatusApi(id, newStatus);
            // تحديث الحالة محلياً لسرعة الاستجابة (Optimistic UI Update)
            setAppointments(
                appointments.map((app) =>
                    app.appointmentID === id
                        ? { ...app, status: newStatus }
                        : app,
                ),
            );
        } catch (error) {
            alert("حدث خطأ أثناء تحديث الحالة. يرجى المحاولة مرة أخرى.");
        }
    };

    // تطبيق التصفية (البحث + الحالة)
    const filteredAppointments = appointments.filter((app) => {
        const matchStatus =
            filterStatus === "All" || app.status === filterStatus;
        const matchSearch = app.patientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
    });

    if (isLoading) {
        return (
            <div className="overview-loading">
                <div className="custom-spinner"></div>
                <p>جاري تحميل المواعيد...</p>
            </div>
        );
    }

    console.log("app t =>", appointments);
    
    return (
        <div className="doctor-appointments-page fade-in-up">
            <div className="page-header-flex">
                <div>
                    <h2 className="text-white mb-1">
                        <Calendar className="text-cyan me-2" size={28} /> إدارة
                        المواعيد
                    </h2>
                    <p className="text-muted m-0">
                        قم بمراجعة طلبات الحجز، تأكيدها، أو إدارتها بسهولة.
                    </p>
                </div>
            </div>

            {/* شريط أدوات التصفية والبحث */}
            <div className="toolbar glass-receipt">
                <div className="search-box">
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="ابحث باسم المريض..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filters-group">
                    <div className="filter-item">
                        <Filter size={18} className="filter-icon" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">جميع الحالات</option>
                            <option value="Pending">
                                طلبات جديدة (قيد الانتظار)
                            </option>
                            <option value="Confirmed">مواعيد مؤكدة</option>
                            <option value="Completed">مواعيد مكتملة</option>
                            <option value="Cancelled">ملغاة</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            title="تصفية بيوم محدد"
                        />
                    </div>
                </div>
            </div>

            {/* قائمة الكروت */}
            <div className="appointments-list">
                {filteredAppointments.length === 0 ? (
                    <div className="empty-state text-center glass-receipt">
                        <Calendar
                            size={48}
                            className="text-muted mb-3"
                            opacity="0.4"
                        />
                        <h5 className="text-white">
                            لا توجد مواعيد تطابق بحثك
                        </h5>
                        <p className="text-muted">
                            جرب تغيير إعدادات التصفية أو التاريخ.
                        </p>
                    </div>
                ) : (
                    filteredAppointments.map((app) => (
                        <div
                            key={app.appointmentID}
                            className={`appointment-row glass-receipt status-${app.status.toLowerCase()}`}
                        >
                            <div className="row-main-info">
                                <div className="app-time-box">
                                    <span className="time-primary text-cyan">
                                        {new Date(
                                            app.appointmentDate,
                                        ).toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span className="date-secondary text-muted small">
                                        {new Date(
                                            app.appointmentDate,
                                        ).toLocaleDateString("ar-EG", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <div className="app-patient-info">
                                    <h4 className="text-white mb-1">
                                        <User
                                            size={18}
                                            className="text-muted me-1"
                                        />{" "}
                                        {app.patientName}
                                    </h4>
                                    <div className="app-meta-tags">
                                        <span className="text-muted small">
                                            {app.serviceName}
                                        </span>
                                        <span className="divider">•</span>
                                        {app.type === "Telemedicine" ? (
                                            <span className="meta-badge online">
                                                <Video size={14} /> أونلاين
                                            </span>
                                        ) : (
                                            <span className="meta-badge clinic">
                                                <MapPin size={14} /> عيادة
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row-actions">
                                {/* الإجراءات حسب الحالة */}
                                {app.status === "Pending" && (
                                    <>
                                        <button
                                            className="btn-action confirm"
                                            onClick={() =>
                                                handleStatusChange(
                                                    app.appointmentID,
                                                    "Confirmed",
                                                )
                                            }
                                        >
                                            <CheckCircle size={18} /> تأكيد
                                            الحجز
                                        </button>
                                        <button
                                            className="btn-action reject"
                                            onClick={() =>
                                                handleStatusChange(
                                                    app.appointmentID,
                                                    "Cancelled",
                                                )
                                            }
                                        >
                                            <XCircle size={18} /> رفض
                                        </button>
                                    </>
                                )}

                                {app.status === "Confirmed" && (
                                    <>
                                        {app.type === "Telemedicine" && (
                                            <button className="btn-action join-call">
                                                <Video size={18} /> بدء الجلسة
                                            </button>
                                        )}
                                        <Link
                                            to={`/doctor/records/${app.patientID}?appointmentId=${app.appointmentID}`}
                                            className="btn-action write-record"
                                        >
                                            <FileText size={18} /> كتابة السجل
                                            الطبي
                                        </Link>

                                        {/* زر إنهاء الكشف: لا يفعّل إلا إذا كان هناك سجل طبي مرتبط بالموعد */}
                                        <button
                                            className={`btn-action complete ${!app.hasMedicalRecord ? 'disabled-btn' : ''}`}
                                            disabled={!app.hasMedicalRecord} // حقل جديد من الباك إند
                                            title={
                                                !app.hasMedicalRecord
                                                    ? "يجب كتابة السجل الطبي أولاً لإتمام الكشف"
                                                    : ""
                                            }
                                            onClick={() =>{
                                                console.log("app =>", app);
                                                
                                                handleStatusChange(
                                                    app.appointmentID,
                                                    "Completed",
                                                )
                                            }}
                                        >
                                            <CheckCircle size={18} /> إنهاء
                                            الكشف
                                        </button>
                                        <button
                                            className="btn-action cancel"
                                            onClick={() =>
                                                handleStatusChange(
                                                    app.appointmentID,
                                                    "Cancelled",
                                                )
                                            }
                                        >
                                            <XCircle size={18} /> إلغاء
                                        </button>
                                    </>
                                )}

                                {app.status === "Completed" && (
                                    <span className="status-label text-success">
                                        <CheckCircle
                                            size={16}
                                            className="me-1"
                                        />{" "}
                                        مكتمل
                                    </span>
                                )}

                                {app.status === "Cancelled" && (
                                    <span className="status-label text-danger">
                                        <XCircle size={16} className="me-1" />{" "}
                                        ملغي
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DoctorAppointments;
