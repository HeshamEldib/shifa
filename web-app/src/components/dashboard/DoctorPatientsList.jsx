import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Search,
    Phone,
    Calendar,
    Activity,
    FileText,
    User,
} from "lucide-react";
import { getDoctorPatientsApi } from "../../services/doctorPatientService";
import "./DoctorPatientsList.css";

function DoctorPatientsList() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getDoctorPatientsApi();
                setPatients(data);
            } catch (error) {
                console.error("فشل جلب قائمة المرضى", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // دالة البحث التفاعلية
    const filteredPatients = patients.filter(
        (p) =>
            p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.phone.includes(searchQuery),
    );

    if (isLoading) {
        return (
            <div className="overview-loading">
                <div className="custom-spinner"></div>
                <p>جاري تحميل سجلات المرضى...</p>
            </div>
        );
    }

    return (
        <div className="doctor-patients-page fade-in-up">
            <div className="page-header-flex">
                <div>
                    <h2 className="header-title-p">
                        <Users className="text-cyan me-2" size={28} /> قائمة
                        مرضاي
                    </h2>
                    <p className="description-p">
                        ابحث في سجل مرضاك وقم بمراجعة ملفاتهم الطبية.
                    </p>
                </div>
            </div>

            {/* شريط البحث المتقدم */}
            <div className="patients-toolbar glass-receipt">
                <div className="search-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="ابحث باسم المريض أو رقم الهاتف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="patient-search-input"
                    />
                </div>
                <div className="patients-stats">
                    <span className="stat-badge">
                        <Users size={16} /> إجمالي المرضى:{" "}
                        <strong>{patients.length}</strong>
                    </span>
                </div>
            </div>

            {/* شبكة كروت المرضى */}
            <div className="patients-grid">
                {filteredPatients.length === 0 ? (
                    <div
                        className="empty-state text-center glass-receipt"
                        style={{ gridColumn: "1 / -1" }}
                    >
                        <User
                            size={48}
                            className="text-muted mb-3"
                            opacity="0.4"
                        />
                        <h5 className="text-white">
                            لا يوجد مرضى مطابقين للبحث
                        </h5>
                        <p className="text-muted">
                            تأكد من كتابة الاسم أو رقم الهاتف بشكل صحيح.
                        </p>
                    </div>
                ) : (
                    filteredPatients.map((patient) => (
                        <div
                            key={patient.patientID}
                            className="patient-card glass-receipt"
                        >
                            <div className="patient-card-header">
                                <div className="patient-avatar">
                                    {patient.fullName.charAt(0)}
                                </div>
                                <div className="patient-title-info">
                                    <h4 className="patient-name">
                                        {patient.fullName}
                                    </h4>
                                    <span className="patient-demographics">
                                        {patient.gender === "Female"
                                            ? "أنثى"
                                            : "ذكر"}{" "}
                                        • {patient.age} سنة
                                    </span>
                                </div>
                            </div>

                            <div className="patient-card-body">
                                <div className="info-row">
                                    <Phone size={16} className="text-muted" />
                                    <span>{patient.phone}</span>
                                </div>
                                <div className="info-row">
                                    <Calendar size={16} className="text-cyan" />
                                    <span>
                                        آخر زيارة:{" "}
                                        {new Date(
                                            patient.lastVisit,
                                        ).toLocaleDateString("ar-EG")}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <Activity
                                        size={16}
                                        className="text-warning"
                                    />
                                    <span>
                                        إجمالي الزيارات: {patient.totalVisits}{" "}
                                        زيارات
                                    </span>
                                </div>
                            </div>

                            <div className="patient-card-footer">
                                {/* هذا الزر يوجه الطبيب لشاشة (DoctorPatientRecords) التي برمجناها سابقاً */}
                                <button
                                    className="btn-medical-record"
                                    onClick={() =>
                                        navigate(
                                            `/doctor/records/${patient.patientID}`,
                                        )
                                    }
                                >
                                    <FileText size={18} /> عرض السجل الطبي
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DoctorPatientsList;
