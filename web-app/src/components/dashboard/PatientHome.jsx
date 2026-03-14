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
      <div
        className={`pj-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
      />
      <aside
        className={`pj-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
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

function TopNav({
  active = "Home",
  onLogout,
  onOpenAppointments,
  onOpenPrescriptions,
  onOpenSettings,
  onOpenScreenCall,
  toast,
  onConfirmLogout,
  clearToast,
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

          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              type="button"
              className="pj-navBtn pj-navLogout"
              onClick={onLogout}
            >
              {t("patient.nav_logout")}
            </button>

            {toast && (
              <div
                style={{
                  marginTop: 4,
                  alignSelf: "flex-end",
                  background:
                    toast.type === "confirm" ? "#7f1d1d" : "#111827",
                  color: "#f9fafb",
                  padding: "6px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                  border:
                    toast.type === "confirm"
                      ? "1px solid rgba(248,113,113,0.9)"
                      : "1px solid rgba(34,197,94,0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  maxWidth: 260,
                }}
              >
                <span>{toast.message}</span>

                {toast.type === "confirm" && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      style={{
                        background: "#ef4444",
                        border: "none",
                        color: "#f9fafb",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                      onClick={onConfirmLogout}
                    >
                      {t("patient.logout_confirm_yes") || "Yes"}
                    </button>

                    <button
                      type="button"
                      style={{
                        background: "transparent",
                        border:
                          "1px solid rgba(148,163,184,0.6)",
                        color: "#e5e7eb",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                      onClick={clearToast}
                    >
                      {t("patient.logout_confirm_no") || "Cancel"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function PatientHome({
  onLogout,
  onOpenAppointments,
  onOpenPrescriptions,
  onOpenSettings,
  onOpenScreenCall,
  patientInfo,
}) {
  const { t } = useTranslation();
  const scrollDir = useScrollDirection();
  const [theme, setTheme] = useState(getDayTheme());

  useEffect(() => {
    localStorage.setItem("role", "Patient");
  }, []);

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState(null);

  const handleLogoutClick = () => {
    setToast({
      type: "confirm",
      message:
        t("patient.logout_confirm") ||
        "Are you sure you want to log out?",
    });
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("patientData");
    localStorage.removeItem("patientSettings");
    localStorage.removeItem("appointmentsData");

    setToast({
      type: "success",
      message:
        t("patient.logout_message") ||
        "You have been logged out successfully",
    });

    setTimeout(() => {
      setToast(null);
      onLogout();
    }, 1500);
  };

  const handleSendAssistantMessage = async () => {
    if (!assistantMessage.trim()) return;

    try {
      setIsSending(true);

      const response = await fetch("/api/patient/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: assistantMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setAssistantMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const patient = {
    name: patientInfo?.name ?? "Sara",
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
        onLogout={handleLogoutClick}
        onOpenAppointments={onOpenAppointments}
        onOpenPrescriptions={onOpenPrescriptions}
        onOpenSettings={onOpenSettings}
        onOpenScreenCall={onOpenScreenCall}
        toast={toast}
        onConfirmLogout={handleConfirmLogout}
        clearToast={() => setToast(null)}
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
                <span className="pj-glyph" aria-hidden="true">
                  🗓
                </span>
                <span className="sr-only">
                  {t("patient.nav_appointments")}
                </span>
              </button>

              <button
                type="button"
                className="pj-icon pj-aqua"
                onClick={onOpenPrescriptions}
              >
                <span className="pj-glyph" aria-hidden="true">
                  💊
                </span>
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
          <div className="pj-sectionTitle">
            {t("patient.journey_title")}
          </div>

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
            value={assistantMessage}
            onChange={(e) => setAssistantMessage(e.target.value)}
          />
          <button
            className="pj-btn"
            type="button"
            onClick={handleSendAssistantMessage}
            disabled={isSending}
          >
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
