import React, { useState, useEffect } from "react";
import { Save, Clock, Power, Plus, Trash2, Moon } from "lucide-react";
import {
    getMyAvailability,
    getPrayerSettingsApi,
    updatePrayerSettingsApi,
    updateWorkingHoursApi,
} from "../../services/doctorAvailabilityService";
import "./DoctorProfile.css";

const defaultSchedule = [
    { dayOfWeek: 6, label: "السبت", isActive: false, shifts: [] },
    { dayOfWeek: 0, label: "الأحد", isActive: false, shifts: [] },
    { dayOfWeek: 1, label: "الإثنين", isActive: false, shifts: [] },
    { dayOfWeek: 2, label: "الثلاثاء", isActive: false, shifts: [] },
    { dayOfWeek: 3, label: "الأربعاء", isActive: false, shifts: [] },
    { dayOfWeek: 4, label: "الخميس", isActive: false, shifts: [] },
    { dayOfWeek: 5, label: "الجمعة", isActive: false, shifts: [] },
];

// دالة مساعدة لضمان استخراج الوقت بصيغة HH:mm بأمان
const formatTimeSafe = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return timeStr;
};

// دالة لتجهيز الوقت للسيرفر بصيغة HH:mm:ss لمنع أخطاء الـ TimeSpan في C#
const formatForBackend = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
};

function DoctorWorkingTime() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState(null);

    const [prayerConfig, setPrayerConfig] = useState({
        blockPrayerTimes: true,
        defaultMinutesBefore: 15,
        defaultMinutesAfter: 15,
        jumuahMinutesBefore: 30,
        jumuahMinutesAfter: 30,
    });

    const [schedule, setSchedule] = useState(defaultSchedule);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                // 1. جلب إعدادات الصلاة (في try-catch منفصل كي لا تعطل جلب المواعيد إذا فشلت)
                try {
                    const apiPrayer = await getPrayerSettingsApi();
                    if (apiPrayer) setPrayerConfig(apiPrayer);
                } catch (prayerError) {
                    console.warn("إعدادات الصلاة غير متوفرة بعد.", prayerError);
                }

                // 2. جلب المواعيد
                const apiAvailability = await getMyAvailability();

                if (apiAvailability && apiAvailability.length > 0) {
                    const grouped = defaultSchedule.map((d) => {
                        const dayShifts = apiAvailability.filter(
                            (item) => item.dayOfWeek === d.dayOfWeek
                        );
                        return {
                            ...d,
                            isActive: dayShifts.length > 0 && dayShifts.some((s) => s.isActive),
                            shifts: dayShifts.map((s) => ({
                                availabilityID: s.availabilityID,
                                startTime: formatTimeSafe(s.startTime),
                                endTime: formatTimeSafe(s.endTime),
                                isActive: s.isActive,
                            })),
                        };
                    });
                    setSchedule(grouped);
                }
            } catch (error) {
                console.error("خطأ في جلب المواعيد:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // ================== دوال التحكم في الفترات ==================
    const toggleDayActive = (index) => {
        const updated = [...schedule];
        updated[index].isActive = !updated[index].isActive;
        
        // إضافة فترة افتراضية عند تفعيل اليوم لأول مرة
        if (updated[index].isActive && updated[index].shifts.length === 0) {
            updated[index].shifts.push({
                startTime: "09:00",
                endTime: "13:00",
                isActive: true,
            });
        }
        setSchedule(updated);
    };

    const handleShiftChange = (dayIndex, shiftIndex, field, value) => {
        const updated = [...schedule];
        updated[dayIndex].shifts[shiftIndex][field] = value;
        setSchedule(updated);
    };

    const addShift = (dayIndex) => {
        const updated = [...schedule];
        updated[dayIndex].shifts.push({
            startTime: "",
            endTime: "",
            isActive: true,
        });
        setSchedule(updated);
    };

    const removeShift = (dayIndex, shiftIndex) => {
        const updated = [...schedule];
        updated[dayIndex].shifts.splice(shiftIndex, 1);
        if (updated[dayIndex].shifts.length === 0) {
            updated[dayIndex].isActive = false;
        }
        setSchedule(updated);
    };

    // ================== دالة الحفظ ==================
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const payload = [];
            
            // تجهيز البيانات
            schedule.forEach((day) => {
                if (day.isActive) {
                    day.shifts.forEach((shift) => {
                        if (shift.startTime && shift.endTime) {
                            payload.push({
                                availabilityID: shift.availabilityID || null, // تجنب undefined
                                dayOfWeek: day.dayOfWeek,
                                startTime: formatForBackend(shift.startTime), // ضمان وجود الثواني
                                endTime: formatForBackend(shift.endTime),
                                isActive: shift.isActive ?? true,
                            });
                        }
                    });
                }
            });

            // إرسال المواعيد
            await updateWorkingHoursApi(payload);

            // إرسال إعدادات الصلاة (محمية لتجنب إيقاف رسالة النجاح إذا فشلت)
            try {
                await updatePrayerSettingsApi(prayerConfig);
            } catch (err) {
                console.warn("تعذر حفظ إعدادات الصلاة", err);
            }

            setSaveMessage({ type: "success", text: "تم تحديث مواعيد العمل بنجاح!" });
            setTimeout(() => setSaveMessage(null), 3000);
            
        } catch (error) {
            setSaveMessage({
                type: "error",
                text: error.message || "حدث خطأ أثناء حفظ المواعيد. يرجى التأكد من عدم تداخل الأوقات.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="custom-spinner mx-auto mt-5"></div>;

    return (
        <form onSubmit={handleScheduleSubmit} className="schedule-form-container fade-in">
            {saveMessage && (
                <div className={`custom-alert ${saveMessage.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
                    {saveMessage.text}
                </div>
            )}

            {/* قسم إعدادات الصلاة */}
            <div className="glass-receipt p-4 mb-4" style={{ borderColor: prayerConfig.blockPrayerTimes ? "#06b6d4" : "rgba(255,255,255,0.05)" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h4 className="text-white m-0 d-flex align-items-center gap-2">
                            <Moon className="text-cyan" size={20} /> استثناء أوقات الصلاة
                        </h4>
                        <p className="text-muted mt-1 mb-0 small">
                            إيقاف الحجوزات تلقائياً وقت الأذان (حسب التوقيت المحلي).
                        </p>
                    </div>
                    <label className="switch-toggle">
                        <input
                            type="checkbox"
                            checked={prayerConfig.blockPrayerTimes}
                            onChange={(e) => setPrayerConfig({ ...prayerConfig, blockPrayerTimes: e.target.checked })}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                {prayerConfig.blockPrayerTimes && (
                    <div className="prayer-settings-grid fade-in mt-4">
                        <div className="form-group">
                            <label>إيقاف قبل الصلاة (دقائق)</label>
                            <input type="number" min="0" className="custom-input" value={prayerConfig.defaultMinutesBefore} onChange={(e) => setPrayerConfig({ ...prayerConfig, defaultMinutesBefore: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>إيقاف بعد الصلاة (دقائق)</label>
                            <input type="number" min="0" className="custom-input" value={prayerConfig.defaultMinutesAfter} onChange={(e) => setPrayerConfig({ ...prayerConfig, defaultMinutesAfter: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label className="text-warning">قبل الجمعة (دقائق)</label>
                            <input type="number" min="0" className="custom-input" value={prayerConfig.jumuahMinutesBefore} onChange={(e) => setPrayerConfig({ ...prayerConfig, jumuahMinutesBefore: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label className="text-warning">بعد الجمعة (دقائق)</label>
                            <input type="number" min="0" className="custom-input" value={prayerConfig.jumuahMinutesAfter} onChange={(e) => setPrayerConfig({ ...prayerConfig, jumuahMinutesAfter: Number(e.target.value) })} />
                        </div>
                    </div>
                )}
            </div>

            {/* قسم مواعيد العمل */}
            <div className="glass-receipt p-4">
                <div className="section-header mb-4">
                    <h3 className="text-white m-0 d-flex align-items-center gap-2">
                        <Clock className="text-cyan" /> جدول المواعيد الأسبوعي
                    </h3>
                    <p className="text-muted mt-2 mb-0">
                        قم بتفعيل أيام العمل وأضف فترات الدوام (يمكنك إضافة أكثر من فترة في اليوم الواحد).
                    </p>
                </div>

                <div className="working-hours-list">
                    {schedule.map((day, dayIndex) => (
                        <div key={day.dayOfWeek} className={`working-day-card ${!day.isActive ? "is-day-off" : ""}`}>
                            <div className="day-header-row">
                                <div className="d-flex align-items-center gap-3">
                                    <button
                                        type="button"
                                        className={`btn-toggle-day ${day.isActive ? "on" : "off"}`}
                                        onClick={() => toggleDayActive(dayIndex)}
                                        title={day.isActive ? "تعيين كإجازة" : "تفعيل اليوم"}
                                    >
                                        <Power size={20} />
                                        <span className="day-label">{day.label}</span>
                                    </button>
                                </div>

                                {day.isActive && (
                                    <button type="button" className="btn-add-shift" onClick={() => addShift(dayIndex)}>
                                        <Plus size={14} /> إضافة فترة
                                    </button>
                                )}
                            </div>

                            {day.isActive ? (
                                <div className="shifts-container mt-3">
                                    {day.shifts.map((shift, shiftIndex) => (
                                        <div key={shiftIndex} className="shift-row fade-in">
                                            <div className="time-input-group">
                                                <label>من</label>
                                                <input
                                                    type="time"
                                                    required
                                                    className="custom-input time-picker cursor-text"
                                                    value={shift.startTime}
                                                    onChange={(e) => handleShiftChange(dayIndex, shiftIndex, "startTime", e.target.value)}
                                                />
                                            </div>
                                            <div className="time-input-group">
                                                <label>إلى</label>
                                                <input
                                                    type="time"
                                                    required
                                                    className="custom-input time-picker"
                                                    value={shift.endTime}
                                                    onChange={(e) => handleShiftChange(dayIndex, shiftIndex, "endTime", e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-remove-shift"
                                                onClick={() => removeShift(dayIndex, shiftIndex)}
                                                title="حذف الفترة"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-2 text-danger small font-weight-bold opacity-75">
                                    يوم إجازة (لا توجد مواعيد متاحة)
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="profile-actions glass-receipt mt-4 text-left">
                <button type="submit" className="btn-primary-action" disabled={isSaving}>
                    {isSaving ? <span className="custom-spinner-sm"></span> : <Save size={20} />}
                    حفظ التعديلات
                </button>
            </div>
        </form>
    );
}

export default DoctorWorkingTime;