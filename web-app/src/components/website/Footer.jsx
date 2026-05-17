import React from "react";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import "./Footer.css";

function Footer({ onAboutClick, onContactClick, onGoAllServices }) {
  const { t } = useTranslation();

  return (
      <footer className="footer-midnight-section reveal-on-scroll delay-1">
        <div className="container-inner">
          <div className="footer-blue-grid">
            <div className="footer-brand-info">
             <div className="navbar-brand">
                      <div className="logo-icon-neon">S</div>
                      <span className="logo-text">{t("footer.brand")}</span>
                    </div>
              <p className="footer-blue-desc">{t("footer.desc")}</p>
            </div>

            <div className="footer-links-list">
              <h4>{t("footer.quickLinks")}</h4>
              <button onClick={onAboutClick}>{t("footer.about")}</button>
              <button onClick={onContactClick}>{t("footer.contact")}</button>
              <button onClick={onGoAllServices}>{t("footer.services")}</button>
            </div>

            <div className="footer-links-list">
              <h4>{t("footer.contactTitle")}</h4>
              <span>{t("footer.email", "info@shifaa.com")}</span>
              <span>{t("footer.phone", "+20 123 456 7890")}</span>
              <span>{t("footer.location")}</span>
            </div>

            <div className="footer-newsletter-box">
              <h4>{t("footer.newsletterTitle")}</h4>

              <div className="newsletter-blue-input">
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                />
                <button>{t("footer.subscribe")}</button>
              </div>

              <div className="social-blue-icons">
                <a href="#fb">
                  <Facebook size={20} />
                </a>
                <a href="#ig">
                  <Instagram size={20} />
                </a>
                <a href="#in">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-blue-bottom">
            <div className="copyright-full-text">
              {t("footer.copyright", {
                year: new Date().getFullYear(),
                defaultValue: `© ${new Date().getFullYear()} شفاء`,
              })}
            </div>

            <div className="footer-legal-links">
              <a href="#privacy">{t("footer.privacy")}</a>
              <a href="#terms">{t("footer.terms")}</a>
            </div>
          </div>
        </div>
      </footer>
  );
}

export default Footer;