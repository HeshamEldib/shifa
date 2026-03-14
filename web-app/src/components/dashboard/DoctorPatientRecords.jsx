// src/components/dashboard/DoctorPatientRecords.jsx
import React from "react";
import "./DoctorPatientRecords.css";
import { useTranslation } from "react-i18next";

function DoctorPatientRecords({ onOpenPrescription, patientOverview }) {
  const { t } = useTranslation();

  const data =
    patientOverview || {
      patient: {
        id: "2026-01",
        name: "Rana Ali",
        age: 32,
        gender: "female",
        condition: "type2_diabetes",
        lastVisit: "21 Jan 2026",
        assignedDoctor: "Dr. Sara Ahmed",
      },
      upcoming: [
        {
          id: 1,
          type: "follow_up",
          doctorName: "Dr. Ahmed Samir",
          specialty: "cardiology",
          date: "Sun, 8 Feb 2026",
          time: "10:30 AM",
          location: "Building A - Clinic 203",
        },
        {
          id: 2,
          type: "new_consult",
          doctorName: "Dr. Sara Ali",
          specialty: "dermatology",
          date: "Tue, 10 Feb 2026",
          time: "4:00 PM",
          location: "Online video",
        },
      ],
      recentActivity: [
        {
          id: 1,
          date: "21 Jan 2026",
          type: "visit",
          label: "visit_with_omar",
        },
        {
          id: 2,
          date: "18 Jan 2026",
          type: "lab",
          label: "blood_test_hba1c_lipid",
        },
        {
          id: 3,
          date: "10 Jan 2026",
          type: "visit",
          label: "online_consult_ahmed",
        },
      ],
      meds: [
        { id: 1, name: "metformin_500", note: "metformin_note" },
        { id: 2, name: "atorvastatin_20", note: "atorvastatin_note" },
      ],
      allergies: ["Penicillin"],
      notesLines: [
        "note_monitor_hba1c",
        "note_lifestyle",
        "note_bp_followup",
      ],
    };

  const { patient, upcoming, recentActivity, meds, allergies, notesLines } =
    data;

  const initials = patient.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="pr-shell">
      <header className="pr-topbar">
        <div>
          <h1 className="pr-title">
            {t("doctorPatientRecords.title")}
          </h1>
          <p className="pr-subtitle">
            {t("doctorPatientRecords.subtitle")}
          </p>
        </div>
      </header>

      <section className="pr-patient-card">
        <div className="pr-patient-main">
          <div className="pr-avatar-circle">{initials}</div>
          <div>
            <div className="pr-patient-name">{patient.name}</div>

            <div className="pr-patient-grid">
              <span>
                {t(`doctorPatientRecords.gender_${patient.gender}`)}
              </span>
              <span>
                {patient.age}
                {t("doctorPatientRecords.years_suffix")}
              </span>
              <span>
                {t("doctorPatientRecords.patient_id")} {patient.id}
              </span>
            </div>

            <div className="pr-patient-condition">
              {t("doctorPatientRecords.primary_condition")}{" "}
              <span>
                {t(
                  `doctorPatientRecords.condition_${patient.condition}`
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="pr-patient-summary">
          <div>
            <div className="pr-muted">
              {t("doctorPatientRecords.last_visit")}
            </div>
            <div className="pr-summary-main">{patient.lastVisit}</div>
          </div>
          <div>
            <div className="pr-muted">
              {t("doctorPatientRecords.assigned_doctor")}
            </div>
            <div className="pr-summary-main">
              {patient.assignedDoctor}
            </div>
          </div>
        </div>
      </section>

      <main className="pr-layout">
        <section className="pr-column">
          <article className="pr-card">
            <header className="pr-card-header">
              <h2>{t("doctorPatientRecords.appointments_activity")}</h2>
              <span className="pr-tag">
                {t("doctorPatientRecords.upcoming_count", {
                  count: upcoming.length,
                })}{" "}
                ·{" "}
                {t("doctorPatientRecords.past_count", {
                  count: recentActivity.length,
                })}
              </span>
            </header>

            <div className="pr-block">
              <div className="pr-block-title">
                {t("doctorPatientRecords.upcoming")}
              </div>
              {upcoming.map((a, index) => (
                <div key={a.id} className="pr-appointment-row">
                  <div className="pr-appointment-main">
                    <div className="pr-appointment-type">
                      {t(
                        `doctorPatientRecords.appointment_type_${a.type}`
                      )}
                    </div>

                    <div className="pr-appointment-doctor-block">
                      <span className="pr-appointment-doctor-name">
                        {a.doctorName}
                      </span>
                      <span className="pr-appointment-doctor-specialty">
                        {t(
                          `doctorPatientRecords.specialty_${a.specialty}`
                        )}
                      </span>
                    </div>

                    <div className="pr-appointment-datetime">
                      <span className="pr-appointment-date">
                        {a.date}
                      </span>
                      <span className="pr-appointment-time">
                        {a.time}
                      </span>
                    </div>

                    <div className="pr-appointment-location">
                      {t(
                        `doctorPatientRecords.location_${a.location
                          .replace(/\s+/g, "_")
                          .toLowerCase()}`,
                        a.location
                      )}
                    </div>
                  </div>

                  {index !== upcoming.length - 1 && (
                    <div className="pr-divider" />
                  )}
                </div>
              ))}
            </div>

            <div className="pr-block">
              <div className="pr-block-title">
                {t("doctorPatientRecords.recent_activity")}
              </div>
              <ul className="pr-activity-list">
                {recentActivity.map((item) => (
                  <li key={item.id} className="pr-activity-row">
                    <div className="pr-activity-date-line">
                      {item.date}
                    </div>
                    <div>
                      <span className="pr-activity-type">
                        {t(
                          `doctorPatientRecords.activity_type_${item.type}`
                        )}
                      </span>
                      <span className="pr-activity-label">
                        {t(
                          `doctorPatientRecords.activity_label_${item.label}`
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section className="pr-column">
          <article className="pr-card">
            <header className="pr-card-header">
              <h2>{t("doctorPatientRecords.current_treatment")}</h2>
            </header>

            <ul className="pr-med-list">
              {meds.map((m, index) => (
                <li key={m.id} className="pr-med-item">
                  <div className="pr-med-name">
                    {t(
                      `doctorPatientRecords.med_${m.name}`
                    )}
                  </div>
                  <div className="pr-med-note">
                    {t(
                      `doctorPatientRecords.med_note_${m.note}`
                    )}
                  </div>
                  {index !== meds.length - 1 && (
                    <div className="pr-divider" />
                  )}
                </li>
              ))}
            </ul>

            <div className="pr-block">
              <div className="pr-block-title">
                {t("doctorPatientRecords.allergies")}
              </div>
              {allergies.length ? (
                <ul className="pr-allergy-list">
                  {allergies.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="pr-muted">
                  {t("doctorPatientRecords.no_allergies")}
                </p>
              )}
            </div>

            <div className="pr-block">
              <div className="pr-block-title">
                {t("doctorPatientRecords.doctor_notes")}
              </div>
              <ul className="pr-notes-list">
                {notesLines.map((line, i) => (
                  <li key={i}>
                    {t(`doctorPatientRecords.${line}`)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="pr-card">
            <header className="pr-card-header">
              <h2>{t("doctorPatientRecords.actions")}</h2>
            </header>
            <p className="pr-muted">
              {t("doctorPatientRecords.actions_description")}
            </p>
            <div className="pr-actions">
              <button
                type="button"
                className="pr-btn-primary"
                onClick={onOpenPrescription}
              >
                {t("doctorPatientRecords.write_prescription")}
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default DoctorPatientRecords;
