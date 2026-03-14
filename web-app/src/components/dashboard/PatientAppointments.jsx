// src/components/PatientAppointments.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./appointments.css";
import { useTranslation } from "react-i18next";

// ========= MOCK DATA FOR NOW (NO API YET) =========
// جاهز للتجربة بدون باك، ولما الـ API يجهز هنستبدل الجزء ده بالـ fetch
const MOCK_APPOINTMENTS = [
  {
    id: 1,
    doctor: "Dr. Ahmed Samir",
    specialty: "cardiology",
    type: "follow_up",
    datetime: "Sun, 8 Feb 2026 • 10:30 AM",
    location: "online_video",
    status: "upcoming",
    phase: "treatment",
  },
  {
    id: 2,
    doctor: "Dr. Sara Ali",
    specialty: "dermatology",
    type: "new_consult",
    datetime: "Tue, 10 Feb 2026 • 4:00 PM",
    location: "online_video",
    status: "upcoming",
    phase: "diagnosis",
  },
  {
    id: 3,
    doctor: "Dr. Omar Nabil",
    specialty: "endocrinology",
    type: "result_review",
    datetime: "Past • 21 Jan 2026 • 1:00 PM",
    location: "building_c_12",
    status: "past",
    phase: "followup",
  },
];

const MOCK_TIMELINE = [
  {
    id: "t1",
    date: "21 Jan 2026",
    label: "visit_with_omar",
    type: "visit",
  },
  {
    id: "t2",
    date: "18 Jan 2026",
    label: "blood_test_hba1c_lipid",
    type: "lab",
  },
  {
    id: "t3",
    date: "10 Jan 2026",
    label: "online_consult_ahmed",
    type: "visit",
  },
];

function PatientAppointments({ onBack }) {
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("upcoming");
  const [selectedId, setSelectedId] = useState(null);

  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUploadResult, setShowUploadResult] = useState(false);
  const [showSymptoms, setShowSymptoms] = useState(false);

  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [testFileName, setTestFileName] = useState("");
  const [symptomsText, setSymptomsText] = useState("");

  // ========= DEMO MODE (NO REAL API YET) =========
  // لما الباك يجهز، نقدر نستبدل هذا الـ useEffect بنسخة fetch الحقيقية
  useEffect(() => {
    setError("");
    setAppointments(MOCK_APPOINTMENTS);
    setTimeline(MOCK_TIMELINE);
    setSelectedId(MOCK_APPOINTMENTS[0]?.id ?? null);
    setLoading(false);
  }, []);

  const filtered = useMemo(
    () => appointments.filter((a) => a.status === selectedFilter),
    [appointments, selectedFilter]
  );

  const selected = useMemo(() => {
    if (!appointments.length) return null;
    const byId = appointments.find((a) => a.id === selectedId);
    if (byId) return byId;
    if (filtered.length > 0) return filtered[0];
    return appointments[0];
  }, [appointments, filtered, selectedId]);

  const counts = useMemo(() => {
    const up = appointments.filter((a) => a.status === "upcoming").length;
    const past = appointments.filter((a) => a.status === "past").length;
    return { up, past };
  }, [appointments]);

  const closeAllForms = () => {
    setShowFollowUp(false);
    setShowReschedule(false);
    setShowCancelConfirm(false);
    setShowUploadResult(false);
    setShowSymptoms(false);
  };

  const openFollowUp = () => {
    closeAllForms();
    setShowFollowUp(true);
  };

  const openReschedule = () => {
    closeAllForms();
    setShowReschedule(true);
  };

  const openCancel = () => {
    closeAllForms();
    setShowCancelConfirm(true);
  };

  const openUploadResult = () => {
    closeAllForms();
    setShowUploadResult(true);
  };

  const openSymptoms = () => {
    closeAllForms();
    setShowSymptoms(true);
  };

  // تحت: نفس دوال الـ API اللي الباك هيستخدمها بعدين
  const handleConfirm = async () => {
    if (!selected) return;
    try {
      await fetch(`/api/patient/appointments/${selected.id}/confirm`, {
        method: "POST",
      });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selected.id ? { ...a, status: "upcoming" } : a
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !followUpDate || !followUpTime) return;

    try {
      await fetch(`/api/patient/appointments/${selected.id}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: followUpDate, time: followUpTime }),
      });
      setFollowUpDate("");
      setFollowUpTime("");
      setShowFollowUp(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !rescheduleDate || !rescheduleTime) return;

    try {
      await fetch(`/api/patient/appointments/${selected.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime }),
      });
      setRescheduleDate("");
      setRescheduleTime("");
      setShowReschedule(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!selected) return;

    try {
      await fetch(`/api/patient/appointments/${selected.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason || null }),
      });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selected.id ? { ...a, status: "cancelled" } : a
        )
      );
      setCancelReason("");
      setShowCancelConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadResultSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !testFileName) return;

    try {
      await fetch(
        `/api/patient/appointments/${selected.id}/upload-test-result`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: testFileName }),
        }
      );
      setTestFileName("");
      setShowUploadResult(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSymptomsSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !symptomsText.trim()) return;

    try {
      await fetch(`/api/patient/appointments/${selected.id}/symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: symptomsText }),
      });
      setSymptomsText("");
      setShowSymptoms(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCalendar = async () => {
    if (!selected) return;
    try {
      await fetch(`/api/patient/appointments/${selected.id}/add-to-calendar`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="ap-shell">
        <header className="ap-header">
          <button className="ap-back" onClick={onBack}>
            ← {t("patientAppointments.back")}
          </button>
          <div className="ap-header-text">
            <h2 className="ap-title">{t("patientAppointments.title")}</h2>
          </div>
        </header>
        <div className="ap-loading">
          {t("patientAppointments.loading")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ap-shell">
        <header className="ap-header">
          <button className="ap-back" onClick={onBack}>
            ← {t("patientAppointments.back")}
          </button>
          <div className="ap-header-text">
            <h2 className="ap-title">{t("patientAppointments.title")}</h2>
          </div>
        </header>
        <div className="ap-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="ap-shell">
      <header className="ap-header">
        <button className="ap-back" onClick={onBack}>
          ← {t("patientAppointments.back")}
        </button>

        <div className="ap-header-text">
          <h2 className="ap-title">{t("patientAppointments.title")}</h2>
          <p className="ap-sub">
            {t("patientAppointments.subtitle", {
              upcoming: counts.up,
              past: counts.past,
            })}
          </p>
        </div>
      </header>

      <section className="ap-main">
        {/* القائمة */}
        <aside className="ap-inbox">
          <div className="ap-inbox-top">
            <h3>{t("patientAppointments.health_inbox")}</h3>
            <div className="ap-filters">
              <button
                className={
                  selectedFilter === "upcoming"
                    ? "ap-chip is-active"
                    : "ap-chip"
                }
                onClick={() => {
                  setSelectedFilter("upcoming");
                  closeAllForms();
                }}
              >
                {t("patientAppointments.filter_upcoming")}
              </button>
              <button
                className={
                  selectedFilter === "past"
                    ? "ap-chip is-active"
                    : "ap-chip"
                }
                onClick={() => {
                  setSelectedFilter("past");
                  closeAllForms();
                }}
              >
                {t("patientAppointments.filter_past")}
              </button>
            </div>
          </div>

          <div className="ap-list">
            {filtered.map((a) => (
              <button
                key={a.id}
                className={
                  selected && a.id === selected.id
                    ? "ap-card is-active"
                    : "ap-card"
                }
                onClick={() => {
                  setSelectedId(a.id);
                  closeAllForms();
                }}
                title={t("patientAppointments.view_details", {
                  type: t(`patientAppointments.type_${a.type}`),
                })}
              >
                <div className="ap-card-row">
                  <div>
                    <div className="ap-doctor">{a.doctor}</div>
                    <div className="ap-spec">
                      {t(
                        `patientAppointments.specialty_${a.specialty}`
                      )}
                    </div>
                  </div>
                  <span className="ap-pill">
                    {t(
                      `patientAppointments.status_${a.status}`
                    )}
                  </span>
                </div>
                <div className="ap-type">
                  {t(`patientAppointments.type_${a.type}`)}
                </div>
                <div className="ap-time">{a.datetime}</div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="ap-empty">
                {t("patientAppointments.no_appointments", {
                  status:
                    selectedFilter === "upcoming"
                      ? t(
                          "patientAppointments.filter_upcoming"
                        ).toLowerCase()
                      : t(
                          "patientAppointments.filter_past"
                        ).toLowerCase(),
                })}
              </div>
            )}
          </div>
        </aside>

        {/* التفاصيل + Before your visit */}
        <div className="ap-detail">
          {selected && (
            <div className="ap-detail-card">
              <div className="ap-kicker">
                {t("patientAppointments.next_step")}
              </div>
              <div className="ap-detail-title">
                {t(`patientAppointments.type_${selected.type}`)}
              </div>
              <div className="ap-detail-meta">
                {selected.doctor} ·{" "}
                {t(
                  `patientAppointments.specialty_${selected.specialty}`
                )}
              </div>
              <div className="ap-detail-meta">
                {selected.datetime}
              </div>
              <div className="ap-detail-meta">
                {t(
                  `patientAppointments.location_${selected.location}`,
                  { defaultValue: selected.location }
                )}
              </div>

              <div className="ap-tags">
                <span className="ap-tag">
                  {t(
                    `patientAppointments.phase_${selected.phase}`
                  )}
                </span>
              </div>

              <div className="ap-actions">
                <button
                  className="ap-btn ap-btn-secondary"
                  title={t(
                    "patientAppointments.book_followup_title"
                  )}
                  onClick={openFollowUp}
                >
                  {t(
                    "patientAppointments.btn_treatment_followup"
                  )}
                </button>

                <button
                  className="ap-btn ap-btn-primary"
                  title={t("patientAppointments.confirm_title")}
                  onClick={handleConfirm}
                >
                  {t("patientAppointments.btn_confirm")}
                </button>
                <button
                  className="ap-btn ap-btn-secondary"
                  title={t("patientAppointments.reschedule_title")}
                  onClick={openReschedule}
                >
                  {t("patientAppointments.btn_reschedule")}
                </button>
                <button
                  className="ap-btn ap-btn-ghost"
                  title={t("patientAppointments.cancel_title")}
                  onClick={openCancel}
                >
                  {t("patientAppointments.btn_cancel")}
                </button>
              </div>
            </div>
          )}

          <div className="ap-quick">
            <div className="ap-quick-title">
              {t("patientAppointments.before_visit")}
            </div>
            <div className="ap-quick-grid">
              <button
                className="ap-quick-chip"
                title={t("patientAppointments.upload_title")}
                onClick={openUploadResult}
              >
                {t(
                  "patientAppointments.upload_test_result"
                )}
              </button>

              <button
                className="ap-quick-chip"
                title={t("patientAppointments.symptoms_title")}
                onClick={openSymptoms}
              >
                {t("patientAppointments.share_symptoms")}
              </button>
              <button
                className="ap-quick-chip"
                title={t("patientAppointments.calendar_title")}
                onClick={handleAddToCalendar}
              >
                {t("patientAppointments.add_to_calendar")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* الفورمات */}
      <div className="ap-forms-row">
        {showFollowUp && (
          <div className="ap-formCard">
            <h4>{t("patientAppointments.followup_title")}</h4>
            <p>
              {t("patientAppointments.followup_desc", {
                doctor: selected?.doctor || "",
              })}
            </p>
            <form onSubmit={handleFollowUpSubmit}>
              <div className="ap-formGrid">
                <div className="ap-field">
                  <label>{t("patientAppointments.date")}</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) =>
                      setFollowUpDate(e.target.value)
                    }
                  />
                </div>
                <div className="ap-field">
                  <label>{t("patientAppointments.time")}</label>
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={(e) =>
                      setFollowUpTime(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-btn ap-btn-ghost"
                  onClick={() => {
                    setShowFollowUp(false);
                    setFollowUpDate("");
                    setFollowUpTime("");
                  }}
                >
                  {t("patientAppointments.close")}
                </button>
                <button
                  type="submit"
                  className="ap-btn ap-btn-primary"
                >
                  {t(
                    "patientAppointments.book_followup_btn"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {showReschedule && (
          <div className="ap-formCard">
            <h4>
              {t(
                "patientAppointments.reschedule_main_title"
              )}
            </h4>
            <p>
              {t("patientAppointments.reschedule_desc", {
                doctor: selected?.doctor || "",
              })}
            </p>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="ap-formGrid">
                <div className="ap-field">
                  <label>
                    {t("patientAppointments.new_date")}
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) =>
                      setRescheduleDate(e.target.value)
                    }
                  />
                </div>
                <div className="ap-field">
                  <label>
                    {t("patientAppointments.new_time")}
                  </label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) =>
                      setRescheduleTime(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-btn ap-btn-ghost"
                  onClick={() => {
                    setShowReschedule(false);
                    setRescheduleDate("");
                    setRescheduleTime("");
                  }}
                >
                  {t("patientAppointments.close")}
                </button>
                <button
                  type="submit"
                  className="ap-btn ap-btn-primary"
                >
                  {t(
                    "patientAppointments.save_new_time"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {showCancelConfirm && (
          <div className="ap-formCard">
            <h4>
              {t(
                "patientAppointments.cancel_main_title"
              )}
            </h4>
            <p>
              {t("patientAppointments.cancel_desc", {
                doctor: selected?.doctor || "",
              })}
            </p>
            <form onSubmit={handleConfirmCancel}>
              <div
                className="ap-field"
                style={{ marginTop: 8 }}
              >
                <label>
                  {t(
                    "patientAppointments.reason_optional"
                  )}
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) =>
                    setCancelReason(e.target.value)
                  }
                  placeholder={t(
                    "patientAppointments.reason_placeholder"
                  )}
                />
              </div>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-btn ap-btn-ghost"
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelReason("");
                  }}
                >
                  {t(
                    "patientAppointments.keep_appointment"
                  )}
                </button>
                <button
                  type="submit"
                  className="ap-btn ap-btn-primary"
                >
                  {t(
                    "patientAppointments.cancel_appointment"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {showUploadResult && (
          <div className="ap-formCard">
            <h4>
              {t(
                "patientAppointments.upload_main_title"
              )}
            </h4>
            <form onSubmit={handleUploadResultSubmit}>
              <div className="ap-field">
                <label>
                  {t(
                    "patientAppointments.file_name_label"
                  )}
                </label>
                <input
                  type="text"
                  value={testFileName}
                  onChange={(e) =>
                    setTestFileName(e.target.value)
                  }
                  placeholder={t(
                    "patientAppointments.file_name_placeholder"
                  )}
                />
              </div>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-btn ap-btn-ghost"
                  onClick={() => {
                    setShowUploadResult(false);
                    setTestFileName("");
                  }}
                >
                  {t("patientAppointments.close")}
                </button>
                <button
                  type="submit"
                  className="ap-btn ap-btn-primary"
                >
                  {t("patientAppointments.submit")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showSymptoms && (
          <div className="ap-formCard">
            <h4>
              {t(
                "patientAppointments.symptoms_main_title"
              )}
            </h4>
            <form onSubmit={handleSymptomsSubmit}>
              <div className="ap-field">
                <label>
                  {t("patientAppointments.symptoms_label")}
                </label>
                <textarea
                  rows={3}
                  value={symptomsText}
                  onChange={(e) =>
                    setSymptomsText(e.target.value)
                  }
                  placeholder={t(
                    "patientAppointments.symptoms_placeholder"
                  )}
                />
              </div>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-btn ap-btn-ghost"
                  onClick={() => {
                    setShowSymptoms(false);
                    setSymptomsText("");
                  }}
                >
                  {t("patientAppointments.close")}
                </button>
                <button
                  type="submit"
                  className="ap-btn ap-btn-primary"
                >
                  {t("patientAppointments.share")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* النشاط الصحي الأخير */}
      <section className="ap-timeline">
        <h3 className="ap-timeline-title">
          {t("patientAppointments.timeline_title")}
        </h3>
        <div className="ap-timeline-row">
          {timeline.map((item) => (
            <div key={item.id} className="ap-t-item">
              <div
                className={`ap-dot ap-dot-${item.type.toLowerCase()}`}
              />
              <div className="ap-t-date">{item.date}</div>
              <div className="ap-t-label">
                {t(
                  `patientAppointments.timeline_label_${item.label}`
                )}
              </div>
              <div className="ap-t-type">
                {t(
                  `patientAppointments.timeline_type_${item.type.toLowerCase()}`
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PatientAppointments;
