// src/components/AboutSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import"./About.css"

function AboutSection({ onBackClick }) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const journeys = useMemo(
    () => ({
      patient: [
        {
          time: "8:30 AM",
          title: "Gentle reminder",
          text: "Ahmed wakes up to a clean reminder for his follow‑up visit. Time, place, and notes are already organized—no searching, no stress.",
        },
        {
          time: "10:15 AM",
          title: "Ready before the visit",
          text: "On the way, he reviews the last summary and saved questions. Everything appears in one calm flow so he arrives prepared.",
        },
        {
          time: "11:00 AM",
          title: "No repeating the whole story",
          text: "At the clinic, his updated info is already available. The visit starts from context, not from zero.",
        },
        {
          time: "11:20 AM",
          title: "Clear next steps",
          text: "After the visit, Ahmed sees a simple plan: what to do next, what changed, and when to return—written clearly.",
        },
        {
          time: "5:30 PM",
          title: "Follow‑up that feels human",
          text: "A gentle check‑in and actionable reminders arrive later. The day feels connected, not fragmented.",
        },
      ],
      doctor: [
        {
          time: "9:00 AM",
          title: "Day overview",
          text: "The doctor opens Shifaa and sees a focused schedule and patient context—who needs what, without noise.",
        },
        {
          time: "10:50 AM",
          title: "Fast context loading",
          text: "Before Ahmed arrives, the doctor reviews history, notes, and relevant updates—so the conversation is more meaningful.",
        },
        {
          time: "11:15 AM",
          title: "Document while you think",
          text: "During the visit, the doctor captures notes and decisions in a structured way—no messy paperwork later.",
        },
        {
          time: "11:25 AM",
          title: "Plan and follow-up",
          text: "Next steps are recorded as a clear plan the patient can actually follow, with fewer misunderstandings.",
        },
        {
          time: "6:00 PM",
          title: "Close the loop",
          text: "Follow‑ups and quick clarifications happen in one place, reducing repeated calls and missing details.",
        },
      ],
    }),
    []
  );

  const [role, setRole] = useState("patient"); // "patient" | "doctor"
  const steps = journeys[role];
  const [active, setActive] = useState(0);

  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [isHovering, setIsHovering] = useState(false);

  // Reset step when switching role
  useEffect(() => {
    setActive(0);
  }, [role]);

  // Autoplay
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!isPlaying) return;
    if (isHovering) return;

    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [isPlaying, isHovering, steps.length, prefersReducedMotion]);

  const progressPct = useMemo(() => {
    if (!steps.length) return 0;
    return ((active + 1) / steps.length) * 100;
  }, [active, steps.length]);

  return (
    <main className="about-page">
      {/* شريط علوي بسيط */}
      <header className="about-header">
        <button className="about-back" onClick={onBackClick}>
          ← Back
        </button>
        <span className="about-header-title">About Shifaa</span>
      </header>

      {/* المحتوى في عمود واحد */}
      <section className="about-content">
        {/* 1) مقدمة */}
        <section className="about-block">
          <p className="about-eyebrow">Our Story</p>
          <h1 className="about-main-title">
            Building a calmer, smarter way to experience healthcare.
          </h1>
          <p className="about-text">
            Shifaa is a digital layer that connects patients, doctors, and
            clinics in one organized space. We focus on simple flows, clear
            communication, and tools that feel natural in everyday care.
          </p>
        </section>

        {/* 2) Why Shifaa */}
        <section className="about-block">
          <h2 className="about-section-heading">Why Shifaa?</h2>
          <div className="about-three-points">
            <div className="about-point">
              <span className="about-point-dot" />
              <div>
                <h3>Clear communication</h3>
                <p>
                  One channel for updates, questions, and follow‑ups between
                  patients and doctors.
                </p>
              </div>
            </div>
            <div className="about-point">
              <span className="about-point-dot" />
              <div>
                <h3>Organized journeys</h3>
                <p>
                  Appointments, files, and notes stay in sync so no one loses
                  context along the way.
                </p>
              </div>
            </div>
            <div className="about-point">
              <span className="about-point-dot" />
              <div>
                <h3>Room for AI</h3>
                <p>
                  Space for safe AI assistance to support decisions, not replace
                  people.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3) Timeline عمودي */}
        <section className="about-block">
          <h2 className="about-section-heading">Journey timeline</h2>
          <div className="about-timeline-vertical">
            <div className="about-timeline-line-vertical" />

            <div className="about-timeline-item">
              <span className="about-timeline-dot-vertical" />
              <div className="about-timeline-body">
                <span className="about-timeline-date">Oct 2025</span>
                <h3>Idea and research</h3>
                <p>
                  Early sketches and interviews with doctors and patients to map
                  the real pain points in daily care.
                </p>
              </div>
            </div>

            <div className="about-timeline-item">
              <span className="about-timeline-dot-vertical" />
              <div className="about-timeline-body">
                <span className="about-timeline-date">Jan 2026</span>
                <h3>Product foundations</h3>
                <p>
                  Designing the core experience: roles, flows, and how each
                  visit feels inside Shifaa.
                </p>
              </div>
            </div>

            <div className="about-timeline-item">
              <span className="about-timeline-dot-vertical" />
              <div className="about-timeline-body">
                <span className="about-timeline-date">Oct 2026</span>
                <h3>First live rollout</h3>
                <p>
                  Bringing Shifaa into clinics, measuring what works, and
                  evolving the product with real data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4) Mission & Vision */}
        <section className="about-block about-block-surface">
          <h2 className="about-section-heading">Mission &amp; vision</h2>
          <p className="about-text">
            <strong>Mission:</strong> to make every medical interaction a bit
            clearer, calmer, and more connected for both patients and
            professionals.
          </p>
          <p className="about-text">
            <strong>Vision:</strong> a health system where digital tools and AI
            quietly support care in the background, so people can focus on being
            human with each other.
          </p>
          <p className="about-quote-line">
            “Imagine a visit where your history, questions, and next steps are
            already in sync when you walk in.”
          </p>
        </section>

        {/* 5) A day with Shifaa – Dynamic stepper */}
        <section
          className="about-block about-journey"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="about-journey-top">
            <div>
              <h2 className="about-section-heading">A day with Shifaa</h2>
              <p className="about-text about-journey-sub">
                Tap a moment to jump, or press Play to watch the story unfold.
              </p>
            </div>

            <div className="about-journey-controls" role="group" aria-label="Journey controls">
              <button
                type="button"
                className={`about-pill ${role === "patient" ? "is-active" : ""}`}
                onClick={() => setRole("patient")}
              >
                Patient view
              </button>
              <button
                type="button"
                className={`about-pill ${role === "doctor" ? "is-active" : ""}`}
                onClick={() => setRole("doctor")}
              >
                Doctor view
              </button>

              <span className="about-divider" />

              <button
                type="button"
                className="about-pill"
                onClick={() => setIsPlaying((v) => !v)}
                disabled={prefersReducedMotion}
                aria-disabled={prefersReducedMotion}
                title={prefersReducedMotion ? "Reduced motion enabled" : "Play / Pause"}
              >
                {prefersReducedMotion ? "Motion off" : isPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="about-stepper" role="tablist" aria-label="Day steps">
            {steps.map((s, idx) => (
              <button
                key={`${role}-${s.time}-${idx}`}
                type="button"
                className={`about-step ${idx === active ? "is-active" : ""}`}
                onClick={() => setActive(idx)}
                role="tab"
                aria-selected={idx === active}
              >
                <span className="about-step-dot" />
                <span className="about-step-time">{s.time}</span>
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="about-journey-card" role="region" aria-live="polite">
            <div className="about-journey-card-head">
              <span className="about-journey-kicker">
                {role === "patient" ? "Patient moment" : "Doctor moment"} • Step{" "}
                {active + 1}/{steps.length}
              </span>
              <h3 className="about-journey-title">{steps[active].title}</h3>
            </div>
            <p className="about-text">{steps[active].text}</p>

            <div className="about-progress" aria-label="Story progress">
              <div
                className="about-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* 6) Team */}
        <section className="about-block">
          <h2 className="about-section-heading">The team behind Shifaa</h2>
          <ul className="about-team-list">
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">Youssef</span>
                <span className="about-team-role">Data Analyst</span>
              </div>
            </li>
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">Hesham &amp; Mohamed</span>
                <span className="about-team-role">Backend Developers</span>
              </div>
            </li>
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">Samaa</span>
                <span className="about-team-role">Frontend Developer</span>
              </div>
            </li>
            
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">Faculty of Science</span>
                <span className="about-team-role">
                  Fayoum University – Mathematics &amp; Computer Science
                </span>
              </div>
            </li>
          </ul>
        </section>
      </section>
    </main>
  );
}

export default AboutSection;
