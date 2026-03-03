// src/components/dashboard/DoctorDashboard.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  // تثبيت أن الدور الحالي = Doctor
  useEffect(() => {
    localStorage.setItem("role", "Doctor");
  }, []);

  const doctor = {
    name: "Dr. Sara Ahmed",
    specialty: t("doctor.specialty_derm"),
  };

  const focusPatient = "Mona Ali";
  const avgWaiting = "6 min";

  const todaySchedule = [
    {
      id: 1,
      time: "10:00",
      name: "Sara Mohamed",
      info: t("doctor.schedule_row1_info"),
      kind: "normal",
    },
    {
      id: 2,
      time: "11:00",
      name: "Omar Ali",
      info: t("doctor.schedule_row2_info"),
      kind: "normal",
    },
    {
      id: 3,
      time: "12:30",
      name: t("doctor.schedule_row3_name"),
      info: t("doctor.schedule_row3_info"),
      kind: "emergency",
    },
  ];

  const patientQueue = [
    { id: 1, name: "Omar Hassan", wait: "12 min", level: "High" },
    { id: 2, name: "Laila Samir", wait: "5 min", level: "Medium" },
    { id: 3, name: "Hana Youssef", wait: "2 min", level: "Low" },
  ];

  const recentUpdates = [
    t("doctor.recent_1"),
    t("doctor.recent_2"),
    t("doctor.recent_3"),
  ];

  const initials = doctor.name
    .replace("Dr.", "")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dd-shell">
      <main className="dd-main">
        <header className="dd-header">
          <div className="dd-brand">
            <span className="dd-brand-icon">+</span>
            <div className="dd-brand-text">
              <div className="dd-brand-hello">
                {t("doctor.hello", { name: doctor.name })}
              </div>
              <div className="dd-brand-sub">
                {t("doctor.subtitle_waiting")}
                <span className="dd-status-pill dd-status-on">
                  {t("doctor.status_on_duty")}
                </span>
              </div>
            </div>
          </div>

          <div className="dd-header-right">
            <div className="dd-notifs">
              <span className="dd-badge dd-badge-critical">
                {t("doctor.badge_emergency")}
              </span>
              <span className="dd-badge">
                {t("doctor.badge_new_message")}
              </span>
              <span className="dd-badge">
                {t("doctor.badge_new_lab")}
              </span>
            </div>

            <input
              className="dd-search"
              placeholder={t("doctor.search_placeholder")}
            />

            <div className="dd-header-userbox">
              <div className="dd-header-user-avatar">{initials}</div>
              <div className="dd-header-user-meta">
                <div className="dd-header-user-name">{doctor.name}</div>
                <div className="dd-header-user-role">
                  {doctor.specialty}
                </div>
              </div>
              <button
                type="button"
                className="dd-header-user-btn"
                onClick={onOpenSettings}
              >
                {t("doctor.settings")}
              </button>
              <button
                type="button"
                className="dd-header-user-btn dd-header-user-logout"
                onClick={onLogout}
              >
                {t("doctor.logout")}
              </button>
            </div>
          </div>
        </header>

        <section className="dd-kpi-row">
          <article className="dd-kpi-card">
            <div className="dd-kpi-label">
              {t("doctor.kpi_patients_label")}
            </div>
            <div className="dd-kpi-value">
              {doctorStats.patients}
            </div>
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

        <section className="dd-focus">
          <div className="dd-focus-left">
            <div className="dd-focus-kicker">
              {t("doctor.focus_kicker")}
            </div>
            <div className="dd-focus-name">{focusPatient}</div>
            <div className="dd-focus-reason">
              {t("doctor.focus_reason")}
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

        <section className="dd-lower-grid">
          <article className="dd-panel">
            <header className="dd-panel-header">
              <h3>{t("doctor.schedule_title")}</h3>
              <span className="dd-panel-count">
                {t("doctor.schedule_meta", {
                  count: todaySchedule.length,
                })}
              </span>
            </header>
            <div className="dd-schedule-list">
              {todaySchedule.map((item) => (
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
                    <div className="dd-schedule-name">{item.name}</div>
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
                  count: patientQueue.length,
                  avg: avgWaiting,
                })}
              </span>
            </header>

            <div className="dd-queue-list">
              {patientQueue.map((p) => (
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

            <header className="dd-panel-header" style={{ marginTop: 10 }}>
              <h3>{t("doctor.recent_title")}</h3>
            </header>
            <ul className="dd-insights-list">
              {recentUpdates.map((txt, i) => (
                <li key={i}>{txt}</li>
              ))}
            </ul>

            <div className="dd-recent-report">
              <div className="dd-report-title">
                {t("doctor.assistant_title")}
              </div>
              <p>{t("doctor.assistant_note")}</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default DoctorDashboard;
