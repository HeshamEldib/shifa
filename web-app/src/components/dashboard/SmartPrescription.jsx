// src/components/SmartPrescription.jsx
import React, { useMemo, useState } from "react";
import "./SmartPrescription.css";
import { useTranslation } from "react-i18next";

const initialMedicines = [
  { id: 1, name: "Paracetamol", dose: "500 mg", note: "Every 6 hours" },
  { id: 2, name: "ORS solution", dose: "200 ml", note: "After each loose stool" },
];

export default function SmartPrescription({ onBack, patient, onIssue }) {
  const { t } = useTranslation();

  const [medicines, setMedicines] = useState(initialMedicines);
  const [form, setForm] = useState({ name: "", dose: "", note: "" });
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState("not-run"); // not-run | ok

  const [issuedRx, setIssuedRx] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const patientName = patient?.name || t("smartRx.unknown_patient");
  const patientMeta = useMemo(() => {
    const g = patient?.gender || "—";
    const a = patient?.age ?? "—";
    const id = patient?.id || "—";
    return t("smartRx.patient_meta", { gender: g, age: a, id });
  }, [patient, t]);

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
      setToastMsg(t("smartRx.toast_no_onIssue"));
      return;
    }
    const rx = onIssue(medicines);
    setIssuedRx(rx || null);
    setToastMsg(
      rx?.id ? t("smartRx.toast_issued_sent") : t("smartRx.toast_issued")
    );
  };

  const qrId = issuedRx?.id || "SHIFAA-RX-2026-000123";

  return (
    <div className="rx-shell">
      <header className="rx-topbar">
        <button className="rx-link" onClick={onBack} type="button">
          ← {t("smartRx.back")}
        </button>

        <div className="rx-topbar-center">
          <span className="rx-top-title">
            {t("smartRx.title")}
          </span>
          <span className="rx-top-meta">
            {t("smartRx.auto_saved")}
          </span>
        </div>

        <div className="rx-topbar-right">
          <input
            className="rx-search"
            placeholder={t("smartRx.search_placeholder")}
          />
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
              {t("smartRx.view_full_profile")}
            </button>
          </div>

          <div className="rx-card rx-builder">
            <div className="rx-card-title">
              {t("smartRx.prescription_title")}
            </div>

            <div className="rx-med-list">
              {medicines.map((m) => (
                <div key={m.id} className="rx-med-item">
                  <div className="rx-med-main">
                    <div className="rx-med-name">{m.name}</div>
                    <div className="rx-med-meta">
                      {m.dose || t("smartRx.no_dose")} ·{" "}
                      {m.note || t("smartRx.no_notes")}
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
                placeholder={t("smartRx.medicine_name_placeholder")}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <div className="rx-add-row">
                <input
                  className="rx-input"
                  placeholder={t("smartRx.dose_placeholder")}
                  value={form.dose}
                  onChange={(e) =>
                    setForm({ ...form, dose: e.target.value })
                  }
                />
                <input
                  className="rx-input"
                  placeholder={t("smartRx.freq_placeholder")}
                  value={form.note}
                  onChange={(e) =>
                    setForm({ ...form, note: e.target.value })
                  }
                />
                <button
                  className="rx-btn-primary"
                  onClick={handleAddMedicine}
                  type="button"
                >
                  {t("smartRx.add_btn")}
                </button>
              </div>
            </div>
          </div>

          <div className="rx-card rx-assistant">
            <div className="rx-assist-icon">🤖</div>

            <div className="rx-assist-body">
              <div className="rx-assist-label">
                {t("smartRx.assist_label")}
              </div>
              <div className="rx-assist-alert">
                {t("smartRx.assist_alert")}
              </div>

              <ul className="rx-assist-list">
                <li>{t("smartRx.assist_suggestion_ors")}</li>
                <li>{t("smartRx.assist_suggestion_monitor")}</li>
              </ul>

              <div className="rx-assist-actions">
                <button
                  className="rx-btn-primary rx-btn-small"
                  onClick={handleAcceptSuggestion}
                  disabled={acceptedSuggestion}
                  type="button"
                >
                  {acceptedSuggestion
                    ? t("smartRx.assist_applied")
                    : t("smartRx.assist_apply")}
                </button>
                <button
                  className="rx-btn-ghost rx-btn-small"
                  type="button"
                >
                  {t("smartRx.assist_dismiss")}
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="rx-right">
          <div className="rx-card rx-status">
            <div className="rx-card-title">
              {t("smartRx.status_title")}
            </div>
            <ul className="rx-status-list">
              <li className="is-ok">
                {t("smartRx.status_meds_added")}
              </li>
              <li className="is-ok">
                {t("smartRx.status_dose_filled")}
              </li>
              <li
                className={
                  safetyStatus === "ok" ? "is-ok" : "is-warn"
                }
              >
                {safetyStatus === "ok"
                  ? t("smartRx.status_safety_ok")
                  : t("smartRx.status_safety_not_run")}
              </li>
            </ul>

            {toastMsg ? (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "#9ca3af",
                }}
              >
                {toastMsg}
              </div>
            ) : null}
          </div>

          <div className="rx-card rx-qr">
            <div className="rx-card-title">
              {t("smartRx.qr_title")}
            </div>

            <div className="rx-qr-box">
              <div className="rx-qr-inner">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="rx-qr-cell" />
                ))}
              </div>

              <div className="rx-qr-meta">
                <div className="rx-qr-id">{qrId}</div>
                <div className="rx-qr-badge">
                  {t("smartRx.qr_badge")}
                </div>
              </div>
            </div>

            <p className="rx-qr-text">
              {t("smartRx.qr_text")}
            </p>
          </div>

          <div className="rx-card rx-safety">
            <div className="rx-card-title">
              {t("smartRx.safety_title")}
            </div>
            <p className="rx-safety-text">
              {t("smartRx.safety_text")}
            </p>

            <button
              className="rx-btn-secondary"
              onClick={runSafetyCheck}
              type="button"
            >
              {t("smartRx.run_check")}
            </button>

            {safetyStatus === "ok" && (
              <p className="rx-safety-result">
                {t("smartRx.safety_result_ok")}
              </p>
            )}
          </div>
        </aside>
      </main>

      <footer className="rx-footer">
        <button
          className="rx-btn-ghost"
          onClick={onBack}
          type="button"
        >
          {t("smartRx.cancel")}
        </button>

        <div className="rx-footer-actions">
          <button
            className="rx-btn-secondary"
            onClick={issueNow}
            type="button"
          >
            {t("smartRx.send_to_patient")}
          </button>
          <button
            className="rx-btn-primary"
            onClick={issueNow}
            type="button"
          >
            {t("smartRx.issue_now")}
          </button>
        </div>
      </footer>
    </div>
  );
}
