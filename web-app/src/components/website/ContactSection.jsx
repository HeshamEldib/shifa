// src/components/ContactSection.jsx
import React from "react";
import heroImg from "../../assets/hero-illustration.png";
import "./Contact.css";
import { useTranslation } from "react-i18next";

function ContactSection({
  isLoaded,
  onBackClick,
  onLoginClick,
  onAboutClick,
  onSignupClick,
}) {
  const { t, i18n } = useTranslation();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus(t("contact.error_fill_all"));
      return;
    }


    setStatus(t("contact.success_message"));
    setName("");
    setEmail("");
    setMessage("");
  };

  // ضبط اتجاه اللغة على مستوى الصفحة
  const currentLang = i18n.language || "en";
  const isRTL = currentLang.startsWith("ar");

  React.useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [currentLang, isRTL]);

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

      {/* الكونتاكت */}
      <main className="contact-wrapper">
        <div className={`contact-card ${isLoaded ? "fade-in-up" : ""}`}>
          <h2 className="contact-heading">
            {t("contact.title")}{" "}
            <span className="gradient-text">{t("contact.title_us")}</span>
          </h2>

          <p className="contact-lead">
            {t("contact.lead")}
          </p>

          <ul className="contact-highlights">
            <li>{t("contact.highlight_response_time")}</li>
            <li>{t("contact.highlight_support_hours")}</li>
            <li>{t("contact.highlight_emergency")}</li>
          </ul>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row-two">
              <div className="contact-group">
                <label>{t("contact.name")}</label>
                <input
                  type="text"
                  placeholder={t("contact.name_placeholder")}
                  className="contact-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="contact-group">
                <label>{t("contact.email")}</label>
                <input
                  type="email"
                  placeholder={t("contact.email_placeholder")}
                  className="contact-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="contact-group contact-message-group">
              <label>{t("contact.message")}</label>
              <textarea
                rows="5"
                placeholder={t("contact.message_placeholder")}
                className="contact-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="contact-actions">
              <button type="submit" className="btn-primary">
                {t("contact.send")}
              </button>
            </div>

            {status && (
              <p className="contact-status">
                {status}
              </p>
            )}
          </form>

          <footer className="contact-footer">
            <p>{t("contact.footer_copy")}</p>
          </footer>
        </div>
      </main>
    </>
  );
}

export default ContactSection;
