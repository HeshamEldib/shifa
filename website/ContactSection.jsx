// src/components/ContactSection.jsx
import React from "react";
import heroImg from "../../assets/hero-illustration.png";

function ContactSection({
  isLoaded,
  onBackClick,
  onLoginClick,
  onAboutClick,
  onSignupClick,
}) {

  /* =========================
     Contact Form State
  ========================== */
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email.includes("@") || !form.message) {
      setStatus("Please fill in all fields with a valid email.");
      return;
    }

    setStatus(
      "Thanks, we received your message. We will reply by email."
    );

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  /* =========================
     Privacy & Terms State
  ========================== */
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);

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

      {/* Navbar */}
      <nav className={`navbar ${isLoaded ? "fade-in-down" : ""}`}>
        <div className="logo-container" onClick={onBackClick}>
          <span className="logo-text-main">Shifaa</span>
        </div>

        <div className="nav-links desktop-only">
          <button className="nav-item" onClick={onBackClick}>
            Home
          </button>
          <button className="nav-item" onClick={onAboutClick}>
            About
          </button>
          <button className="nav-item">
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

      {/* Contact Section */}
      <main className="contact-wrapper">
        <div className={`contact-card ${isLoaded ? "fade-in-up" : ""}`}>
          <h2 className="contact-heading">
            Contact <span className="gradient-text">Us</span>
          </h2>

          <p className="contact-lead">
            Tell us what you need help with – appointments, accounts, or
            technical issues – and we’ll reply by email as soon as possible.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row-two">
              <div className="contact-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="contact-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="contact-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="contact-input"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="contact-group contact-message-group">
              <label>Message</label>
              <textarea
                rows="5"
                placeholder="Write your question or issue in detail..."
                className="contact-textarea"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </div>

            <div className="contact-actions">
              <button type="submit" className="btn-primary">
                Send
              </button>
            </div>
          </form>

          {status && <p className="contact-status">{status}</p>}

          {/* Footer */}
          <footer className="footer-ecg">
            <span>© 2026 Shifaa</span>
            <span className="footer-ecg-dot">•</span>
            <button
              className="footer-link-button"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy
            </button>
            <span className="footer-ecg-dot">•</span>
            <button
              className="footer-link-button"
              onClick={() => setShowTerms(true)}
            >
              Terms
            </button>
          </footer>
        </div>
      </main>

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="simple-modal">
          <div className="simple-modal-content">
            <h3>Privacy Policy</h3>
            <p>
              We collect personal data such as name and email to provide
              healthcare support services. All information is securely
              stored and protected.
            </p>
            <button onClick={() => setShowPrivacy(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="simple-modal">
          <div className="simple-modal-content">
            <h3>Terms of Use</h3>
            <p>
              Shifaa is not a replacement for emergency services.
              By using this platform, you agree to provide accurate
              information and follow usage guidelines.
            </p>
            <button onClick={() => setShowTerms(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactSection;
