// src/components/AboutSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./About.css";

function AboutSection({ onBackClick }) {
  const { t } = useTranslation();

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const journeys = useMemo(
    () => ({
      patient: [
        {
          time: "8:30 AM",
          title: t("about.patient_1_title"),
          text: t("about.patient_1_text"),
        },
        {
          time: "10:15 AM",
          title: t("about.patient_2_title"),
          text: t("about.patient_2_text"),
        },
        {
          time: "11:00 AM",
          title: t("about.patient_3_title"),
          text: t("about.patient_3_text"),
        },
        {
          time: "11:20 AM",
          title: t("about.patient_4_title"),
          text: t("about.patient_4_text"),
        },
        {
          time: "5:30 PM",
          title: t("about.patient_5_title"),
          text: t("about.patient_5_text"),
        },
      ],
      doctor: [
        {
          time: "9:00 AM",
          title: t("about.doctor_1_title"),
          text: t("about.doctor_1_text"),
        },
        {
          time: "10:50 AM",
          title: t("about.doctor_2_title"),
          text: t("about.doctor_2_text"),
        },
        {
          time: "11:15 AM",
          title: t("about.doctor_3_title"),
          text: t("about.doctor_3_text"),
        },
        {
          time: "11:25 AM",
          title: t("about.doctor_4_title"),
          text: t("about.doctor_4_text"),
        },
        {
          time: "6:00 PM",
          title: t("about.doctor_5_title"),
          text: t("about.doctor_5_text"),
        },
      ],
    }),
    [t]
  );

  const [role, setRole] = useState("patient");
  const steps = journeys[role];
  const [active, setActive] = useState(0);

  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [role]);

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
      <header className="about-header">
        <button className="about-back" onClick={onBackClick}>
          ← {t("about.back")}
        </button>
        <span className="about-header-title">
          {t("about.header_title")}
        </span>
      </header>

      <section className="about-content">
        <section className="about-block">
          <p className="about-eyebrow">{t("about.our_story")}</p>
          <h1 className="about-main-title">
            {t("about.main_title")}
          </h1>
          <p className="about-text">{t("about.main_text")}</p>
        </section>

        <section className="about-block">
          <h2 className="about-section-heading">
            {t("about.why_title")}
          </h2>
          <div className="about-three-points">
            <div className="about-point">
              <span className="about-point-dot" />
              <div>
                <h3>{t("about.why_point1_title")}</h3>
                <p>{t("about.why_point1_text")}</p>
              </div>
            </div>
            <div className="about-point">
              <span className="about-point-dot" />
              <div>
                <h3>{t("about.why_point2_title")}</h3>
                <p>{t("about.why_point2_text")}</p>
              </div>
            </div>
            <div className="about-point">
              <span className="about-point-dot" />
              <div>
                <h3>{t("about.why_point3_title")}</h3>
                <p>{t("about.why_point3_text")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-block">
          <h2 className="about-section-heading">
            {t("about.timeline_title")}
          </h2>
          <div className="about-timeline-vertical">
            <div className="about-timeline-line-vertical" />

            <div className="about-timeline-item">
              <span className="about-timeline-dot-vertical" />
              <div className="about-timeline-body">
                <span className="about-timeline-date">
                  {t("about.timeline_1_date")}
                </span>
                <h3>{t("about.timeline_1_title")}</h3>
                <p>{t("about.timeline_1_text")}</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <span className="about-timeline-dot-vertical" />
              <div className="about-timeline-body">
                <span className="about-timeline-date">
                  {t("about.timeline_2_date")}
                </span>
                <h3>{t("about.timeline_2_title")}</h3>
                <p>{t("about.timeline_2_text")}</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <span className="about-timeline-dot-vertical" />
              <div className="about-timeline-body">
                <span className="about-timeline-date">
                  {t("about.timeline_3_date")}
                </span>
                <h3>{t("about.timeline_3_title")}</h3>
                <p>{t("about.timeline_3_text")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-block about-block-surface">
          <h2 className="about-section-heading">
            {t("about.mission_title")}
          </h2>
          <p className="about-text">
            <strong>{t("about.mission_label")}</strong>
            {t("about.mission_text")}
          </p>
          <p className="about-text">
            <strong>{t("about.vision_label")}</strong>
            {t("about.vision_text")}
          </p>
          <p className="about-quote-line">
            {t("about.quote")}
          </p>
        </section>

        <section
          className="about-block about-journey"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="about-journey-top">
            <div>
              <h2 className="about-section-heading">
                {t("about.day_title")}
              </h2>
              <p className="about-text about-journey-sub">
                {t("about.day_sub")}
              </p>
            </div>

            <div
              className="about-journey-controls"
              role="group"
              aria-label={t("about.day_controls_label")}
            >
              <button
                type="button"
                className={`about-pill ${
                  role === "patient" ? "is-active" : ""
                }`}
                onClick={() => setRole("patient")}
              >
                {t("about.day_patient_view")}
              </button>
              <button
                type="button"
                className={`about-pill ${
                  role === "doctor" ? "is-active" : ""
                }`}
                onClick={() => setRole("doctor")}
              >
                {t("about.day_doctor_view")}
              </button>

              <span className="about-divider" />

              <button
                type="button"
                className="about-pill"
                onClick={() => setIsPlaying((v) => !v)}
                disabled={prefersReducedMotion}
                aria-disabled={prefersReducedMotion}
                title={
                  prefersReducedMotion
                    ? t("about.motion_off_title")
                    : t("about.motion_on_title")
                }
              >
                {prefersReducedMotion
                  ? t("about.motion_off")
                  : isPlaying
                  ? t("about.motion_pause")
                  : t("about.motion_play")}
              </button>
            </div>
          </div>

          <div
            className="about-stepper"
            role="tablist"
            aria-label={t("about.day_steps_label")}
          >
            {steps.map((s, idx) => (
              <button
                key={`${role}-${s.time}-${idx}`}
                type="button"
                className={`about-step ${
                  idx === active ? "is-active" : ""
                }`}
                onClick={() => setActive(idx)}
                role="tab"
                aria-selected={idx === active}
              >
                <span className="about-step-dot" />
                <span className="about-step-time">{s.time}</span>
              </button>
            ))}
          </div>

          <div
            className="about-journey-card"
            role="region"
            aria-live="polite"
          >
            <div className="about-journey-card-head">
              <span className="about-journey-kicker">
                {role === "patient"
                  ? t("about.day_patient_moment")
                  : t("about.day_doctor_moment")}
                {" • "}
                {t("about.day_step_counter", {
                  current: active + 1,
                  total: steps.length,
                })}
              </span>
              <h3 className="about-journey-title">
                {steps[active].title}
              </h3>
            </div>
            <p className="about-text">{steps[active].text}</p>

            <div
              className="about-progress"
              aria-label={t("about.day_progress_label")}
            >
              <div
                className="about-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </section>

        <section className="about-block">
          <h2 className="about-section-heading">
            {t("about.team_title")}
          </h2>
          <ul className="about-team-list">
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">
                  {t("about.team_youssef_name")}
                </span>
                <span className="about-team-role">
                  {t("about.team_youssef_role")}
                </span>
              </div>
            </li>
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">
                  {t("about.team_hesham_mohamed_name")}
                </span>
                <span className="about-team-role">
                  {t("about.team_hesham_mohamed_role")}
                </span>
              </div>
            </li>
            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">
                  {t("about.team_samaa_name")}
                </span>
                <span className="about-team-role">
                  {t("about.team_samaa_role")}
                </span>
              </div>
            </li>

            <li className="about-team-item">
              <span className="about-avatar" />
              <div>
                <span className="about-team-name">
                  {t("about.team_faculty_name")}
                </span>
                <span className="about-team-role">
                  {t("about.team_faculty_role")}
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
