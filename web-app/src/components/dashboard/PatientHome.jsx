// src/components/PatientHome.jsx
import React, { useEffect, useRef, useState } from "react";
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
  const moreItems = ["Prescriptions", "Screen call", "Settings"];

  const onMoreClick = (t) => {
    if (t === "Prescriptions") return onOpenPrescriptions;
    if (t === "Settings") return onOpenSettings;
    if (t === "Screen call") return onOpenScreenCall;
    return undefined;
  };

  return (
    <nav className="pj-nav-header">
      <div className="pj-navInner pj-navInner--patient">
        <div className="pj-brand">Shifaa</div>

        <div className="pj-navLinks" aria-label="Primary navigation">
          <button
            className={`pj-navBtn ${active === "Home" ? "active" : ""}`}
            type="button"
          >
            Home
          </button>

          <button
            className="pj-navBtn"
            type="button"
            onClick={onOpenAppointments}
          >
            My appointments
          </button>

          {/* مفيش زر Messages هنا */}

          <div className="pj-more">
            <button className="pj-navBtn pj-moreBtn" type="button">
              More ▾
            </button>
            <div className="pj-moreMenu">
              {moreItems.map((t) => (
                <button
                  key={t}
                  className="pj-moreItem"
                  type="button"
                  onClick={onMoreClick(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="pj-navBtn pj-navLogout"
            onClick={onLogout}
          >
            Logout
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
  const scrollDir = useScrollDirection();
  const [theme, setTheme] = useState(getDayTheme());

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const patient = {
    name: "Sara",
    status: "Stable",
    alert: "No urgent alerts",
    encouragement: "You’re on track. Keep going.",
  };

  const todayEvents = [
    {
      type: "Appointment",
      time: "8:30 PM",
      title: "Dr. Ahmed Hassan (Internal Medicine)",
      tip: "Shifaa Clinic · 2nd floor",
    },
    {
      type: "Medication",
      time: "7:00 PM",
      title: "Metformin 500mg",
      tip: "With food",
    },
    {
      type: "Message",
      time: "2 days ago",
      title: "Clinic assistant",
      tip: "Results look good.",
    },
  ];

  const journey = [
    {
      id: "past",
      stage: "Past",
      title: "Lab check completed",
      meta: "1 month ago",
      details:
        "Labs were completed successfully. Keep tracking symptoms and follow the care plan.",
    },
    {
      id: "current",
      stage: "Current",
      title: "This week focus",
      meta: "Hydration · 20 min walk · Adherence",
      details:
        "Focus on daily habits. If you miss a dose, check your plan or ask the assistant.",
    },
    {
      id: "next",
      stage: "Next",
      title: "Upcoming appointment",
      meta: "Saturday · 8:30 PM",
      details:
        "Bring your latest questions. Try to arrive 10 minutes early.",
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setTheme(getDayTheme()), 60_000);
    return () => clearInterval(t);
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
            <a href="#today">Today</a>
            <a href="#journey">Journey</a>
            <a href="#messages">Messages</a>
          </div>
        </div>
      </nav>

      <header className="pj-hero">
        <div className="pj-heroInner">
          <div className="pj-heroTop">
            <div>
              <div className="pj-h1">Welcome back, {patient.name}</div>
              <div className="pj-sub">
                Today: {patient.status} · {patient.alert}
              </div>
              <div className="pj-encourage">{patient.encouragement}</div>
            </div>

            {/* أيقونتين بس ومرتبطين بالصفحات */}
            <div className="pj-heroIcons" aria-label="Status shortcuts">
              <button
                type="button"
                className="pj-icon pj-blue"
                onClick={onOpenAppointments}
              >
                <span className="pj-glyph" aria-hidden="true">
                  🗓
                </span>
                <span className="sr-only">Appointments</span>
              </button>

              <button
                type="button"
                className="pj-icon pj-aqua"
                onClick={onOpenPrescriptions}
              >
                <span className="pj-glyph" aria-hidden="true">
                  💊
                </span>
                <span className="sr-only">Prescriptions</span>
              </button>
            </div>
          </div>

          <div className="pj-timeline" id="today">
            <div className="pj-timelineTitle">Today timeline</div>

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
              <button className="pj-btn" onClick={() => setAssistantOpen(true)}>
                Open smart assistant
              </button>
              <button
                className="pj-btn ghost"
                onClick={() => window.location.assign("#journey")}
              >
                Continue your journey
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pj-main">
        <section className="pj-section" id="journey">
          <div className="pj-sectionTitle">Your journey</div>

          <div className="pj-rail">
            <div className="pj-railLine" aria-hidden="true" />
            {journey.map((s) => (
              <button
                key={s.id}
                className={`pj-step ${s.id === "current" ? "is-current" : ""}`}
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
                  View
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="pj-section" id="messages">
          <div className="pj-sectionTitle">Messages</div>
          <div className="pj-textBlock">
            <div className="pj-msgTitle">Clinic assistant</div>
            <div className="pj-msgBody">
              Your last results look good.
              <span className="pj-msgBodySub"> Keep following the plan.</span>
            </div>
            <div className="pj-msgMeta">2 days ago</div>
          </div>
        </section>

        <footer className="pj-footer">
          <div>© {new Date().getFullYear()} Shifaa</div>
          <div className="pj-footerHint">Last update: {lastUpdate}</div>
        </footer>
      </main>

      <button
        className="pj-fab"
        onClick={() => setAssistantOpen(true)}
        aria-label="Open smart assistant"
      >
        💬
      </button>

      <RightPanel
        open={assistantOpen}
        title="Smart assistant"
        onClose={() => setAssistantOpen(false)}
      >
        <div className="pj-panelCard">
          <div className="pj-panelLabel">Suggested actions</div>
          <button className="pj-panelBtn" type="button">
            Schedule a follow-up
          </button>
          <button className="pj-panelBtn" type="button">
            Set medication reminder
          </button>
          <button className="pj-panelBtn" type="button">
            Ask about my results
          </button>
        </div>

        <div className="pj-panelCard">
          <div className="pj-panelLabel">Quick message</div>
          <textarea
            className="pj-textarea"
            placeholder="Type your question..."
            rows={4}
          />
          <button className="pj-btn" type="button">
            Send
          </button>
        </div>
      </RightPanel>

      <Modal
        open={detailOpen}
        title={activeStep ? `${activeStep.stage}: ${activeStep.title}` : "Details"}
        onClose={() => setDetailOpen(false)}
      >
        <div className="pj-modalText">{activeStep?.details}</div>
        <div className="pj-modalActions">
          <button className="pj-btn" onClick={() => setDetailOpen(false)}>
            Done
          </button>
          <button className="pj-btn ghost" onClick={() => setAssistantOpen(true)}>
            Ask assistant
          </button>
        </div>
      </Modal>
    </div>
  );
}
