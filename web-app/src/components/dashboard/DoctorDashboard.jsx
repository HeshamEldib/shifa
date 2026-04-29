// src/components/dashboard/DoctorDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./doctor.css";

const doctorStats = {
  patients: 32,
  appointments: 5,
  activeCalls: 4,
  upcomingName: "Mona Ali",
};

function DoctorDashboard({
  onLogout,
  onOpenPrescription,
  onOpenSilent,
  onOpenSettings,
  onOpenAppointments,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-EG";
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem("role", "Doctor");
  }, []);

  const doctor = {
    name: "Dr. Sara Ahmed",
    specialty: t("doctor.specialty_derm"),
  };

  const focusPatient = "Mona Ali";
  const avgWaiting = "6 min";

  const todaySchedule = useMemo(
    () => [
    {
      id: 1,
      time: "10:00",
      name: "Sara Mohamed",
      info: t(
        "doctor.schedule_row1_info",
        "متابعة استشارة عن بُعد · مكالمة فيديو"
      ),
      kind: "normal",
    },
    {
      id: 2,
      time: "11:00",
      name: "Omar Ali",
      info: t(
        "doctor.schedule_row2_info",
        "استشارة جديدة عن بُعد · مكالمة صوتية"
      ),
      kind: "normal",
    },
    {
      id: 3,
      time: "12:30",
      name: t("doctor.schedule_row3_name", "حالة طارئة"),
      info: t(
        "doctor.schedule_row3_info",
        "حالة طارئة عن بُعد – صداع حاد"
      ),
      kind: "emergency",
    },
  ],[t]);

  const patientQueue = useMemo(
    () => [
    { id: 1, name: "Omar Hassan", wait: "12 min", level: "High" },
    { id: 2, name: "Laila Samir", wait: "5 min", level: "Medium" },
    { id: 3, name: "Hana Youssef", wait: "2 min", level: "Low" },
  ], []);

  const recentUpdates = useMemo(
    () => [
      t("doctor.recent_1"),
      t("doctor.recent_2"),
      t("doctor.recent_3"),
    ],
    [t]
  );

  const filteredSchedule = useMemo(() => {
    if (!searchTerm) return todaySchedule;
    const q = searchTerm.toLowerCase();
    return todaySchedule.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [todaySchedule, searchTerm]);

  const filteredQueue = useMemo(() => {
    if (!searchTerm) return patientQueue;
    const q = searchTerm.toLowerCase();
    return patientQueue.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
  }, [patientQueue, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="dd-app" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <aside className="dd-sidebar">
        <div className="dd-sidebar-icons-top">
          <button
            type="button"
            className="dd-icon-pill"
            title={t("doctor.search", "بحث")}
            onClick={() => setShowHeaderSearch((v) => !v)}
          >
            🔍
          </button>

          <button
            type="button"
            className="dd-icon-pill"
            onClick={onOpenSettings}
            title={t("doctor.settings", "الإعدادات")}
          >
            ⚙️
          </button>

          <button
            type="button"
            className="dd-icon-pill"
            onClick={() => navigate("/doctor/profile")}
            title={t("doctor.account", "حساب الطبيب")}
          >
            👤
          </button>
        </div>

        <div className="dd-sidebar-icons-bottom">
          <button
            type="button"
            className="dd-icon-pill"
            onClick={() => setShowLogoutConfirm(true)}
            title={t("doctor.logout", "تسجيل الخروج")}
          >
            ↩
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dd-main">
        <div className="dd-main-inner">
          {/* Header + search bar */}
          <section className="dd-header-inline">
            <div>
              <div className="dd-brand-hello">
                {t("doctor.hello", { name: doctor.name })}
              </div>
              <div className="dd-brand-sub">
                {t(
                  "doctor.subtitle_waiting",
                  "جلساتك عن بُعد اليوم ومرضاك في الانتظار"
                )}
              </div>
            </div>

            {showHeaderSearch && (
              <form
                className="dd-header-search"
                onSubmit={handleSearchSubmit}
              >
                <input
                  className="dd-search"
                  placeholder={t("doctor.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </form>
            )}
          </section>

          {/* KPI row */}
          <section className="dd-kpi-row">
            <article className="dd-kpi-card">
              <div className="dd-kpi-label">
                {t("doctor.kpi_patients_label")}
              </div>
              <div className="dd-kpi-value">{doctorStats.patients}</div>
              <div className="dd-kpi-hint">
                {t("doctor.kpi_patients_hint")}
              </div>
            </article>

            <article className="dd-kpi-card">
              <div className="dd-kpi-label">
                {t("doctor.kpi_appointments_label")}
              </div>
              <div className="dd-kpi-value">
                {doctorStats.appointments}
              </div>
              <div className="dd-kpi-hint">
                {t("doctor.kpi_appointments_hint")}
              </div>
            </article>

            <article className="dd-kpi-card">
              <div className="dd-kpi-label">
                {t("doctor.kpi_calls_label")}
              </div>
              <div className="dd-kpi-value">
                {doctorStats.activeCalls}
              </div>
              <div className="dd-kpi-hint">
                {t("doctor.kpi_calls_hint")}
              </div>
            </article>

            <article className="dd-kpi-card dd-kpi-upcoming">
              <div className="dd-kpi-label">
                {t("doctor.kpi_upcoming_label")}
              </div>
              <div className="dd-kpi-next">
                {doctorStats.upcomingName}
              </div>
            </article>
          </section>

          {/* Focus patient */}
          <section className="dd-focus">
            <div className="dd-focus-left">
              <div className="dd-focus-kicker">
                {t("doctor.focus_kicker")}
              </div>
              <div className="dd-focus-name">{focusPatient}</div>
              <div className="dd-focus-reason">
                {t(
                  "doctor.focus_reason",
                  "متابعة استشارة عن بُعد، سيتم التواصل بالفيديو أو الصوت فقط"
                )}
              </div>
              <div className="dd-focus-status dd-focus-stable">
                {t("doctor.focus_status")}
              </div>
            </div>
            <div className="dd-focus-right">
              <button
                className="dd-focus-btn-secondary"
                type="button"
                onClick={onOpenSilent}
              >
                {t("doctor.focus_silent")}
              </button>
            </div>
          </section>

          {/* Quick actions */}
          <section className="dd-quick-row">
            <button
              className="dd-quick-btn"
              type="button"
              onClick={onOpenPrescription}
            >
              {t("doctor.quick_write_rx")}
            </button>
            <button
              className="dd-quick-btn"
              type="button"
              onClick={onOpenAppointments}
            >
              {t("doctor.quick_view_records")}
            </button>
          </section>

          {/* Schedule + Queue */}
          <section className="dd-lower-grid">
            <article className="dd-panel">
              <header className="dd-panel-header">
                <h3>{t("doctor.schedule_title")}</h3>
                <span className="dd-panel-count">
                  {t("doctor.schedule_meta", {
                    count: filteredSchedule.length,
                  })}
                </span>
              </header>
              <div className="dd-schedule-list">
                {filteredSchedule.map((item) => (
                  <div
                    key={item.id}
                    className={
                      item.kind === "emergency"
                        ? "dd-schedule-row dd-schedule-emergency"
                        : "dd-schedule-row"
                    }
                  >
                    <span className="dd-schedule-time">{item.time}</span>
                    <div className="dd-schedule-main">
                      <div className="dd-schedule-name">
                        {item.name}
                      </div>
                      <div className="dd-schedule-meta">
                        {item.info}
                      </div>
                    </div>
                    {item.kind === "emergency" ? (
                      <span className="dd-queue-badge dd-queue-high">
                        {t("doctor.queue_high")}
                      </span>
                    ) : (
                      <button
                        className="dd-timeline-btn"
                        type="button"
                        onClick={onOpenAppointments}
                      >
                        {t("doctor.schedule_open")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="dd-panel dd-panel-insights">
              <header className="dd-panel-header">
                <h3>{t("doctor.queue_title")}</h3>
                <span className="dd-panel-count">
                  {t("doctor.queue_meta", {
                    count: filteredQueue.length,
                    avg: avgWaiting,
                  })}
                </span>
              </header>

              <div className="dd-queue-list">
                {filteredQueue.map((p) => (
                  <div key={p.id} className="dd-queue-row">
                    <div className="dd-queue-main">
                      <div
                        className={
                          p.name === focusPatient
                            ? "dd-queue-name is-focus"
                            : "dd-queue-name"
                        }
                      >
                        {p.name}
                      </div>
                      <div className="dd-queue-meta">
                        {t("doctor.queue_wait", { value: p.wait })}
                      </div>
                    </div>
                    <span
                      className={
                        p.level === "High"
                          ? "dd-queue-badge dd-queue-high"
                          : p.level === "Medium"
                          ? "dd-queue-badge dd-queue-medium"
                          : "dd-queue-badge dd-queue-low"
                      }
                    >
                      {t(
                        p.level === "High"
                          ? "doctor.queue_high"
                          : p.level === "Medium"
                          ? "doctor.queue_medium"
                          : "doctor.queue_low"
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <header
                className="dd-panel-header"
                style={{ marginTop: 10 }}
              >
                <h3>{t("doctor.recent_title")}</h3>
              </header>
              <ul className="dd-insights-list">
                {recentUpdates.map((txt, i) => (
                  <li key={i}>{txt}</li>
                ))}
              </ul>
            </article>
          </section>
        </div>
      </main>

      {/* Logout modal */}
      {showLogoutConfirm && (
        <div className="dd-modal-backdrop">
          <div className="dd-modal">
            <div className="dd-modal-title">
              {t(
                "doctor.logout_confirm_title",
                "تأكيد تسجيل الخروج"
              )}
            </div>
            <div className="dd-modal-text">
              {t(
                "doctor.logout_confirm_text",
                "هل أنت متأكد أنك تريد تسجيل الخروج من حساب الطبيب؟"
              )}
            </div>
            <div className="dd-modal-actions">
              <button
                type="button"
                className="dd-btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                {t("common.cancel", "إلغاء")}
              </button>
              <button
                type="button"
                className="dd-btn-danger"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout && onLogout();
                }}
              >
                {t("doctor.logout", "تسجيل الخروج")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
