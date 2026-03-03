// src/components/PatientHome.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Patient.css";

function useScrollDirection() {
  const [dir, setDir] = useState("up");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setDir(delta > 0 ? "down" : "up");
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return dir;
}

function getDayTheme() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  return "night";
}

function RightPanel({ open, title, children, onClose }) {
  return (
    <>
      <div className={`pj-backdrop ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`pj-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="pj-panelHead">
          <div className="pj-panelTitle">{title}</div>
          <button className="pj-x" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </div>
        <div className="pj-panelBody">{children}</div>
      </aside>
    </>
  );
}

function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pj-modalWrap" role="dialog" aria-modal="true">
      <div className="pj-modalBackdrop" onClick={onClose} />
      <div className="pj-modal">
        <div className="pj-modalHead">
          <div className="pj-modalTitle">{title}</div>
          <button className="pj-x" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="pj-modalBody">{children}</div>
      </div>
    </div>
  );
}

/* ============== Top Nav ============== */

function TopNav({
  active = "Home",
  onLogout,
  onOpenAppointments,
  onOpenPrescriptions,
  onOpenSettings,
  onOpenScreenCall,
}) {
  const { t } = useTranslation();

  const items = [
    {
      key: "prescriptions",
      label: t("patient.nav_prescriptions"),
      handler: onOpenPrescriptions,
    },
    {
      key: "screen",
      label: t("patient.nav_screen_call"),
      handler: onOpenScreenCall,
    },
    {
      key: "settings",
      label: t("patient.nav_settings"),
      handler: onOpenSettings,
    },
  ];

  return (
    <nav className="pj-nav-header">
      <div className="pj-navInner pj-navInner--patient">
        <div className="pj-brand">Shifaa</div>

        <div className="pj-navLinks" aria-label="Primary navigation">
          <button
            className={`pj-navBtn ${active === "Home" ? "active" : ""}`}
            type="button"
          >
            {t("patient.nav_home")}
          </button>

          <button
            className="pj-navBtn"
            type="button"
            onClick={onOpenAppointments}
          >
            {t("patient.nav_appointments")}
          </button>

          <div className="pj-more">
            <button className="pj-navBtn pj-moreBtn" type="button">
              {t("patient.nav_more")} ▾
            </button>
            <div className="pj-moreMenu">
              {items.map((item) => (
                <button
                  key={item.key}
                  className="pj-moreItem"
                  type="button"
                  onClick={item.handler}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="pj-navBtn pj-navLogout"
            onClick={onLogout}
          >
            {t("patient.nav_logout")}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ============== Patient Home ============== */

export default function PatientHome({
  onLogout,
  onOpenAppointments,
  onOpenPrescriptions,
  onOpenSettings,
  onOpenScreenCall,
}) {
  const { t } = useTranslation();
  const scrollDir = useScrollDirection();
  const [theme, setTheme] = useState(getDayTheme());

  // تثبيت أن الدور الحالي = مريض
  useEffect(() => {
    localStorage.setItem("role", "Patient");
  }, []);

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const patient = {
    name: "Sara",
    status: t("patient.status_stable"),
    alert: t("patient.alert_none"),
    encouragement: t("patient.encouragement"),
  };

  const todayEvents = [
    {
      type: t("patient.event_appointment_type"),
      time: "8:30 PM",
      title: t("patient.event_appointment_title"),
      tip: t("patient.event_appointment_tip"),
    },
    {
      type: t("patient.event_medication_type"),
      time: "7:00 PM",
      title: t("patient.event_medication_title"),
      tip: t("patient.event_medication_tip"),
    },
    {
      type: t("patient.event_message_type"),
      time: t("patient.event_message_time"),
      title: t("patient.event_message_title"),
      tip: t("patient.event_message_tip"),
    },
  ];

  const journey = [
    {
      id: "past",
      stage: t("patient.journey_stage_past"),
      title: t("patient.journey_past_title"),
      meta: t("patient.journey_past_meta"),
      details: t("patient.journey_past_details"),
    },
    {
      id: "current",
      stage: t("patient.journey_stage_current"),
      title: t("patient.journey_current_title"),
      meta: t("patient.journey_current_meta"),
      details: t("patient.journey_current_details"),
    },
    {
      id: "next",
      stage: t("patient.journey_stage_next"),
      title: t("patient.journey_next_title"),
      meta: t("patient.journey_next_meta"),
      details: t("patient.journey_next_details"),
    },
  ];

  useEffect(() => {
    const tmr = setInterval(() => setTheme(getDayTheme()), 60_000);
    return () => clearInterval(tmr);
  }, []);

  const openDetails = (step) => {
    setActiveStep(step);
    setDetailOpen(true);
  };

  const gradientIntensity =
    theme === "night" ? 0.88 : theme === "day" ? 0.95 : 0.92;
  const lastUpdate = new Date().toLocaleString();

  return (
    <div
      className={`pj-root theme-${theme}`}
      style={{ "--gradIntensity": gradientIntensity }}
    >
      <TopNav
        active="Home"
        onLogout={onLogout}
        onOpenAppointments={onOpenAppointments}
        onOpenPrescriptions={onOpenPrescriptions}
        onOpenSettings={onOpenSettings}
        onOpenScreenCall={onOpenScreenCall}
      />

      <nav className={`pj-nav ${scrollDir === "down" ? "hide" : ""}`}>
        <div className="pj-navInnerSub">
          <div className="pj-navTabs" aria-label="Section navigation">
            <a href="#today">{t("patient.tab_today")}</a>
            <a href="#journey">{t("patient.tab_journey")}</a>
            <a href="#messages">{t("patient.tab_messages")}</a>
          </div>
        </div>
      </nav>

      <header className="pj-hero">
        <div className="pj-heroInner">
          <div className="pj-heroTop">
            <div>
              <div className="pj-h1">
                {t("patient.hero_welcome", { name: patient.name })}
              </div>
              <div className="pj-sub">
                {t("patient.hero_today", {
                  status: patient.status,
                  alert: patient.alert,
                })}
              </div>
              <div className="pj-encourage">{patient.encouragement}</div>
            </div>

            <div className="pj-heroIcons" aria-label="Status shortcuts">
              <button
                type="button"
                className="pj-icon pj-blue"
                onClick={onOpenAppointments}
              >
                <span className="pj-glyph" aria-hidden="true">🗓</span>
                <span className="sr-only">
                  {t("patient.nav_appointments")}
                </span>
              </button>

              <button
                type="button"
                className="pj-icon pj-aqua"
                onClick={onOpenPrescriptions}
              >
                <span className="pj-glyph" aria-hidden="true">💊</span>
                <span className="sr-only">
                  {t("patient.nav_prescriptions")}
                </span>
              </button>
            </div>
          </div>

          <div className="pj-timeline" id="today">
            <div className="pj-timelineTitle">
              {t("patient.today_timeline")}
            </div>

            <div className="pj-timelineRows">
              {todayEvents.map((e, idx) => (
                <div key={idx} className="pj-row">
                  <div className="pj-rowTime">{e.time}</div>
                  <div className="pj-rowBody">
                    <div className="pj-rowTitle">
                      {e.type}: {e.title}
                    </div>
                    <div className="pj-rowTip">{e.tip}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pj-heroActions">
              <button
                className="pj-btn"
                onClick={() => setAssistantOpen(true)}
              >
                {t("patient.btn_open_assistant")}
              </button>
              <button
                className="pj-btn ghost"
                onClick={() => window.location.assign("#journey")}
              >
                {t("patient.btn_continue_journey")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pj-main">
        <section className="pj-section" id="journey">
          <div className="pj-sectionTitle">{t("patient.journey_title")}</div>

          <div className="pj-rail">
            <div className="pj-railLine" aria-hidden="true" />
            {journey.map((s) => (
              <button
                key={s.id}
                className={`pj-step ${
                  s.id === "current" ? "is-current" : ""
                }`}
                onClick={() => openDetails(s)}
                type="button"
              >
                <div className="pj-stepDot" aria-hidden="true" />
                <div className="pj-stepBody">
                  <div className="pj-stepStage">{s.stage}</div>
                  <div className="pj-stepTitle">{s.title}</div>
                  <div className="pj-stepMeta">{s.meta}</div>
                </div>
                <div className="pj-stepHint" aria-hidden="true">
                  {t("patient.journey_view")}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="pj-section" id="messages">
          <div className="pj-sectionTitle">
            {t("patient.messages_title")}
          </div>
          <div className="pj-textBlock">
            <div className="pj-msgTitle">
              {t("patient.messages_clinic_assistant")}
            </div>
            <div className="pj-msgBody">
              {t("patient.messages_body")}
              <span className="pj-msgBodySub">
                {" "}
                {t("patient.messages_body_sub")}
              </span>
            </div>
            <div className="pj-msgMeta">
              {t("patient.messages_meta")}
            </div>
          </div>
        </section>

        <footer className="pj-footer">
          <div>© {new Date().getFullYear()} Shifaa</div>
          <div className="pj-footerHint">
            {t("patient.footer_last_update", { value: lastUpdate })}
          </div>
        </footer>
      </main>

      <button
        className="pj-fab"
        onClick={() => setAssistantOpen(true)}
        aria-label={t("patient.btn_open_assistant")}
      >
        💬
      </button>

      <RightPanel
        open={assistantOpen}
        title={t("patient.assistant_title")}
        onClose={() => setAssistantOpen(false)}
      >
        <div className="pj-panelCard">
          <div className="pj-panelLabel">
            {t("patient.assistant_suggested")}
          </div>
          <button className="pj-panelBtn" type="button">
            {t("patient.assistant_schedule_followup")}
          </button>
          <button className="pj-panelBtn" type="button">
            {t("patient.assistant_set_reminder")}
          </button>
          <button className="pj-panelBtn" type="button">
            {t("patient.assistant_ask_results")}
          </button>
        </div>

        <div className="pj-panelCard">
          <div className="pj-panelLabel">
            {t("patient.assistant_quick_message")}
          </div>
          <textarea
            className="pj-textarea"
            placeholder={t("patient.assistant_quick_placeholder")}
            rows={4}
          />
          <button className="pj-btn" type="button">
            {t("patient.assistant_send")}
          </button>
        </div>
      </RightPanel>

      <Modal
        open={detailOpen}
        title={
          activeStep
            ? t("patient.modal_title", {
                stage: activeStep.stage,
                title: activeStep.title,
              })
            : t("patient.modal_fallback")
        }
        onClose={() => setDetailOpen(false)}
      >
        <div className="pj-modalText">{activeStep?.details}</div>
        <div className="pj-modalActions">
          <button className="pj-btn" onClick={() => setDetailOpen(false)}>
            {t("patient.modal_done")}
          </button>
          <button
            className="pj-btn ghost"
            onClick={() => setAssistantOpen(true)}
          >
            {t("patient.modal_ask_assistant")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
