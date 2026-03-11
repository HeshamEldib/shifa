// src/components/HomeSection.jsx
import React, { useState } from "react";
import "./Home.css";
import { ArrowRight, Hospital, BriefcaseMedical, Pill, Menu, X } from "lucide-react";
import heroImg from "../../assets/hero-illustration.png";
import { useTranslation } from "react-i18next";

function HomeSection({
  isLoaded,
  onLoginClick,
  onContactClick,
  onAboutClick,
  onSignupClick,
  onGoPatient,
  onGoAppointments,
  onGoPatientPrescriptions,
  role,
}) {
  const { t } = useTranslation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isLoggedIn =
    role === "Patient" || role === "Doctor" || role === "Admin";

  const handleCardClick = (type) => {
    if (!isLoggedIn) {
      onLoginClick();
      return;
    }

    if (type === "consultation") onGoPatient();
    if (type === "booking") onGoAppointments();
    if (type === "prescriptions") onGoPatientPrescriptions();
  };

  const handleNavLinkClick = (callback) => {
    if (callback) callback();
    setIsMobileNavOpen(false);
  };

  return (
    <>
      {/* الخلفية */}
      <div className="background-wrapper">
        <div
          className="bg-image"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="bg-overlay"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      {/* الهيدر */}
      <nav className={`navbar ${isLoaded ? "fade-in-down" : ""}`}>
        <div className="navbar-left">
          <div className="logo-container">
            <svg
              width="52"
              height="52"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="team-logo-svg"
            >
              <path
                d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50"
                stroke="url(#logo-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M20 50 L35 50 L45 30 L55 70 L65 50 L80 50"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pulse-path"
              />
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fontSize="36"
                fontWeight="700"
                fill="#e5f4ff"
                className="logo-s-letter"
              >
                S
              </text>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>

            <span className="logo-text-main">Shifaa</span>
          </div>
        </div>

        {/* روابط الديسكتوب */}
        <div className="nav-links desktop-only">
          <a href="#home" className="nav-item">
            {t("navbar.home")}
          </a>
          <button
            type="button"
            className="nav-item"
            onClick={onAboutClick}
          >
            {t("navbar.about")}
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={onContactClick}
          >
            {t("navbar.contact")}
          </button>
        </div>

        <div className="nav-buttons desktop-only">
          <button className="btn-secondary" onClick={onLoginClick}>
            {t("navbar.login")}
          </button>
          <button className="btn-primary" onClick={onSignupClick}>
            {t("navbar.signup")}
          </button>
        </div>

        {/* زرار الموبايل */}
        <button
          type="button"
          className="mobile-menu-toggle mobile-only"
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* منيو الموبايل */}
        <div
          className={`mobile-nav-panel mobile-only ${
            isMobileNavOpen ? "open" : ""
          }`}
        >
          <a
            href="#home"
            className="mobile-nav-item"
            onClick={() => setIsMobileNavOpen(false)}
          >
            {t("navbar.home")}
          </a>
          <button
            type="button"
            className="mobile-nav-item"
            onClick={() => handleNavLinkClick(onAboutClick)}
          >
            {t("navbar.about")}
          </button>
          <button
            type="button"
            className="mobile-nav-item"
            onClick={() => handleNavLinkClick(onContactClick)}
          >
            {t("navbar.contact")}
          </button>

          <div className="mobile-nav-divider" />

          <button
            type="button"
            className="mobile-nav-btn secondary"
            onClick={() => handleNavLinkClick(onLoginClick)}
          >
            {t("navbar.login")}
          </button>
          <button
            type="button"
            className="mobile-nav-btn primary"
            onClick={() => handleNavLinkClick(onSignupClick)}
          >
            {t("navbar.signup")}
          </button>
        </div>
      </nav>

      {/* الهيرو */}
      <main id="home" className="hero-section">
        <div className="hero-content">
          <div className={`text-wrapper ${isLoaded ? "fade-in-up" : ""}`}>
            <div className="badge">
              <span>{t("home.badge")}</span>
            </div>

            <h1 className="hero-title">
              {t("home.title_line1")}
              <br />
              <span className="gradient-text">{t("home.title_line2")}</span>
            </h1>

            <p className="hero-desc">
              {t("home.subtitle")}
            </p>

            <div className="hero-buttons">
              <button className="btn-primary btn-lg" onClick={onLoginClick}>
                {t("home.cta_get_started")}{" "}
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </button>

              <button
                className="btn-secondary btn-lg"
                onClick={onAboutClick}
              >
                {t("home.cta_learn_more")}
              </button>
            </div>

            <div className="hero-badges">
              <span className="hero-badge-chip">
                {t("home.badge_support")}
              </span>
              <span className="hero-badge-chip">
                {t("home.badge_doctors")}
              </span>
              <span className="hero-badge-chip">
                {t("home.badge_secure")}
              </span>
            </div>
          </div>

          {/* الكروت */}
          <div className={`cards-grid ${isLoaded ? "fade-in-up-delay" : ""}`}>
            <div
              className="feature-card"
              onClick={() => handleCardClick("consultation")}
              style={{ cursor: "pointer" }}
            >
              <div className="icon-wrapper color-cyan">
                <Hospital size={28} />
              </div>
              <h3>{t("home.card_consultation_title")}</h3>
              <p>{t("home.card_consultation_text")}</p>
            </div>

            <div
              className="feature-card feature-card-center"
              onClick={() => handleCardClick("booking")}
              style={{ cursor: "pointer" }}
            >
              <div className="icon-wrapper color-purple">
                <BriefcaseMedical size={28} />
              </div>
              <h3>{t("home.card_booking_title")}</h3>
              <p>{t("home.card_booking_text")}</p>

              <div className="scroll-indicator">
                <span className="scroll-text">{t("home.scroll")}</span>
                <span className="scroll-arrow">▾</span>
              </div>
            </div>

            <div
              className="feature-card"
              onClick={() => handleCardClick("prescriptions")}
              style={{ cursor: "pointer" }}
            >
              <div className="icon-wrapper color-blue">
                <Pill size={28} />
              </div>
              <h3>{t("home.card_prescriptions_title")}</h3>
              <p>{t("home.card_prescriptions_text")}</p>
            </div>
          </div>
        </div>
      </main>

      {/* الفوتر */}
      <footer className="footer-ecg">
        <div className="footer-divider-line"></div>

        <div className="footer-inner">
          <div className="footer-column">
            <div className="footer-ecg-logo">
              {/* تقدر هنا تحط نفس الـ SVG بتاع اللوجو لو حابب */}
              <span className="footer-ecg-text">Shifaa</span>
            </div>

            <p className="footer-desc">
              {t("home.footer_desc")}
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">{t("home.footer_quick_links")}</h4>
            <ul className="footer-links">
              <li>
                <a href="#home">{t("navbar.home")}</a>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={onAboutClick}
                >
                  {t("navbar.about")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={onContactClick}
                >
                  {t("navbar.contact")}
                </button>
              </li>
              <li>
                <a href="#home">{t("home.footer_services")}</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">{t("home.footer_contact_title")}</h4>
            <ul className="footer-links">
              <li>
                <span>{t("home.footer_contact_email")}</span>
              </li>
              <li>
                <span>{t("home.footer_contact_phone")}</span>
              </li>
              <li>
                <span>{t("home.footer_contact_location")}</span>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">{t("home.footer_stay_updated")}</h4>
            <p className="footer-desc-small">
              {t("home.footer_newsletter_text")}
            </p>
            <div className="footer-newsletter">
              <input
                type="email"
                placeholder={t("home.footer_newsletter_placeholder")}
                className="footer-input"
              />
              <button className="footer-button">
                {t("home.footer_newsletter_button")}
              </button>
            </div>

            <div className="footer-follow">
              <span className="footer-follow-label">
                {t("home.footer_follow_us")}
              </span>
              <div className="footer-follow-icons">
                <a href="#facebook" className="footer-social-badge">
                  FB
                </a>
                <a href="#instagram" className="footer-social-badge">
                  IG
                </a>
                <a href="#linkedin" className="footer-social-badge">
                  IN
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-ecg-bottom">
          <div className="footer-ecg-links">
            <a href="#home">{t("navbar.home")}</a>
            <button
              type="button"
              className="footer-link-button"
              onClick={onAboutClick}
            >
              {t("navbar.about")}
            </button>
            <button
              type="button"
              className="footer-link-button"
              onClick={onContactClick}
            >
              {t("navbar.contact")}
            </button>
          </div>

          <div className="footer-ecg-right">
            <span>{t("home.footer_copy")}</span>
            <span className="footer-ecg-dot">•</span>
            <a href="#privacy">{t("home.footer_privacy")}</a>
            <span className="footer-ecg-dot">•</span>
            <a href="#terms">{t("home.footer_terms")}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomeSection;
