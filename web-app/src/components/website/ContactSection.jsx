// src/components/ContactSection.jsx
import React from "react";
import heroImg from "../../assets/hero-illustration.png";
import "./Contact.css";

function ContactSection({
  isLoaded,
  onBackClick,
  onLoginClick,
  onAboutClick,
  onSignupClick,
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // يمنع ريلود الصفحة

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Please fill in all fields.");
      return;
    }

    // هنا ممكن تبعتي للباك إند بعدين
    console.log("Contact form submitted:", { name, email, message });

    setStatus("Message sent successfully! We will get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
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
        <div className="logo-container" onClick={onBackClick}>
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
          <button
            type="button"
            className="nav-item"
            onClick={onBackClick}
          >
            Home
          </button>
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

      {/* الكونتاكت */}
      <main className="contact-wrapper">
        <div className={`contact-card ${isLoaded ? "fade-in-up" : ""}`}>
          <h2 className="contact-heading">
            Contact <span className="gradient-text">Us</span>
          </h2>

          <p className="contact-lead">
            Tell us what you need help with – appointments, accounts, or
            technical issues – and we’ll reply by email as soon as possible.
          </p>

          <ul className="contact-highlights">
            <li>Typical response time: within 24 hours</li>
            <li>Support hours: 9:00 AM – 10:00 PM Cairo time</li>
            <li>For emergencies, contact local emergency services directly.</li>
          </ul>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row-two">
              <div className="contact-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="contact-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="contact-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="contact-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="contact-group contact-message-group">
              <label>Message</label>
              <textarea
                rows="5"
                placeholder="Write your question or issue in detail..."
                className="contact-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="contact-actions">
              <button type="submit" className="btn-primary">
                Send
              </button>
            </div>

            {status && (
              <p className="contact-status">
                {status}
              </p>
            )}
          </form>

          <footer className="contact-footer">
            <p>© 2026 Shifaa. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </>
  );
}

export default ContactSection;
