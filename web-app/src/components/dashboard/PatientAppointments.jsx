// src/components/PatientAppointments.jsx
import React, { useMemo, useState } from "react";
import "./appointments.css";

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    doctor: "Dr. Ahmed Samir",
    specialty: "Cardiology",
    type: "Follow-up visit",
    datetime: "Sun, 8 Feb 2026 • 10:30 AM",
    location: "Building A - Clinic 203",
    status: "Upcoming",
    phase: "Treatment",
  },
  {
    id: 2,
    doctor: "Dr. Sara Ali",
    specialty: "Dermatology",
    type: "New consultation",
    datetime: "Tue, 10 Feb 2026 • 4:00 PM",
    location: "Online video",
    status: "Upcoming",
    phase: "Diagnosis",
  },
  {
    id: 3,
    doctor: "Dr. Omar Nabil",
    specialty: "Endocrinology",
    type: "Result review",
    datetime: "Past • 21 Jan 2026 • 1:00 PM",
    location: "Building C - Clinic 12",
    status: "Past",
    phase: "Follow‑up",
  },
];

const MOCK_TIMELINE = [
  {
    id: "t1",
    date: "21 Jan 2026",
    label: "Visit with Dr. Omar (Endocrinology)",
    type: "Visit",
  },
  {
    id: "t2",
    date: "18 Jan 2026",
    label: "Blood test (HbA1c, Lipid profile)",
    type: "Lab",
  },
  {
    id: "t3",
    date: "10 Jan 2026",
    label: "Online consultation with Dr. Ahmed",
    type: "Visit",
  },
];

function PatientAppointments({ onBack }) {
  const [selectedFilter, setSelectedFilter] = useState("Upcoming");
  const [selectedId, setSelectedId] = useState(1);

  // أي فورم مفتوح؟
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUploadResult, setShowUploadResult] = useState(false);
  const [showSymptoms, setShowSymptoms] = useState(false);

  // حقول الفورمات
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [testFileName, setTestFileName] = useState("");
  const [symptomsText, setSymptomsText] = useState("");

  const appointments = useMemo(() => MOCK_APPOINTMENTS, []);
  const timeline = useMemo(() => MOCK_TIMELINE, []);

  const filtered = useMemo(
    () => appointments.filter((a) => a.status === selectedFilter),
    [appointments, selectedFilter]
  );

  const selected = useMemo(() => {
    const byId = appointments.find((a) => a.id === selectedId);
    if (byId) return byId;
    return filtered[0] || appointments[0];
  }, [appointments, filtered, selectedId]);

  const counts = useMemo(() => {
    const up = appointments.filter((a) => a.status === "Upcoming").length;
    const past = appointments.filter((a) => a.status === "Past").length;
    return { up, past };
  }, [appointments]);

  function toast(msg) {
    alert(msg);
  }

  // helpers لفتح فورم واحد
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

  /* ===== Handlers رئيسية ===== */

  const handleConfirm = () => {
    if (!selected) return;
    toast(`Appointment with ${selected.doctor} confirmed`);
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (!followUpDate || !followUpTime) {
      toast("Please choose date and time for follow‑up");
      return;
    }
    toast(
      `Follow‑up booked on ${followUpDate} at ${followUpTime} with ${selected?.doctor}`
    );
    setFollowUpDate("");
    setFollowUpTime("");
    setShowFollowUp(false);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      toast("Please choose new date and time");
      return;
    }
    toast(
      `Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime} with ${selected?.doctor}`
    );
    setRescheduleDate("");
    setRescheduleTime("");
    setShowReschedule(false);
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    toast(
      `Appointment with ${selected?.doctor} cancelled${
        cancelReason ? ` (reason: ${cancelReason})` : ""
      }`
    );
    setCancelReason("");
    setShowCancelConfirm(false);
  };

  const handleUploadResultSubmit = (e) => {
    e.preventDefault();
    if (!testFileName) {
      toast("Please enter file name (demo)");
      return;
    }
    toast(
      `Test result "${testFileName}" submitted for appointment with ${
        selected?.doctor || ""
      }`
    );
    setTestFileName("");
    setShowUploadResult(false);
  };

  const handleSymptomsSubmit = (e) => {
    e.preventDefault();
    if (!symptomsText.trim()) {
      toast("Please describe your symptoms");
      return;
    }
    toast(
      `Symptoms shared for appointment with ${
        selected?.doctor || ""
      }: ${symptomsText.slice(0, 60)}...`
    );
    setSymptomsText("");
    setShowSymptoms(false);
  };

  const handleAddToCalendar = () => {
    if (!selected) return;
    toast(
      `Appointment added to calendar: ${selected.type} on ${selected.datetime}`
    );
  };

  return (
    <div className="ap-shell">
      <header className="ap-header">
        <button className="ap-back" onClick={onBack}>
          ← Back
        </button>

        <div className="ap-header-text">
          <h2 className="ap-title">My appointments</h2>
          <p className="ap-sub">
            Upcoming {counts.up} · Past {counts.past} · Manage your visits in
            one place.
          </p>
        </div>
      </header>

      <section className="ap-main">
        {/* القائمة على الشمال */}
        <aside className="ap-inbox">
          <div className="ap-inbox-top">
            <h3>Health inbox</h3>
            <div className="ap-filters">
              <button
                className={
                  selectedFilter === "Upcoming" ? "ap-chip is-active" : "ap-chip"
                }
                onClick={() => {
                  setSelectedFilter("Upcoming");
                  closeAllForms();
                }}
              >
                Upcoming
              </button>
              <button
                className={
                  selectedFilter === "Past" ? "ap-chip is-active" : "ap-chip"
                }
                onClick={() => {
                  setSelectedFilter("Past");
                  closeAllForms();
                }}
              >
                Past
              </button>
            </div>
          </div>

          <div className="ap-list">
            {filtered.map((a) => (
              <button
                key={a.id}
                className={a.id === selected?.id ? "ap-card is-active" : "ap-card"}
                onClick={() => {
                  setSelectedId(a.id);
                  closeAllForms();
                }}
                title={`View details for ${a.type}`}
              >
                <div className="ap-card-row">
                  <div>
                    <div className="ap-doctor">{a.doctor}</div>
                    <div className="ap-spec">{a.specialty}</div>
                  </div>
                  <span className="ap-pill">{a.status}</span>
                </div>
                <div className="ap-type">{a.type}</div>
                <div className="ap-time">{a.datetime}</div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="ap-empty">
                No {selectedFilter.toLowerCase()} appointments.
              </div>
            )}
          </div>
        </aside>

        {/* تفاصيل الموعد + Before your visit */}
        <div className="ap-detail">
          {selected && (
            <div className="ap-detail-card">
              <div className="ap-kicker">Next step in your care</div>
              <div className="ap-detail-title">{selected.type}</div>
              <div className="ap-detail-meta">
                {selected.doctor} · {selected.specialty}
              </div>
              <div className="ap-detail-meta">{selected.datetime}</div>
              <div className="ap-detail-meta">{selected.location}</div>

              <div className="ap-tags">
                <span className="ap-tag">{selected.phase}</span>
              </div>

              <div className="ap-actions">
                <button
                  className="ap-btn ap-btn-secondary"
                  title="Book a follow-up"
                  onClick={openFollowUp}
                >
                  Treatment / Follow‑up
                </button>

                <button
                  className="ap-btn ap-btn-primary"
                  title="Confirm this appointment"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  className="ap-btn ap-btn-secondary"
                  title="Change date or time"
                  onClick={openReschedule}
                >
                  Reschedule
                </button>
                <button
                  className="ap-btn ap-btn-ghost"
                  title="Cancel this appointment"
                  onClick={openCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="ap-quick">
            <div className="ap-quick-title">Before your visit</div>
            <div className="ap-quick-grid">
              <button
                className="ap-quick-chip"
                title="Upload a lab or report"
                onClick={openUploadResult}
              >
                Upload test result
              </button>

              {/* Message doctor محذوف */}

              <button
                className="ap-quick-chip"
                title="Share what you feel now"
                onClick={openSymptoms}
              >
                Share symptoms
              </button>
              <button
                className="ap-quick-chip"
                title="Add to your personal calendar"
                onClick={handleAddToCalendar}
              >
                Add to calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* الفورمات الحقيقية تحت الكارد */}
      <div className="ap-forms-row">
        {showFollowUp && (
          <div className="ap-formCard">
            <h4>Book follow‑up</h4>
            <p>
              Choose a date and time for a follow‑up with {selected?.doctor}.
            </p>
            <form onSubmit={handleFollowUpSubmit}>
              <div className="ap-formGrid">
                <div className="ap-field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div className="ap-field">
                  <label>Time</label>
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
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
                  Close
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Book follow‑up
                </button>
              </div>
            </form>
          </div>
        )}

        {showReschedule && (
          <div className="ap-formCard">
            <h4>Reschedule appointment</h4>
            <p>
              Choose a new date and time for your appointment with{" "}
              {selected?.doctor}.
            </p>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="ap-formGrid">
                <div className="ap-field">
                  <label>New date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div className="ap-field">
                  <label>New time</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
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
                  Close
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Save new time
                </button>
              </div>
            </form>
          </div>
        )}

        {showCancelConfirm && (
          <div className="ap-formCard">
            <h4>Cancel appointment</h4>
            <p>
              Are you sure you want to cancel this appointment with{" "}
              {selected?.doctor}?
            </p>
            <form onSubmit={handleConfirmCancel}>
              <div className="ap-field" style={{ marginTop: 8 }}>
                <label>Reason (optional)</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Feeling better, scheduling conflict..."
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
                  Keep appointment
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Cancel appointment
                </button>
              </div>
            </form>
          </div>
        )}

        {showUploadResult && (
          <div className="ap-formCard">
            <h4>Upload test result</h4>
            <form onSubmit={handleUploadResultSubmit}>
              <div className="ap-field">
                <label>File name (demo)</label>
                <input
                  type="text"
                  value={testFileName}
                  onChange={(e) => setTestFileName(e.target.value)}
                  placeholder="e.g. HbA1c_result.pdf"
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
                  Close
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {showSymptoms && (
          <div className="ap-formCard">
            <h4>Share symptoms</h4>
            <form onSubmit={handleSymptomsSubmit}>
              <div className="ap-field">
                <label>Describe your symptoms</label>
                <textarea
                  rows={3}
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  placeholder="e.g. Headache for 3 days, gets worse at night..."
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
                  Close
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Share
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Recent health activity */}
      <section className="ap-timeline">
        <h3 className="ap-timeline-title">Recent health activity</h3>
        <div className="ap-timeline-row">
          {timeline.map((t) => (
            <div key={t.id} className="ap-t-item">
              <div className={`ap-dot ap-dot-${t.type.toLowerCase()}`} />
              <div className="ap-t-date">{t.date}</div>
              <div className="ap-t-label">{t.label}</div>
              <div className="ap-t-type">{t.type}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PatientAppointments;
