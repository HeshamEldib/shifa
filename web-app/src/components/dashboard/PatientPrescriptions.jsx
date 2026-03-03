// src/components/PatientPrescriptions.jsx
import React, { useMemo, useState } from "react";
import "./PatientPrescriptions.css";
import { useTranslation } from "react-i18next";

function fakeAiExplain(medicine, t) {
  const name = (medicine?.name || "").toLowerCase();
  if (name.includes("paracetamol")) {
    return t("patientPrescriptions.ai_paracetamol");
  }
  if (name.includes("ors")) {
    return t("patientPrescriptions.ai_ors");
  }
  return t("patientPrescriptions.ai_default");
}

export default function PatientPrescriptions({
  patient,
  prescriptions,
  onBack,
}) {
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState(
    prescriptions?.[0]?.id || null
  );
  const selected = useMemo(
    () =>
      prescriptions.find((p) => p.id === selectedId) ||
      prescriptions[0] ||
      null,
    [prescriptions, selectedId]
  );

  const [takenCount, setTakenCount] = useState(0);
  const meds = selected?.medicines || [];
  const totalDosesDemo = Math.max(meds.length * 3, 1);
  const adherencePct = Math.min(
    100,
    Math.round((takenCount / totalDosesDemo) * 100)
  );

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
    if (!selected) return;
    setDownloadInfo(
      t("patientPrescriptions.pdf_ready", {
        id: selected.id,
        date: new Date(selected.createdAt).toLocaleDateString(),
      })
    );
  };

  const handleReminderSave = (e) => {
    e.preventDefault();
    setShowReminderPanel(false);
  };

  const handleRefillSave = (e) => {
    e.preventDefault();
    setShowRefillPanel(false);
  };

  const handleGenerateQr = () => {
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
        ← {t("patientPrescriptions.back")}
      </button>

      <div className="pp-title-row">
        <h2 className="pp-title">
          {t("patientPrescriptions.title")}
        </h2>
        <div className="pp-sub">
          {t("patientPrescriptions.patient_label", {
            name: patient?.name,
            id: patient?.id,
          })}
        </div>
      </div>

      {downloadInfo && (
        <div className="pp-download-info">{downloadInfo}</div>
      )}

      <div className="pp-main">
        {/* Left: timeline/list */}
        <div className="pp-left">
          <div className="pp-left-title">
            💊 {t("patientPrescriptions.timeline_title")}
          </div>
          <div className="pp-list">
            {prescriptions.length === 0 ? (
              <div className="pp-empty">
                {t("patientPrescriptions.no_prescriptions")}
              </div>
            ) : (
              prescriptions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={
                    p.id === selected?.id
                      ? "pp-item is-active"
                      : "pp-item"
                  }
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
              <div className="pp-right-label">
                {t("patientPrescriptions.selected_prescription")}
              </div>
              <div className="pp-right-id">
                {selected?.id || "—"}
              </div>
            </div>

            <div className="pp-actions">
              <button
                type="button"
                className="pp-chip-btn"
                onClick={handleDownloadPdf}
              >
                📄 {t("patientPrescriptions.download_pdf")}
              </button>
              <button
                type="button"
                className="pp-chip-btn"
                onClick={() => {
                  closeAllPanels();
                  setShowReminderPanel(true);
                }}
              >
                🔔 {t("patientPrescriptions.reminder_integration")}
              </button>
            </div>
          </div>

          {/* QR + Refill */}
          <div className="pp-row-2">
            <div className="pp-card">
              <div className="pp-card-title">
                📱 {t("patientPrescriptions.qr_title")}
              </div>
              <div className="pp-qr-box">QR (demo)</div>
              <div className="pp-qr-meta">
                {t("patientPrescriptions.qr_id", {
                  id: selected?.id || "—",
                })}
              </div>
              <button
                type="button"
                className="pp-chip-btn"
                style={{ marginTop: 8 }}
                onClick={() => {
                  closeAllPanels();
                  handleGenerateQr();
                }}
              >
                {t("patientPrescriptions.show_qr_details")}
              </button>
            </div>

            <div className="pp-card">
              <div className="pp-card-title">
                📦 {t("patientPrescriptions.refill_title")}
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                {t("patientPrescriptions.refill_desc")}
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
                {t("patientPrescriptions.open_tracker")}
              </button>
            </div>
          </div>

          {/* Medicines + AI explanation */}
          <div className="pp-row-3">
            <div className="pp-card">
              <div className="pp-card-strong-title">
                🧠 {t("patientPrescriptions.meds_ai_title")}
              </div>
              {meds.length === 0 ? (
                <div className="pp-empty">
                  {t("patientPrescriptions.no_medicines")}
                </div>
              ) : (
                meds.map((m, idx) => (
                  <div key={idx} className="pp-med-item">
                    <div className="pp-med-head">
                      {m.name}{" "}
                      <span className="pp-med-dose">
                        — {m.dose || "—"}
                      </span>
                    </div>
                    <div className="pp-med-note">
                      {m.note || "—"}
                    </div>
                    <div className="pp-med-ai">
                      {fakeAiExplain(m, t)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Adherence */}
          <div className="pp-row-4">
            <div className="pp-card">
              <div className="pp-card-strong-title">
                📊 {t("patientPrescriptions.adherence_title")}
              </div>
              <div className="pp-adherence-text">
                {t("patientPrescriptions.adherence_text", {
                  taken: takenCount,
                  total: totalDosesDemo,
                  pct: adherencePct,
                })}
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
                    setTakenCount((c) =>
                      Math.min(totalDosesDemo, c + 1)
                    )
                  }
                >
                  {t("patientPrescriptions.mark_taken")}
                </button>
                <button
                  type="button"
                  className="pp-adherence-btn"
                  onClick={() => setTakenCount(0)}
                >
                  {t("patientPrescriptions.reset")}
                </button>
              </div>
            </div>
          </div>

          {/* Panels */}
          <div className="pp-panels">
            {showReminderPanel && (
              <div className="pp-panelCard">
                <h4>
                  {t("patientPrescriptions.reminder_panel_title")}
                </h4>
                <p>{t("patientPrescriptions.reminder_panel_desc")}</p>
                <form onSubmit={handleReminderSave}>
                  <div className="pp-panel-grid">
                    <div className="pp-field">
                      <label>
                        {t("patientPrescriptions.channel")}
                      </label>
                      <select
                        value={reminderChannel}
                        onChange={(e) =>
                          setReminderChannel(e.target.value)
                        }
                      >
                        <option value="app">
                          {t("patientPrescriptions.channel_app")}
                        </option>
                        <option value="sms">
                          {t("patientPrescriptions.channel_sms")}
                        </option>
                        <option value="whatsapp">
                          {t("patientPrescriptions.channel_whatsapp")}
                        </option>
                      </select>
                    </div>
                    <div className="pp-field">
                      <label>
                        {t("patientPrescriptions.first_reminder_time")}
                      </label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) =>
                          setReminderTime(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="pp-panel-actions">
                    <button
                      type="button"
                      className="pp-adherence-btn"
                      onClick={() => setShowReminderPanel(false)}
                    >
                      {t("patientPrescriptions.close")}
                    </button>
                    <button
                      type="submit"
                      className="pp-adherence-btn"
                    >
                      {t("patientPrescriptions.save_reminders")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showRefillPanel && (
              <div className="pp-panelCard">
                <h4>{t("patientPrescriptions.refill_panel_title")}</h4>
                <p>{t("patientPrescriptions.refill_panel_desc")}</p>
                <form onSubmit={handleRefillSave}>
                  <div className="pp-field">
                    <label>
                      {t("patientPrescriptions.refill_notes")}
                    </label>
                    <textarea
                      rows={3}
                      value={refillNotes}
                      onChange={(e) => setRefillNotes(e.target.value)}
                      placeholder={t(
                        "patientPrescriptions.refill_placeholder"
                      )}
                    />
                  </div>
                  <div className="pp-panel-actions">
                    <button
                      type="button"
                      className="pp-adherence-btn"
                      onClick={() => setShowRefillPanel(false)}
                    >
                      {t("patientPrescriptions.close")}
                    </button>
                    <button
                      type="submit"
                      className="pp-adherence-btn"
                    >
                      {t("patientPrescriptions.save_refill_note")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showQrPanel && (
              <div className="pp-panelCard">
                <h4>{t("patientPrescriptions.qr_panel_title")}</h4>
                <p>
                  {t("patientPrescriptions.qr_panel_desc", {
                    id: selected?.id || "—",
                  })}
                </p>
                <div
                  className="pp-qr-box"
                  style={{ marginTop: 8 }}
                >
                  {t("patientPrescriptions.qr_preview")}
                </div>
                <div className="pp-panel-actions">
                  <button
                    type="button"
                    className="pp-adherence-btn"
                    onClick={() => setShowQrPanel(false)}
                  >
                    {t("patientPrescriptions.close")}
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
