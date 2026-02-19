// src/components/PatientPrescriptions.jsx
import React, { useMemo, useState } from "react";
import "./PatientPrescriptions.css";

function fakeAiExplain(medicine) {
  const name = (medicine?.name || "").toLowerCase();
  if (name.includes("paracetamol")) {
    return "Pain/fever relief. Avoid taking more than the recommended total daily dose.";
  }
  if (name.includes("ors")) {
    return "Oral rehydration salts help replace fluids and electrolytes during diarrhea/vomiting.";
  }
  return "Use as prescribed. If you feel side effects, contact your doctor/pharmacist.";
}

export default function PatientPrescriptions({ patient, prescriptions, onBack }) {
  const [selectedId, setSelectedId] = useState(prescriptions?.[0]?.id || null);
  const selected = useMemo(
    () => prescriptions.find((p) => p.id === selectedId) || prescriptions[0] || null,
    [prescriptions, selectedId]
  );

  // ===== Adherence state =====
  const [takenCount, setTakenCount] = useState(0);
  const meds = selected?.medicines || [];
  const totalDosesDemo = Math.max(meds.length * 3, 1);
  const adherencePct = Math.min(100, Math.round((takenCount / totalDosesDemo) * 100));

  // ===== Panels state (بدل alerts) =====
  const [showReminderPanel, setShowReminderPanel] = useState(false);
  const [reminderChannel, setReminderChannel] = useState("app");
  const [reminderTime, setReminderTime] = useState("08:00");

  const [showRefillPanel, setShowRefillPanel] = useState(false);
  const [refillNotes, setRefillNotes] = useState("");

  const [showQrPanel, setShowQrPanel] = useState(false);

  const [downloadInfo, setDownloadInfo] = useState("");

  const closeAllPanels = () => {
    setShowReminderPanel(false);
    setShowRefillPanel(false);
    setShowQrPanel(false);
  };

  const handleDownloadPdf = () => {
    // بدل alert، نظهر ملخص تحت الهيدر
    if (!selected) return;
    setDownloadInfo(
      `PDF ready for prescription ${selected.id} (${new Date(
        selected.createdAt
      ).toLocaleDateString()}). This will later trigger a real file download.`
    );
  };

  const handleReminderSave = (e) => {
    e.preventDefault();
    // هنا نعتبر إننا خزّنّا إعدادات الريمايندر في النظام
    setShowReminderPanel(false);
  };

  const handleRefillSave = (e) => {
    e.preventDefault();
    setShowRefillPanel(false);
  };

  const handleGenerateQr = () => {
    // نفتح Panel يعرض QR info (حاليًا نص، لاحقًا QR حقيقي)
    setShowQrPanel(true);
  };

  const handleChangePrescription = (id) => {
    setSelectedId(id);
    setTakenCount(0);
    closeAllPanels();
    setDownloadInfo("");
  };

  return (
    <div className="pp-shell">
      <button className="pp-back" onClick={onBack} type="button">
        ← Back
      </button>

      <div className="pp-title-row">
        <h2 className="pp-title">Patient Medication Hub</h2>
        <div className="pp-sub">
          Patient: {patient?.name} · ID {patient?.id}
        </div>
      </div>

      {downloadInfo && (
        <div className="pp-download-info">
          {downloadInfo}
        </div>
      )}

      <div className="pp-main">
        {/* Left: timeline/list */}
        <div className="pp-left">
          <div className="pp-left-title">💊 Prescription timeline</div>
          <div className="pp-list">
            {prescriptions.length === 0 ? (
              <div className="pp-empty">
                No prescriptions yet. Ask your doctor to issue one.
              </div>
            ) : (
              prescriptions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={p.id === selected?.id ? "pp-item is-active" : "pp-item"}
                  onClick={() => handleChangePrescription(p.id)}
                >
                  <div className="pp-item-id">{p.id}</div>
                  <div className="pp-item-meta">
                    {new Date(p.createdAt).toLocaleString()} · {p.status}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Hub */}
        <div className="pp-right">
          {/* Header + actions */}
          <div className="pp-right-head">
            <div>
              <div className="pp-right-label">Selected prescription</div>
              <div className="pp-right-id">{selected?.id || "—"}</div>
            </div>

            <div className="pp-actions">
              <button
                type="button"
                className="pp-chip-btn"
                onClick={handleDownloadPdf}
              >
                📄 Download as PDF
              </button>
              <button
                type="button"
                className="pp-chip-btn"
                onClick={() => {
                  closeAllPanels();
                  setShowReminderPanel(true);
                }}
              >
                🔔 Reminder integration
              </button>
            </div>
          </div>

          {/* QR + Refill */}
          <div className="pp-row-2">
            <div className="pp-card">
              <div className="pp-card-title">📱 QR for pharmacy</div>
              <div className="pp-qr-box">QR (demo)</div>
              <div className="pp-qr-meta">ID: {selected?.id || "—"}</div>
              <button
                type="button"
                className="pp-chip-btn"
                style={{ marginTop: 8 }}
                onClick={() => {
                  closeAllPanels();
                  handleGenerateQr();
                }}
              >
                Show QR details
              </button>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">📦 Smart refill tracker</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                Track remaining doses and refill dates per medicine.
              </div>
              <div style={{ height: 10 }} />
              <button
                type="button"
                className="pp-chip-btn"
                onClick={() => {
                  closeAllPanels();
                  setShowRefillPanel(true);
                }}
              >
                Open tracker
              </button>
            </div>
          </div>

          {/* Medicines + AI explanation */}
          <div className="pp-row-3">
            <div className="pp-card">
              <div className="pp-card-strong-title">
                🧠 Medicines & AI explanation
              </div>
              {meds.length === 0 ? (
                <div className="pp-empty">No medicines in this prescription.</div>
              ) : (
                meds.map((m, idx) => (
                  <div key={idx} className="pp-med-item">
                    <div className="pp-med-head">
                      {m.name}{" "}
                      <span className="pp-med-dose">— {m.dose || "—"}</span>
                    </div>
                    <div className="pp-med-note">{m.note || "—"}</div>
                    <div className="pp-med-ai">{fakeAiExplain(m)}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Adherence */}
          <div className="pp-row-4">
            <div className="pp-card">
              <div className="pp-card-strong-title">
                📊 Adherence progress
              </div>
              <div className="pp-adherence-text">
                {takenCount} / {totalDosesDemo} doses tracked · {adherencePct}%
              </div>
              <div className="pp-adherence-bar-wrap">
                <div
                  className="pp-adherence-bar-inner"
                  style={{ width: `${adherencePct}%` }}
                />
              </div>
              <div className="pp-adherence-actions">
                <button
                  type="button"
                  className="pp-adherence-btn"
                  onClick={() =>
                    setTakenCount((c) => Math.min(totalDosesDemo, c + 1))
                  }
                >
                  Mark dose taken
                </button>
                <button
                  type="button"
                  className="pp-adherence-btn"
                  onClick={() => setTakenCount(0)}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ===== Inline panels تحت الهب ===== */}
          <div className="pp-panels">
            {showReminderPanel && (
              <div className="pp-panelCard">
                <h4>Reminder integration</h4>
                <p>
                  Choose how and when you would like to receive reminders
                  for this prescription.
                </p>
                <form onSubmit={handleReminderSave}>
                  <div className="pp-panel-grid">
                    <div className="pp-field">
                      <label>Channel</label>
                      <select
                        value={reminderChannel}
                        onChange={(e) => setReminderChannel(e.target.value)}
                      >
                        <option value="app">In‑app only</option>
                        <option value="sms">SMS</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    <div className="pp-field">
                      <label>First reminder time</label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pp-panel-actions">
                    <button
                      type="button"
                      className="pp-adherence-btn"
                      onClick={() => setShowReminderPanel(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="pp-adherence-btn">
                      Save reminders
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showRefillPanel && (
              <div className="pp-panelCard">
                <h4>Smart refill tracker</h4>
                <p>
                  Add a note about when you expect to run out of your
                  medicines or when to refill.
                </p>
                <form onSubmit={handleRefillSave}>
                  <div className="pp-field">
                    <label>Refill notes</label>
                    <textarea
                      rows={3}
                      value={refillNotes}
                      onChange={(e) => setRefillNotes(e.target.value)}
                      placeholder="e.g. Refill Paracetamol around 1 March."
                    />
                  </div>
                  <div className="pp-panel-actions">
                    <button
                      type="button"
                      className="pp-adherence-btn"
                      onClick={() => setShowRefillPanel(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="pp-adherence-btn">
                      Save tracker note
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showQrPanel && (
              <div className="pp-panelCard">
                <h4>QR for pharmacy</h4>
                <p>
                  This QR code represents prescription ID{" "}
                  <strong>{selected?.id || "—"}</strong>. In the real
                  system, the pharmacy will scan it to fetch the
                  prescription details.
                </p>
                <div className="pp-qr-box" style={{ marginTop: 8 }}>
                  QR preview
                </div>
                <div className="pp-panel-actions">
                  <button
                    type="button"
                    className="pp-adherence-btn"
                    onClick={() => setShowQrPanel(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
