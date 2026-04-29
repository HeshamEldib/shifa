import React, { useState, useEffect } from "react";
import {
    X,
    Calendar,
    User,
    Stethoscope,
    FileText,
    Phone,
    AlertCircle,
} from "lucide-react";
import { getAppointmentDetailsApi } from "../../services/adminAppointmentService";
import "./AppointmentDetailDrawer.css";

function AppointmentDetailDrawer({ appointmentId, isOpen, onClose }) {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadDetails = async () => {
        setIsLoading(true);
        try {
            const data = await getAppointmentDetailsApi(appointmentId);
            setDetails(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && appointmentId) {
            loadDetails();
        }
    }, [isOpen, appointmentId]);

    if (!isOpen) return null;

    return (
        <div
            className={`drawer-overlay ${isOpen ? "open" : ""}`}
            onClick={onClose}
        >
            <div
                className="drawer-content glass-receipt"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="drawer-header">
                    <h3 className="text-white m-0">تفاصيل الحجز</h3>
                    <button className="btn-close-drawer" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="drawer-loader">
                        <span className="custom-spinner"></span>
                    </div>
                ) : (
                    details && (
                        <div className="drawer-body">
                            {/* حالة الموعد وتوقيته */}
                            <div className="appointment-status-banner mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="icon-box">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <strong className="d-block text-white">
                                            {new Date(
                                                details.appointmentDate,
                                            ).toLocaleDateString("ar-EG")}
                                        </strong>
                                        <span className="text-muted">
                                            {new Date(
                                                details.appointmentDate,
                                            ).toLocaleTimeString("ar-EG")}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`status-pill ${details.status.toLowerCase()}`}
                                >
                                    {details.status}
                                </span>
                            </div>

                            {/* كارت المريض */}
                            <h5 className="section-label">بيانات المريض</h5>
                            <div className="info-card mb-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="avatar-sm">
                                        <User size={18} />
                                    </div>
                                    <div className="text-white font-weight-bold">
                                        {details.patient.fullName}
                                    </div>
                                </div>
                                <div className="small-grid">
                                    <div className="grid-item">
                                        <Phone size={14} />{" "}
                                        {details.patient.phone}
                                    </div>
                                    <div className="grid-item text-danger">
                                        <AlertCircle size={14} /> فصيلة:{" "}
                                        {details.patient.bloodType ||
                                            "غير محدد"}
                                    </div>
                                </div>
                            </div>

                            {/* كارت الطبيب */}
                            <h5 className="section-label">الطبيب المعالج</h5>
                            <div className="info-card mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="avatar-sm doctor">
                                        <Stethoscope size={18} />
                                    </div>
                                    <div>
                                        <div className="text-white font-weight-bold">
                                            {details.doctor.fullName}
                                        </div>
                                        <div className="text-cyan small">
                                            {details.doctor.specialty}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ملاحظات الحجز */}
                            <h5 className="section-label">
                                ملاحظات المريض / سبب الزيارة
                            </h5>
                            <div className="notes-box">
                                <FileText size={16} className="text-muted" />
                                <p className="m-0">
                                    {details.notes ||
                                        "لا توجد ملاحظات إضافية من المريض."}
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AppointmentDetailDrawer;
