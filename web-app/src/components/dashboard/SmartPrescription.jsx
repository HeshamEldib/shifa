import React, { useMemo, useState } from "react";
import "./SmartPrescription.css";

const initialMedicines = [
  { id: 1, name: "Paracetamol", dose: "500 mg", note: "Every 6 hours" },
  { id: 2, name: "ORS solution", dose: "200 ml", note: "After each loose stool" },
];

export default function SmartPrescription({ onBack, patient, onIssue }) {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [form, setForm] = useState({ name: "", dose: "", note: "" });
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState("not-run"); // not-run | ok

  const [issuedRx, setIssuedRx] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const patientName = patient?.name || "Unknown patient";
  const patientMeta = useMemo(() => {
    const g = patient?.gender || "—";
    const a = patient?.age ?? "—";
    const id = patient?.id || "—";
    return `${g} · ${a}y · ID ${id}`;
  }, [patient]);

  const handleAddMedicine = () => {
    if (!form.name.trim()) return;

    setMedicines((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        dose: form.dose.trim(),
        note: form.note.trim(),
      },
    ]);

    setForm({ name: "", dose: "", note: "" });
  };

  const handleRemove = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAcceptSuggestion = () => {
    if (!medicines.find((m) => m.name.toLowerCase().includes("ors"))) {
      setMedicines((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: "ORS solution",
          dose: "200 ml",
          note: "After each loose stool",
        },
      ]);
    }
    setAcceptedSuggestion(true);
  };

  const runSafetyCheck = () => setSafetyStatus("ok");

  const issueNow = () => {
    setToastMsg("");
    if (!onIssue) {
      setToastMsg("onIssue() is not connected from App.js");
      return;
    }
    const rx = onIssue(medicines);
    setIssuedRx(rx || null);
    setToastMsg(rx?.id ? "Issued & sent (demo)." : "Issued (demo).");
  };

  const qrId = issuedRx?.id || "SHIFAA-RX-2026-000123";

  return (
    <div className="rx-shell">
      <header className="rx-topbar">
        <button className="rx-link" onClick={onBack} type="button">
          ← Back
        </button>

        <div className="rx-topbar-center">
          <span className="rx-top-title">Smart Prescription</span>
          <span className="rx-top-meta">Auto-saved · just now</span>
        </div>

        <div className="rx-topbar-right">
          <input className="rx-search" placeholder="Search patient..." />
          <div className="rx-avatar">S</div>
        </div>
      </header>

      <main className="rx-layout">
        <section className="rx-left">
          <div className="rx-card rx-patient">
            <div>
              <div className="rx-patient-name">{patientName}</div>
              <div className="rx-patient-meta">{patientMeta}</div>
            </div>
            <button className="rx-link-button" type="button">
              View full profile
            </button>
          </div>

          <div className="rx-card rx-builder">
            <div className="rx-card-title">Prescription</div>

            <div className="rx-med-list">
              {medicines.map((m) => (
                <div key={m.id} className="rx-med-item">
                  <div className="rx-med-main">
                    <div className="rx-med-name">{m.name}</div>
                    <div className="rx-med-meta">
                      {m.dose || "No dose set"} · {m.note || "No notes"}
                    </div>
                  </div>

                  <button
                    className="rx-med-remove"
                    onClick={() => handleRemove(m.id)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="rx-add">
              <input
                className="rx-input"
                placeholder="Medicine name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="rx-add-row">
                <input
                  className="rx-input"
                  placeholder="Dose (e.g. 500 mg)"
                  value={form.dose}
                  onChange={(e) => setForm({ ...form, dose: e.target.value })}
                />
                <input
                  className="rx-input"
                  placeholder="Frequency / notes"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
                <button className="rx-btn-primary" onClick={handleAddMedicine} type="button">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="rx-card rx-assistant">
            <div className="rx-assist-icon">🤖</div>

            <div className="rx-assist-body">
              <div className="rx-assist-label">Smart assistant</div>
              <div className="rx-assist-alert">Possible dehydration detected.</div>

              <ul className="rx-assist-list">
                <li>Add ORS solution to prescription.</li>
                <li>Monitor fluid intake over the next 24 hours.</li>
              </ul>

              <div className="rx-assist-actions">
                <button
                  className="rx-btn-primary rx-btn-small"
                  onClick={handleAcceptSuggestion}
                  disabled={acceptedSuggestion}
                  type="button"
                >
                  {acceptedSuggestion ? "Applied" : "Apply suggestion"}
                </button>
                <button className="rx-btn-ghost rx-btn-small" type="button">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="rx-right">
          <div className="rx-card rx-status">
            <div className="rx-card-title">Prescription status</div>
            <ul className="rx-status-list">
              <li className="is-ok">✔ Medicines added</li>
              <li className="is-ok">✔ Dosage filled</li>
              <li className={safetyStatus === "ok" ? "is-ok" : "is-warn"}>
                {safetyStatus === "ok" ? "✔ Safety check completed" : "⚠ Safety check not run"}
              </li>
            </ul>

            {toastMsg ? (
              <div style={{ marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
                {toastMsg}
              </div>
            ) : null}
          </div>

          <div className="rx-card rx-qr">
            <div className="rx-card-title">QR prescription</div>

            <div className="rx-qr-box">
              <div className="rx-qr-inner">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="rx-qr-cell" />
                ))}
              </div>

              <div className="rx-qr-meta">
                <div className="rx-qr-id">{qrId}</div>
                <div className="rx-qr-badge">Verified · Tamper‑proof</div>
              </div>
            </div>

            <p className="rx-qr-text">
              Scan this code to open this prescription. Pharmacies can verify the ID before dispensing medicines.
            </p>
          </div>

          <div className="rx-card rx-safety">
            <div className="rx-card-title">Safety check</div>
            <p className="rx-safety-text">
              Run safety validation before issuing this prescription.
            </p>

            <button className="rx-btn-secondary" onClick={runSafetyCheck} type="button">
              Run check
            </button>

            {safetyStatus === "ok" && (
              <p className="rx-safety-result">
                ✔ No conflicts found with common allergies or maximum daily dose.
              </p>
            )}
          </div>
        </aside>
      </main>

      <footer className="rx-footer">
        <button className="rx-btn-ghost" onClick={onBack} type="button">
          Cancel
        </button>

        <div className="rx-footer-actions">
          <button className="rx-btn-secondary" onClick={issueNow} type="button">
            Send to patient
          </button>
          <button className="rx-btn-primary" onClick={issueNow} type="button">
            Issue prescription
          </button>
        </div>
      </footer>
    </div>
  );
}
