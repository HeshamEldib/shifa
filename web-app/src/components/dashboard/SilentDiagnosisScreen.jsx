// src/components/SilentDiagnosisScreen.jsx
import React, { useState } from "react";
import "./Screen.css";

const observationItems = [
  { id: "breathing", label: "Breathing pattern" },
  { id: "facial", label: "Facial tension" },
  { id: "eyes", label: "Eye focus" },
  { id: "voice", label: "Voice clarity (last sentence)" },
];

const decisions = [
  { id: "safe", label: "Safe follow-up", colorClass: "sds-decision-safe" },
  { id: "exam", label: "Needs physical exam", colorClass: "sds-decision-exam" },
  { id: "emergency", label: "Emergency now", colorClass: "sds-decision-emergency" },
];

function SilentDiagnosisScreen({ onBack }) {
  const [pulseOn, setPulseOn] = useState(true);
  const [cantSpeakMode, setCantSpeakMode] = useState(false);

  const [observations, setObservations] = useState({});
  const [log, setLog] = useState([]);

  const [selectedDecision, setSelectedDecision] = useState(null);

  // ===== بيانات الـ silent gestures =====
  const [lastGesture, setLastGesture] = useState(null); // آخر input
  const [painLocation, setPainLocation] = useState("");
  const [painScale, setPainScale] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);

  const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handlePulseToggle = () => {
    setPulseOn((prev) => !prev);
  };

  const handleObservation = (id, value) => {
    const time = timeNow();
    setObservations((prev) => ({ ...prev, [id]: value }));
    setLog((prev) => [
      { id: `${id}-${time}-${prev.length}`, itemId: id, value, time },
      ...prev,
    ]);
  };

  const handleDecision = (id) => {
    setSelectedDecision(id);
  };

  // ===== Handlers للـ gestures =====
  const handleYes = () => {
    setLastGesture({ type: "Yes 👍", at: timeNow() });
  };

  const handleNo = () => {
    setLastGesture({ type: "No 👎", at: timeNow() });
  };

  const handlePainLocation = () => {
    const loc = window.prompt("Where is the pain? (e.g. left chest)");
    if (loc && loc.trim()) {
      setPainLocation(loc.trim());
      setLastGesture({ type: "Pain location updated", at: timeNow() });
    }
  };

  const handlePainScale = () => {
    const value = window.prompt("Pain scale 1–10 (fingers):");
    const num = Number(value);
    if (!Number.isNaN(num) && num >= 1 && num <= 10) {
      setPainScale(num);
      setLastGesture({ type: `Pain scale: ${num}/10`, at: timeNow() });
    }
  };

  const handleBreathing = () => {
    setBreathingActive(true);
    setLastGesture({ type: "Breathing coach started", at: timeNow() });
    setTimeout(() => setBreathingActive(false), 10000); // 10 ثواني
  };

  // ===== Session summary =====
  const summaryText = () => {
    const negatives = Object.entries(observations)
      .filter(([_, v]) => v === "no")
      .map(([key]) => {
        const item = observationItems.find((o) => o.id === key);
        return item ? item.label : key;
      });

    if (!selectedDecision) {
      return "No final decision selected yet. Tap one of the outcomes above.";
    }

    const concernsPart = negatives.length
      ? `Concerns in: ${negatives.join(", ")}. `
      : "";

    if (selectedDecision === "safe") {
      return (
        concernsPart +
        "Decision: stable enough for remote follow-up with clear safety advice."
      );
    }
    if (selectedDecision === "exam") {
      return (
        concernsPart +
        "Decision: schedule an in-person physical exam as soon as possible."
      );
    }
    // emergency
    return (
      concernsPart +
      "Decision: high risk – trigger emergency protocol immediately."
    );
  };

  return (
    <div className="sds-shell">
      {/* Top bar اختياري: زر رجوع */}
      {onBack && (
        <div className="sds-topbar">
          <button type="button" className="sds-back-btn" onClick={onBack}>
            ← Back
          </button>
        </div>
      )}

      {/* Live Moment */}
      <section className="sds-section sds-live">
        <header className="sds-section-header">
          <div className="sds-section-title">
            <span className="sds-pill sds-pill-live">Live moment</span>
            <span className="sds-section-sub">
              Pulsed video · focus during silence
            </span>
          </div>
          <div className="sds-live-controls">
            <button
              className={`sds-pulse-toggle ${pulseOn ? "is-on" : "is-off"}`}
              onClick={handlePulseToggle}
            >
              {pulseOn ? "Pulse mode: ON" : "Pulse mode: OFF"}
            </button>
            <button
              className={`sds-cant-speak ${cantSpeakMode ? "is-active" : ""}`}
              onClick={() => setCantSpeakMode((v) => !v)}
            >
              Patient can’t speak
            </button>
          </div>
        </header>

        <div className="sds-live-body">
          <div className={`sds-video-box ${pulseOn ? "is-pulsing" : ""}`}>
            <div className="sds-video-label">
              Smart Doctor Call · Silent diagnosis mode
            </div>
            <div className="sds-video-placeholder">
              <div className="sds-video-person sds-video-patient" />
              <div className="sds-video-person sds-video-doctor" />
            </div>
            <div className="sds-video-status">
              {pulseOn
                ? "Video bursts: 10s on · 20s off"
                : "Continuous video preview"}
            </div>

            {cantSpeakMode && (
              <div className="sds-gesture-inline">
                <div className="sds-gesture-title">Silent gestures panel</div>
                <div className="sds-gesture-grid">
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handleYes}
                  >
                    Yes 👍
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handleNo}
                  >
                    No 👎
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handlePainLocation}
                  >
                    Show pain location
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handleBreathing}
                  >
                    Breathe in / out
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handlePainScale}
                  >
                    Pain scale (fingers)
                  </button>
                </div>
                <p className="sds-gesture-note">
                  Use simple gestures to continue the call when the patient
                  cannot speak.
                </p>

                {/* عرض نتيجة الجستشر */}
                <div className="sds-gesture-info">
                  {lastGesture ? (
                    <div>
                      Last input: <strong>{lastGesture.type}</strong> at{" "}
                      {lastGesture.at}
                    </div>
                  ) : (
                    <div>No gestures recorded yet.</div>
                  )}
                  {painLocation && (
                    <div>Pain location: {painLocation}</div>
                  )}
                  {painScale !== null && (
                    <div>Pain scale: {painScale} / 10</div>
                  )}
                  {breathingActive && (
                    <div className="sds-breathing-banner">
                      Breathe with me… In… Out… (10 seconds)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Observation Layer */}
      <section className="sds-section sds-observation">
        <header className="sds-section-header">
          <div className="sds-section-title">
            <span className="sds-pill sds-pill-core">Observation layer</span>
            <span className="sds-section-sub">
              Four quick checkpoints · tap once per item
            </span>
          </div>
        </header>

        <div className="sds-observation-layout">
          <div className="sds-observation-row">
            {observationItems.map((item) => {
              const value = observations[item.id];
              return (
                <div key={item.id} className="sds-observation-inline">
                  <div className="sds-observation-inline-label">
                    {item.label}
                  </div>
                  <div className="sds-observation-inline-actions">
                    <button
                      className={
                        value === "yes"
                          ? "sds-ob-chip is-yes is-selected"
                          : "sds-ob-chip is-yes"
                      }
                      onClick={() => handleObservation(item.id, "yes")}
                    >
                      ✓ Stable
                    </button>
                    <button
                      className={
                        value === "no"
                          ? "sds-ob-chip is-no is-selected"
                          : "sds-ob-chip is-no"
                      }
                      onClick={() => handleObservation(item.id, "no")}
                    >
                      ✕ Concern
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sds-log-panel">
            <div className="sds-log-title">Recent checkpoints</div>
            <ul className="sds-log-list">
              {log.length === 0 && (
                <li className="sds-log-empty">
                  No checkpoints logged yet.
                </li>
              )}
              {log.map((entry) => {
                const item = observationItems.find(
                  (o) => o.id === entry.itemId
                );
                return (
                  <li key={entry.id}>
                    <span className="sds-log-time">{entry.time}</span>
                    <span className="sds-log-text">
                      {item ? item.label : entry.itemId} ·{" "}
                      {entry.value === "yes" ? "Stable" : "Concern"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Decision Minute */}
      <section className="sds-section sds-decision">
        <header className="sds-section-header">
          <div className="sds-section-title">
            <span className="sds-pill sds-pill-decision">
              Decision minute
            </span>
            <span className="sds-section-sub">
              Lock the call with one clear outcome
            </span>
          </div>
          <div className="sds-countdown">
            Last 60 seconds of the call
          </div>
        </header>

        <div className="sds-decision-row">
          {decisions.map((d) => (
            <button
              key={d.id}
              className={`sds-decision-card ${d.colorClass} ${
                selectedDecision === d.id ? "is-selected" : ""
              }`}
              onClick={() => handleDecision(d.id)}
            >
              <div className="sds-decision-label">{d.label}</div>
              <div className="sds-decision-hint">
                {d.id === "safe" &&
                  "Stable observation · plan remote follow-up."}
                {d.id === "exam" &&
                  "Concerning signs · schedule in-person assessment."}
                {d.id === "emergency" &&
                  "High risk · trigger emergency protocol immediately."}
              </div>
            </button>
          ))}
        </div>

        <div className="sds-summary-box">
          <div className="sds-summary-title">Session summary hint</div>
          <p className="sds-summary-text">{summaryText()}</p>
        </div>
      </section>
    </div>
  );
}

export default SilentDiagnosisScreen;
