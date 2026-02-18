import React from "react";
import "./DoctorPatientRecords.css";

function DoctorPatientRecords({ onBack, onOpenPrescription }) {
  const patient = {
    id: "2026-01",
    name: "Rana Ali",
    age: 32,
    gender: "Female",
    condition: "Type 2 Diabetes",
    lastVisit: "21 Jan 2026",
    assignedDoctor: "Dr. Sara Ahmed",
  };

  const upcoming = [
    {
      id: 1,
      type: "Follow-up visit",
      doctorName: "Dr. Ahmed Samir",
      specialty: "Cardiology",
      date: "Sun, 8 Feb 2026",
      time: "10:30 AM",
      location: "Building A - Clinic 203",
    },
    {
      id: 2,
      type: "New consultation",
      doctorName: "Dr. Sara Ali",
      specialty: "Dermatology",
      date: "Tue, 10 Feb 2026",
      time: "4:00 PM",
      location: "Online video",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      date: "21 Jan 2026",
      type: "Visit",
      label: "Visit with Dr. Omar (Endocrinology)",
    },
    {
      id: 2,
      date: "18 Jan 2026",
      type: "Lab",
      label: "Blood test (HbA1c, Lipid profile)",
    },
    {
      id: 3,
      date: "10 Jan 2026",
      type: "Visit",
      label: "Online consultation with Dr. Ahmed",
    },
  ];

  const meds = [
    { id: 1, name: "Metformin 500 mg", note: "Twice daily with meals" },
    { id: 2, name: "Atorvastatin 20 mg", note: "Once at night" },
  ];

  const allergies = ["Penicillin"];

  const notesLines = [
    "Monitor HbA1c every 3 months.",
    "Reinforce lifestyle changes.",
    "Follow up on blood pressure control.",
  ];

  const initials = patient.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="pr-shell">
      <header className="pr-topbar">
        <button type="button" className="pr-back" onClick={onBack}>
          ← Back to dashboard
        </button>
        <div>
          <h1 className="pr-title">Patient overview</h1>
          <p className="pr-subtitle">
            Key clinical details, upcoming care, and current treatment plan.
          </p>
        </div>
      </header>

      {/* بطاقة المريض */}
      <section className="pr-patient-card">
        <div className="pr-patient-main">
          <div className="pr-avatar-circle">{initials}</div>
          <div>
            <div className="pr-patient-name">{patient.name}</div>

            {/* Grid داخلي للجنس / السن / ID */}
            <div className="pr-patient-grid">
              <span>{patient.gender}</span>
              <span>{patient.age}y</span>
              <span>ID {patient.id}</span>
            </div>

            <div className="pr-patient-condition">
              Primary condition: <span>{patient.condition}</span>
            </div>
          </div>
        </div>

        <div className="pr-patient-summary">
          <div>
            <div className="pr-muted">Last visit</div>
            <div className="pr-summary-main">{patient.lastVisit}</div>
          </div>
          <div>
            <div className="pr-muted">Assigned doctor</div>
            <div className="pr-summary-main">{patient.assignedDoctor}</div>
          </div>
        </div>
      </section>

      <main className="pr-layout">
        {/* عمود المواعيد والنشاط */}
        <section className="pr-column">
          <article className="pr-card">
            <header className="pr-card-header">
              <h2>Appointments & activity</h2>
              <span className="pr-tag">
                Upcoming {upcoming.length} · Past {recentActivity.length}
              </span>
            </header>

            {/* Upcoming block */}
            <div className="pr-block">
              <div className="pr-block-title">Upcoming</div>
              {upcoming.map((a, index) => (
                <div key={a.id} className="pr-appointment-row">
                  <div className="pr-appointment-main">
                    <div className="pr-appointment-type">{a.type}</div>

                    {/* الدكتور سطرين */}
                    <div className="pr-appointment-doctor-block">
                      <span className="pr-appointment-doctor-name">
                        {a.doctorName}
                      </span>
                      <span className="pr-appointment-doctor-specialty">
                        {a.specialty}
                      </span>
                    </div>

                    {/* التاريخ فوق، الوقت تحت */}
                    <div className="pr-appointment-datetime">
                      <span className="pr-appointment-date">{a.date}</span>
                      <span className="pr-appointment-time">{a.time}</span>
                    </div>

                    <div className="pr-appointment-location">
                      {a.location}
                    </div>
                  </div>

                  {/* divider خفيف بين الكروت */}
                  {index !== upcoming.length - 1 && (
                    <div className="pr-divider" />
                  )}
                </div>
              ))}
            </div>

            {/* Recent health activity block */}
            <div className="pr-block">
              <div className="pr-block-title">Recent health activity</div>
              <ul className="pr-activity-list">
                {recentActivity.map((item) => (
                  <li key={item.id} className="pr-activity-row">
                    <div className="pr-activity-date-line">
                      {item.date}
                    </div>
                    <div>
                      <span className="pr-activity-type">{item.type}</span>
                      <span className="pr-activity-label">{item.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        {/* عمود العلاج والملاحظات */}
        <section className="pr-column">
          <article className="pr-card">
            <header className="pr-card-header">
              <h2>Current treatment</h2>
            </header>

            {/* أدوية بنظام Blocks + Divider */}
            <ul className="pr-med-list">
              {meds.map((m, index) => (
                <li key={m.id} className="pr-med-item">
                  <div className="pr-med-name">{m.name}</div>
                  <div className="pr-med-note">{m.note}</div>
                  {index !== meds.length - 1 && (
                    <div className="pr-divider" />
                  )}
                </li>
              ))}
            </ul>

            <div className="pr-block">
              <div className="pr-block-title">Allergies</div>
              {allergies.length ? (
                <ul className="pr-allergy-list">
                  {allergies.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="pr-muted">No known allergies recorded.</p>
              )}
            </div>

            <div className="pr-block">
              <div className="pr-block-title">Doctor notes</div>
              <ul className="pr-notes-list">
                {notesLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="pr-card">
            <header className="pr-card-header">
              <h2>Actions</h2>
            </header>
            <p className="pr-muted">
              Start a new prescription or open the smart assistant for this
              patient.
            </p>
            <div className="pr-actions">
              <button
                type="button"
                className="pr-btn-primary"
                onClick={onOpenPrescription}
              >
                Write prescription
              </button>
              
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default DoctorPatientRecords;
