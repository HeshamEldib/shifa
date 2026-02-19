import React from "react";
import"./doctor.css"

const doctorStats = {
  patients: 32,
  appointments: 5,
  activeCalls: 4,
  upcomingName: "Mona Ali",
};

const todaySchedule = [
  { id: 1, time: "10:00", name: "Sara Mohamed", info: "Follow-up · Room 3 · In clinic", kind: "normal" },
  { id: 2, time: "11:00", name: "Omar Ali", info: "New case · Room 1 · Online", kind: "normal" },
  { id: 3, time: "12:30", name: "Emergency slot", info: "Walk-in · Chest pain", kind: "emergency" },
];

const patientQueue = [
  { id: 1, name: "Omar Hassan", wait: "12 min", level: "High" },
  { id: 2, name: "Laila Samir", wait: "5 min", level: "Medium" },
  { id: 3, name: "Hana Youssef", wait: "2 min", level: "Low" },
];

const recentUpdates = [
  "New lab report added for Mona Ali.",
  "Prescription updated for Omar Hassan.",
  "Ahmed Khaled discharged from follow-up.",
];

function DoctorDashboard({
  onLogout,
  onOpenPrescription,
  onOpenSilent,
  onOpenSettings,
  onOpenAppointments,
}) {
  const doctor = {
    name: "Dr. Sara Ahmed",
    specialty: "Dermatology",
  };

  const focusPatient = "Mona Ali";
  const avgWaiting = "6 min";

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
      {/* مفيش سايدبار هنا */}

      <main className="dd-main">
        <header className="dd-header">
          <div className="dd-brand">
            <span className="dd-brand-icon">+</span>
            <div className="dd-brand-text">
              <div className="dd-brand-hello">Good morning, {doctor.name}</div>
              <div className="dd-brand-sub">
                You have 6 patients waiting today ·{" "}
                <span className="dd-status-pill dd-status-on">On duty</span>
              </div>
            </div>
          </div>

          <div className="dd-header-right">
            <div className="dd-notifs">
              <span className="dd-badge dd-badge-critical">Emergency</span>
              <span className="dd-badge">New message</span>
              <span className="dd-badge">New lab result</span>
            </div>

            <input
              className="dd-search"
              placeholder="Search patients or appointments..."
            />

            <div className="dd-header-userbox">
              <div className="dd-header-user-avatar">{initials}</div>
              <div className="dd-header-user-meta">
                <div className="dd-header-user-name">{doctor.name}</div>
                <div className="dd-header-user-role">{doctor.specialty}</div>
              </div>
              <button
                type="button"
                className="dd-header-user-btn"
                onClick={onOpenSettings}
              >
                Settings
              </button>
              <button
                type="button"
                className="dd-header-user-btn dd-header-user-logout"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* KPI cards */}
        <section className="dd-kpi-row">
          <article className="dd-kpi-card">
            <div className="dd-kpi-label">Patients</div>
            <div className="dd-kpi-value">{doctorStats.patients}</div>
            <div className="dd-kpi-hint">Total registered</div>
          </article>

          <article className="dd-kpi-card">
            <div className="dd-kpi-label">Appointments</div>
            <div className="dd-kpi-value">{doctorStats.appointments}</div>
            <div className="dd-kpi-hint">Today</div>
          </article>

          <article className="dd-kpi-card">
            <div className="dd-kpi-label">Active calls</div>
            <div className="dd-kpi-value">{doctorStats.activeCalls}</div>
            <div className="dd-kpi-hint">Now</div>
          </article>

          <article className="dd-kpi-card dd-kpi-upcoming">
            <div className="dd-kpi-label">Upcoming appointment</div>
            <div className="dd-kpi-next">{doctorStats.upcomingName}</div>
            
          </article>
        </section>

        {/* Now in focus */}
        <section className="dd-focus">
          <div className="dd-focus-left">
            <div className="dd-focus-kicker">Now in focus · 15 min session</div>
            <div className="dd-focus-name">{focusPatient}</div>
            <div className="dd-focus-reason">Follow-up after lab results</div>
            <div className="dd-focus-status dd-focus-stable">
              Status: Stable
            </div>
          </div>
          <div className="dd-focus-right">
            
            <button
              className="dd-focus-btn-secondary"
              type="button"
              onClick={onOpenSilent}
            >
              Silent diagnosis
            </button>
          </div>
        </section>

        <section className="dd-quick-row">
          <button
            className="dd-quick-btn"
            type="button"
            onClick={onOpenPrescription}
          >
            Write prescription
          </button>
          <button
            className="dd-quick-btn"
            type="button"
            onClick={onOpenAppointments}
          >
            View patient records
          </button>
        </section>

        <section className="dd-lower-grid">
          <article className="dd-panel">
            <header className="dd-panel-header">
              <h3>Today’s schedule</h3>
              <span className="dd-panel-count">
                Thursday · 12 Feb 2026 · {todaySchedule.length} appointments
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
                    <div className="dd-schedule-meta">{item.info}</div>
                  </div>
                  {item.kind === "emergency" ? (
                    <span className="dd-queue-badge dd-queue-high">High</span>
                  ) : (
                    <button
                      className="dd-timeline-btn"
                      type="button"
                      onClick={onOpenAppointments}
                    >
                      Open
                    </button>
                  )}
                </div>
              ))}
            </div>
          </article>

          <article className="dd-panel dd-panel-insights">
            <header className="dd-panel-header">
              <h3>Patient queue</h3>
              <span className="dd-panel-count">
                {patientQueue.length} waiting · Avg {avgWaiting}
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
                    <div className="dd-queue-meta">Waiting {p.wait}</div>
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
                    {p.level}
                  </span>
                </div>
              ))}
            </div>

            <header className="dd-panel-header" style={{ marginTop: 10 }}>
              <h3>Recent updates</h3>
            </header>
            <ul className="dd-insights-list">
              {recentUpdates.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <div className="dd-recent-report">
              <div className="dd-report-title">Smart assistant</div>
              <p>
                Reminder: Patient Ahmed is allergic to Penicillin. Check previous
                notes before prescribing.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default DoctorDashboard;
