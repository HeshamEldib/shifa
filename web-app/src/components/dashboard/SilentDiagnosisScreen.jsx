// src/components/SilentDiagnosisScreen.jsx
import React, { useEffect, useState } from "react";
import "./Screen.css";
import { useTranslation } from "react-i18next";

const observationItems = [
  { id: "breathing", labelKey: "breathing" },
  { id: "facial", labelKey: "facial" },
  { id: "eyes", labelKey: "eyes" },
  { id: "voice", labelKey: "voice" },
];

const decisions = [
  { id: "safe", labelKey: "safe_label", colorClass: "sds-decision-safe" },
  { id: "exam", labelKey: "exam_label", colorClass: "sds-decision-exam" },
  {
    id: "emergency",
    labelKey: "emergency_label",
    colorClass: "sds-decision-emergency",
  },
];

// exposeBuildPayload: دالة يبعتهالك الأب عشان يقدر ياخد payload وقت ما يحب
function SilentDiagnosisScreen({ onBack, sessionId, patientId, exposeBuildPayload }) {
  const { t } = useTranslation();
  const [pulseOn, setPulseOn] = useState(true);
  const [cantSpeakMode, setCantSpeakMode] = useState(false);

  const [observations, setObservations] = useState({});
  const [log, setLog] = useState([]);

  const [selectedDecision, setSelectedDecision] = useState(null);

  const [lastGesture, setLastGesture] = useState(null);
  const [painLocation, setPainLocation] = useState("");
  const [painScale, setPainScale] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);

  const timeNow = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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

  // ===== Gestures =====
  const handleYes = () => {
    setLastGesture({
      type: t("silentScreen.gesture_yes"),
      at: timeNow(),
    });
  };

  const handleNo = () => {
    setLastGesture({
      type: t("silentScreen.gesture_no"),
      at: timeNow(),
    });
  };

  const handlePainLocation = () => {
    const loc = window.prompt(
      t("silentScreen.prompt_pain_location_placeholder")
    );
    if (loc && loc.trim()) {
      setPainLocation(loc.trim());
      setLastGesture({
        type: t("silentScreen.gesture_pain_location_updated"),
        at: timeNow(),
      });
    }
  };

  const handlePainScale = () => {
    const value = window.prompt(
      t("silentScreen.prompt_pain_scale_placeholder")
    );
    const num = Number(value);
    if (!Number.isNaN(num) && num >= 1 && num <= 10) {
      setPainScale(num);
      setLastGesture({
        type: t("silentScreen.gesture_pain_scale_label", { num }),
        at: timeNow(),
      });
    }
  };

  const handleBreathing = () => {
    setBreathingActive(true);
    setLastGesture({
      type: t("silentScreen.gesture_breathing_started"),
      at: timeNow(),
    });
    setTimeout(() => setBreathingActive(false), 10000);
  };

  // ===== Summary text (لواجهة المريض/الدكتور) =====
  const summaryText = () => {
    const negatives = Object.entries(observations)
      .filter(([_, v]) => v === "no")
      .map(([key]) => {
        const item = observationItems.find((o) => o.id === key);
        if (!item) return key;
        return t(`silentScreen.observation_${item.labelKey}`);
      });

    if (!selectedDecision) {
      return t("silentScreen.summary_no_decision");
    }

    const concernsPart = negatives.length
      ? t("silentScreen.summary_concerns", {
          list: negatives.join(", "),
        }) + " "
      : "";

    if (selectedDecision === "safe") {
      return concernsPart + t("silentScreen.summary_decision_safe");
    }
    if (selectedDecision === "exam") {
      return concernsPart + t("silentScreen.summary_decision_exam");
    }
    return concernsPart + t("silentScreen.summary_decision_emergency");
  };

  // ===== build payload للباك (مافيش UI جديد) =====
  const buildSilentSummaryPayload = () => ({
    sessionId: sessionId || null,
    patientId: patientId || null,
    at: new Date().toISOString(),
    observations,
    log,
    decision: selectedDecision,
    gestures: {
      lastGesture,
      painLocation: painLocation || null,
      painScale,
      breathingActive,
    },
  });

  // نبعت الفانكشن للأب كل ما تتغير (عشان يشوف آخر حالة لو حب يحفظ)
  useEffect(() => {
    if (typeof exposeBuildPayload === "function") {
      exposeBuildPayload(buildSilentSummaryPayload);
    }
  }, [
    exposeBuildPayload,
    sessionId,
    patientId,
    observations,
    log,
    selectedDecision,
    lastGesture,
    painLocation,
    painScale,
    breathingActive,
  ]);

  return (
    <div className="sds-shell">
      {/* Top bar */}
      {onBack && (
        <div className="sds-topbar">
          <button
            type="button"
            className="sds-back-btn"
            onClick={onBack}
          >
            ← {t("silentScreen.back")}
          </button>
        </div>
      )}

      {/* Live Moment */}
      <section className="sds-section sds-live">
        <header className="sds-section-header">
          <div className="sds-section-title">
            <span className="sds-pill sds-pill-live">
              {t("silentScreen.live_pill")}
            </span>
            <span className="sds-section-sub">
              {t("silentScreen.live_subtitle")}
            </span>
          </div>
          <div className="sds-live-controls">
            <button
              className={`sds-pulse-toggle ${
                pulseOn ? "is-on" : "is-off"
              }`}
              onClick={handlePulseToggle}
            >
              {pulseOn
                ? t("silentScreen.pulse_on")
                : t("silentScreen.pulse_off")}
            </button>
            <button
              className={`sds-cant-speak ${
                cantSpeakMode ? "is-active" : ""
              }`}
              onClick={() => setCantSpeakMode((v) => !v)}
            >
              {t("silentScreen.cant_speak_toggle")}
            </button>
          </div>
        </header>

        <div className="sds-live-body">
          <div
            className={`sds-video-box ${
              pulseOn ? "is-pulsing" : ""
            }`}
          >
            <div className="sds-video-label">
              {t("silentScreen.video_label")}
            </div>
            <div className="sds-video-placeholder">
              <div className="sds-video-person sds-video-patient" />
              <div className="sds-video-person sds-video-doctor" />
            </div>
            <div className="sds-video-status">
              {pulseOn
                ? t("silentScreen.video_status_pulse")
                : t("silentScreen.video_status_continuous")}
            </div>

            {cantSpeakMode && (
              <div className="sds-gesture-inline">
                <div className="sds-gesture-title">
                  {t("silentScreen.gesture_panel_title")}
                </div>
                <div className="sds-gesture-grid">
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handleYes}
                  >
                    {t("silentScreen.gesture_yes_btn")}
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handleNo}
                  >
                    {t("silentScreen.gesture_no_btn")}
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handlePainLocation}
                  >
                    {t("silentScreen.gesture_pain_location_btn")}
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handleBreathing}
                  >
                    {t("silentScreen.gesture_breath_btn")}
                  </button>
                  <button
                    type="button"
                    className="sds-gesture-btn"
                    onClick={handlePainScale}
                  >
                    {t("silentScreen.gesture_pain_scale_btn")}
                  </button>
                </div>
                <p className="sds-gesture-note">
                  {t("silentScreen.gesture_note")}
                </p>

                <div className="sds-gesture-info">
                  {lastGesture ? (
                    <div>
                      {t("silentScreen.last_input")}{" "}
                      <strong>{lastGesture.type}</strong>{" "}
                      {t("silentScreen.at_time")} {lastGesture.at}
                    </div>
                  ) : (
                    <div>
                      {t("silentScreen.no_gestures_yet")}
                    </div>
                  )}
                  {painLocation && (
                    <div>
                      {t("silentScreen.pain_location_label")}{" "}
                      {painLocation}
                    </div>
                  )}
                  {painScale !== null && (
                    <div>
                      {t("silentScreen.pain_scale_label", {
                        num: painScale,
                      })}
                    </div>
                  )}
                  {breathingActive && (
                    <div className="sds-breathing-banner">
                      {t("silentScreen.breathing_banner")}
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
            <span className="sds-pill sds-pill-core">
              {t("silentScreen.observation_pill")}
            </span>
            <span className="sds-section-sub">
              {t("silentScreen.observation_sub")}
            </span>
          </div>
        </header>

        <div className="sds-observation-layout">
          <div className="sds-observation-row">
            {observationItems.map((item) => {
              const value = observations[item.id];
              return (
                <div
                  key={item.id}
                  className="sds-observation-inline"
                >
                  <div className="sds-observation-inline-label">
                    {t(
                      `silentScreen.observation_${item.labelKey}`
                    )}
                  </div>
                  <div className="sds-observation-inline-actions">
                    <button
                      className={
                        value === "yes"
                          ? "sds-ob-chip is-yes is-selected"
                          : "sds-ob-chip is-yes"
                      }
                      onClick={() =>
                        handleObservation(item.id, "yes")
                      }
                    >
                      {t("silentScreen.observation_stable")}
                    </button>
                    <button
                      className={
                        value === "no"
                          ? "sds-ob-chip is-no is-selected"
                          : "sds-ob-chip is-no"
                      }
                      onClick={() =>
                        handleObservation(item.id, "no")
                      }
                    >
                      {t("silentScreen.observation_concern")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sds-log-panel">
            <div className="sds-log-title">
              {t("silentScreen.log_title")}
            </div>
            <ul className="sds-log-list">
              {log.length === 0 && (
                <li className="sds-log-empty">
                  {t("silentScreen.log_empty")}
                </li>
              )}
              {log.map((entry) => {
                const item = observationItems.find(
                  (o) => o.id === entry.itemId
                );
                return (
                  <li key={entry.id}>
                    <span className="sds-log-time">
                      {entry.time}
                    </span>
                    <span className="sds-log-text">
                      {item
                        ? t(
                            `silentScreen.observation_${item.labelKey}`
                          )
                        : entry.itemId}{" "}
                      ·{" "}
                      {entry.value === "yes"
                        ? t("silentScreen.log_stable")
                        : t("silentScreen.log_concern")}
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
              {t("silentScreen.decision_pill")}
            </span>
            <span className="sds-section-sub">
              {t("silentScreen.decision_sub")}
            </span>
          </div>
          <div className="sds-countdown">
            {t("silentScreen.decision_countdown")}
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
              <div className="sds-decision-label">
                {t(`silentScreen.${d.labelKey}`)}
              </div>
              <div className="sds-decision-hint">
                {d.id === "safe" &&
                  t("silentScreen.safe_hint")}
                {d.id === "exam" &&
                  t("silentScreen.exam_hint")}
                {d.id === "emergency" &&
                  t("silentScreen.emergency_hint")}
              </div>
            </button>
          ))}
        </div>

        <div className="sds-summary-box">
          <div className="sds-summary-title">
            {t("silentScreen.summary_title")}
          </div>
          <p className="sds-summary-text">{summaryText()}</p>
        </div>
      </section>
    </div>
  );
}

export default SilentDiagnosisScreen;
