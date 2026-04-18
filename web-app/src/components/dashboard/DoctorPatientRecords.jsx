import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
    ClipboardList,
    History,
    Plus,
    Trash2,
    Save,
    Pill,
    Activity,
    ChevronLeft,
    HeartPulse,
} from "lucide-react";
import {
    getPatientRecordsApi,
    addMedicalRecordApi,
} from "../../services/medicalRecordService";
import { getMedicinesApi } from "../../services/medicineService";
import "./DoctorPatientRecords.css";

function DoctorPatientRecords() {
    const { patientId } = useParams();
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get("appointmentId");
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [availableMeds, setAvailableMeds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [newRecord, setNewRecord] = useState({
        patientID: patientId,
        visitDate: new Date().toISOString(),
        chiefComplaint: "",
        diagnosisDetails: "",
        treatmentPlan: "",
        vitalSignsJson: "",
        prescriptions: [
            {
                medicationID: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: "",
            },
        ],
    });
    if (appointmentId) {
        setNewRecord((prev) => ({ ...prev, AppointmentID: appointmentId }));
    }

    // حالة محلية للعلامات الحيوية قبل تحويلها لـ JSON
    const [vitals, setVitals] = useState({ bp: "", temp: "", hr: "" });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [historyData, medsData] = await Promise.all([
                    getPatientRecordsApi(patientId),
                    getMedicinesApi(),
                ]);
                setHistory(historyData);
                setAvailableMeds(medsData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [patientId]);

    const handleAddMed = () => {
        setNewRecord({
            ...newRecord,
            prescriptions: [
                ...newRecord.prescriptions,
                {
                    medicationID: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                },
            ],
        });
    };

    const handleMedChange = (index, field, value) => {
        const updated = [...newRecord.prescriptions];
        updated[index][field] = value;
        setNewRecord({ ...newRecord, prescriptions: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // تحويل العلامات الحيوية لـ JSON String قبل الإرسال
            const payload = {
                ...newRecord,
                vitalSignsJson: JSON.stringify(vitals),
            };

            console.log("gg =>", payload);

            await addMedicalRecordApi(payload);
            // alert("تم توثيق السجل الطبي بنجاح!");
            navigate("/doctor/appointments");
        } catch (err) {
            alert(err.message);
        }
    };

    // دالة مساعدة لفك تشفير العلامات الحيوية بأمان
    const parseVitals = (jsonString) => {
        try {
            return jsonString ? JSON.parse(jsonString) : null;
        } catch (e) {
            return null;
        }
    };
    console.log("history =>", newRecord.prescriptions);

    if (isLoading) return <div className="custom-spinner"></div>;

    return (
        <div className="medical-records-page fade-in-up">
            <div className="records-header">
                <button onClick={() => navigate(-1)} className="btn-back">
                    <ChevronLeft size={20} /> العودة
                </button>
                <h2 className="text-white">ملف المريض والسجل الطبي</h2>
            </div>

            <div className="records-layout">
                {/* ========================================= */}
                {/* الجانب الأيمن: نموذج الإضافة الجديد */}
                {/* ========================================= */}
                <div className="record-form-container glass-receipt">
                    <h4 className="section-title">
                        <ClipboardList className="text-cyan" /> فحص جديد
                    </h4>

                    <form onSubmit={handleSubmit}>
                        {/* قسم العلامات الحيوية (Vital Signs) */}
                        <div className="vitals-section mb-4">
                            <h5 className="sub-section-title">
                                <HeartPulse size={16} /> العلامات الحيوية
                            </h5>
                            <div className="form-row-3">
                                <div className="form-group">
                                    <label>الضغط (BP)</label>
                                    <input
                                        className="custom-input"
                                        placeholder="120/80"
                                        value={vitals.bp}
                                        onChange={(e) =>
                                            setVitals({
                                                ...vitals,
                                                bp: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>الحرارة (Temp)</label>
                                    <input
                                        className="custom-input"
                                        placeholder="37.0 °C"
                                        value={vitals.temp}
                                        onChange={(e) =>
                                            setVitals({
                                                ...vitals,
                                                temp: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>النبض (HR)</label>
                                    <input
                                        className="custom-input"
                                        placeholder="75 bpm"
                                        value={vitals.hr}
                                        onChange={(e) =>
                                            setVitals({
                                                ...vitals,
                                                hr: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label>الشكوى الرئيسية (Chief Complaint)</label>
                            <textarea
                                required
                                className="custom-input"
                                rows="2"
                                value={newRecord.chiefComplaint}
                                onChange={(e) =>
                                    setNewRecord({
                                        ...newRecord,
                                        chiefComplaint: e.target.value,
                                    })
                                }
                                placeholder="وصف المريض للأعراض..."
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label>التشخيص التفصيلي (Diagnosis)</label>
                            <input
                                required
                                className="custom-input"
                                value={newRecord.diagnosisDetails}
                                onChange={(e) =>
                                    setNewRecord({
                                        ...newRecord,
                                        diagnosisDetails: e.target.value,
                                    })
                                }
                                placeholder="التشخيص الطبي النهائي..."
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label>
                                الخطة العلاجية والملاحظات (Treatment Plan)
                            </label>
                            <textarea
                                className="custom-input"
                                rows="2"
                                value={newRecord.treatmentPlan}
                                onChange={(e) =>
                                    setNewRecord({
                                        ...newRecord,
                                        treatmentPlan: e.target.value,
                                    })
                                }
                                placeholder="الراحة، التحاليل المطلوبة، أو أي توجيهات..."
                            />
                        </div>

                        {/* قسم الروشتة (Prescriptions) */}
                        <div className="prescription-box mt-4">
                            <div className="prescription-header">
                                <h5>
                                    <Pill className="text-warning" /> الروشتة
                                    الدوائية
                                </h5>
                                <button
                                    type="button"
                                    className="btn-add-med"
                                    onClick={handleAddMed}
                                >
                                    <Plus size={16} /> إضافة دواء
                                </button>
                            </div>

                            {newRecord.prescriptions.map((p, index) => (
                                <div
                                    key={index}
                                    className="med-entry-block mb-3"
                                >
                                    <div className="med-grid-top">
                                        <select
                                            required
                                            className="custom-input"
                                            value={p.medicationID}
                                            onChange={(e) => {
                                                console.log("oo =>", p);

                                                handleMedChange(
                                                    index,
                                                    "medicationID",
                                                    e.target.value,
                                                );
                                            }}
                                        >
                                            <option value="">
                                                اختر الدواء
                                            </option>
                                            {availableMeds.map((m) => (
                                                <option
                                                    key={m.medicationID}
                                                    value={m.medicationID}
                                                >
                                                    {m.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn-del-med"
                                            onClick={() =>
                                                setNewRecord({
                                                    ...newRecord,
                                                    prescriptions:
                                                        newRecord.prescriptions.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        ),
                                                })
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="med-grid-bottom mt-2">
                                        <input
                                            placeholder="الجرعة (مثال: 500mg)"
                                            className="custom-input"
                                            value={p.dosage}
                                            onChange={(e) =>
                                                handleMedChange(
                                                    index,
                                                    "dosage",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <input
                                            placeholder="التكرار (مثال: كل 8 ساعات)"
                                            className="custom-input"
                                            value={p.frequency}
                                            onChange={(e) =>
                                                handleMedChange(
                                                    index,
                                                    "frequency",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <input
                                            placeholder="المدة (مثال: 5 أيام)"
                                            className="custom-input"
                                            value={p.duration}
                                            onChange={(e) =>
                                                handleMedChange(
                                                    index,
                                                    "duration",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="mt-2">
                                        <input
                                            placeholder="تعليمات إضافية (مثال: بعد الأكل)..."
                                            className="custom-input full-width"
                                            value={p.instructions}
                                            onChange={(e) =>
                                                handleMedChange(
                                                    index,
                                                    "instructions",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn-save-record mt-4">
                            <Save size={20} /> حفظ وإرسال السجل
                        </button>
                    </form>
                </div>

                {/* ========================================= */}
                {/* الجانب الأيسر: التاريخ المرضي (مفصل وواضح) */}
                {/* ========================================= */}
                <div className="history-container glass-receipt">
                    <h4 className="section-title">
                        <History className="text-purple" /> السجلات الطبية
                        السابقة
                    </h4>

                    <div className="timeline-wrapper">
                        {history.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                لا يوجد سجلات سابقة للمريض
                            </div>
                        ) : (
                            history.map((record) => {
                                const parsedVitals = parseVitals(
                                    record.vitalSignsJson,
                                );
                                const date = new Date(record.visitDate + "Z");

                                // 1. التاريخ بصيغة YYYY/MM/DD بتوقيت مصر
                                const formattedDate = date
                                    .toLocaleDateString("en-CA", {
                                        timeZone: "Africa/Cairo",
                                    })
                                    .replace(/-/g, "/");

                                // 2. الوقت بتوقيت مصر بنظام 12 ساعة وأرقام قياسية
                                const formattedTime = date.toLocaleTimeString(
                                    "ar-EG",
                                    {
                                        timeZone: "Africa/Cairo",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                        numberingSystem: "latn", // لمنع ظهور الأرقام الهندية (٨:٥٩)
                                    },
                                );

                                return (
                                    <div
                                        key={record.recordID}
                                        className="detailed-history-card mb-4"
                                    >
                                        <div className="history-card-header">
                                            <div>
                                                <span className="doctor-name">
                                                    الطبيب المعالج:{" "}
                                                    {record.doctorName ||
                                                        "طبيب غير معروف"}
                                                </span>
                                                <span className="record-date">
                                                    {formattedTime} -{" "}
                                                    {formattedDate}
                                                </span>
                                            </div>
                                            <span className="badge-completed">
                                                مكتمل
                                            </span>
                                        </div>

                                        <div className="history-card-body">
                                            {/* العلامات الحيوية إن وجدت */}
                                            {parsedVitals &&
                                                (parsedVitals.bp ||
                                                    parsedVitals.temp ||
                                                    parsedVitals.hr) && (
                                                    <div className="history-vitals mb-3">
                                                        {parsedVitals.bp && (
                                                            <span className="vital-badge">
                                                                الضغط:{" "}
                                                                {
                                                                    parsedVitals.bp
                                                                }
                                                            </span>
                                                        )}
                                                        {parsedVitals.temp && (
                                                            <span className="vital-badge">
                                                                الحرارة:{" "}
                                                                {
                                                                    parsedVitals.temp
                                                                }
                                                            </span>
                                                        )}
                                                        {parsedVitals.hr && (
                                                            <span className="vital-badge">
                                                                النبض:{" "}
                                                                {
                                                                    parsedVitals.hr
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                            {/* التفاصيل الطبية مع Labels واضحة */}
                                            <div className="data-row">
                                                <span className="data-label">
                                                    الشكوى:
                                                </span>
                                                <p className="data-value">
                                                    {record.chiefComplaint ||
                                                        "غير مسجل"}
                                                </p>
                                            </div>

                                            <div className="data-row">
                                                <span className="data-label">
                                                    التشخيص:
                                                </span>
                                                <p className="data-value text-cyan font-weight-bold">
                                                    {record.diagnosisDetails ||
                                                        "غير مسجل"}
                                                </p>
                                            </div>

                                            <div className="data-row">
                                                <span className="data-label">
                                                    الخطة:
                                                </span>
                                                <p className="data-value text-muted">
                                                    {record.treatmentPlan ||
                                                        "غير مسجل"}
                                                </p>
                                            </div>

                                            {/* الروشتة في شكل جدول مصغر */}
                                            {record.prescriptions &&
                                                record.prescriptions.length >
                                                    0 && (
                                                    <div className="history-prescriptions mt-3">
                                                        <strong className="d-block mb-2 text-warning">
                                                            <Pill
                                                                size={14}
                                                                className="me-1"
                                                            />{" "}
                                                            الأدوية المصروفة:
                                                        </strong>
                                                        <div className="meds-table-mini">
                                                            {record.prescriptions.map(
                                                                (med, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="med-row-mini"
                                                                    >
                                                                        <span className="m-name">
                                                                            {med.medicationName ||
                                                                                "دواء غير معروف"}
                                                                        </span>
                                                                        <span className="m-dose">
                                                                            {
                                                                                med.dosage
                                                                            }{" "}
                                                                            |{" "}
                                                                            {
                                                                                med.frequency
                                                                            }{" "}
                                                                            |{" "}
                                                                            {
                                                                                med.duration
                                                                            }
                                                                        </span>
                                                                        {med.instructions && (
                                                                            <span className="m-inst">
                                                                                (
                                                                                {
                                                                                    med.instructions
                                                                                }

                                                                                )
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorPatientRecords;
