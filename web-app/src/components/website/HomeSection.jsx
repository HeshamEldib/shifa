// src/components/HomeSection.jsx
import React from "react";
import "./Home.css";

import { ArrowRight, Hospital, BriefcaseMedical, Pill } from "lucide-react";
import heroImg from "../../assets/hero-illustration.png";

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
  const isLoggedIn =
    role === "Patient" || role === "Doctor" || role === "Admin";

  

  // Cards navigation logic
  const handleCardClick = (type) => {
    if (!isLoggedIn) {
      onLoginClick();
      return;
    }

    if (type === "consultation") onGoPatient();
    if (type === "booking") onGoAppointments();
    if (type === "prescriptions") onGoPatientPrescriptions();
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
      <nav className={`navbar ${isLoaded ? 'fade-in-down' : ''}`}>
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

        <div className="nav-links desktop-only">
          <a href="#home" className="nav-item">Home</a>
          <button
            type="button"
            className="nav-item"
            onClick={onAboutClick}
          >
            About
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={onContactClick}
          >
            Contact
          </button>
        </div>

        <div className="nav-buttons desktop-only">
          <button className="btn-secondary" onClick={onLoginClick}>
            Login
          </button>
          <button className="btn-primary" onClick={onSignupClick}>
            Sign Up
          </button>
        </div>
      </nav>
      {/* الهيرو */}
      <main id="home" className="hero-section">
        <div className="hero-content">
          <div className={`text-wrapper ${isLoaded ? "fade-in-up" : ""}`}>
            <div className="badge">
              <span>👋 Welcome to Future Healthcare</span>
            </div>

            <h1 className="hero-title">
              Your Health, <br />
              <span className="gradient-text">One Click Away.</span>
            </h1>

            <p className="hero-desc">
              Experience the next generation of medical care. Consult top doctors,
              book appointments, and get prescriptions—all from the comfort of your home.
            </p>

            {/* الأزرار المعدلة */}
            <div className="hero-buttons">
              <button className="btn-primary btn-lg" onClick={onLoginClick}>
                Get Started{" "}
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </button>

              <button
                className="btn-secondary btn-lg"
                onClick={onAboutClick}
              >
                Learn More
              </button>
            </div>

            <div className="hero-badges">
              <span className="hero-badge-chip">24/7 Support</span>
              <span className="hero-badge-chip">Certified Doctors</span>
              <span className="hero-badge-chip">Secure & Private</span>
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
              <h3>Online Consultation</h3>
              <p>
                Connect with specialists via video call instantly anytime, anywhere.
              </p>
            </div>

            <div
              className="feature-card feature-card-center"
              onClick={() => handleCardClick("booking")}
              style={{ cursor: "pointer" }}
            >
              <div className="icon-wrapper color-purple">
                <BriefcaseMedical size={28} />
              </div>
              <h3>Easy Booking</h3>
              <p>
                Schedule appointments in seconds. No waiting lines, no hassle.
              </p>

              <div className="scroll-indicator">
                <span className="scroll-text">Scroll</span>
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
              <h3>Smart Prescriptions</h3>
              <p>
                Digital prescriptions sent directly to your phone or nearest pharmacy.
              </p>
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="footer-logo-svg"
              >
                <path
                  d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50"
                  stroke="url(#footer-logo-gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M20 50 L35 50 L45 30 L55 70 L65 50 L80 50"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="50"
                  y="57"
                  textAnchor="middle"
                  fontSize="30"
                  fontWeight="700"
                  fill="#e5f4ff"
                  className="logo-s-letter"
                >
                  S
                </text>
                <defs>
                  <linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="footer-ecg-text">Shifaa</span>
            </div>

            <p className="footer-desc">
              Smart digital healthcare platform to connect you with trusted doctors anytime, anywhere.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={onAboutClick}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={onContactClick}
                >
                  Contact
                </button>
              </li>
              <li><a href="#home">Services</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li><span>Email: support@shifaa.com</span></li>
              <li><span>Phone: +20 100 000 0000</span></li>
              <li><span>Cairo, Egypt</span></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Stay Updated</h4>
            <p className="footer-desc-small">
              Get health tips and product updates directly to your inbox.
            </p>
            <div className="footer-newsletter">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-input"
              />
              <button className="footer-button">Subscribe</button>
            </div>

            <div className="footer-follow">
              <span className="footer-follow-label">Follow us</span>
              <div className="footer-follow-icons">
                <a href="#facebook" className="footer-social-badge">FB</a>
                <a href="#instagram" className="footer-social-badge">IG</a>
                <a href="#linkedin" className="footer-social-badge">IN</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-ecg-bottom">
          <div className="footer-ecg-links">
            <a href="#home">Home</a>
            <button
              type="button"
              className="footer-link-button"
              onClick={onAboutClick}
            >
              About
            </button>
            <button
              type="button"
              className="footer-link-button"
              onClick={onContactClick}
            >
              Contact
            </button>
          </div>

          <div className="footer-ecg-right">
            <span>© 2026 Shifaa</span>
            <span className="footer-ecg-dot">•</span>
            <a href="#privacy">Privacy</a>
            <span className="footer-ecg-dot">•</span>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomeSection;
