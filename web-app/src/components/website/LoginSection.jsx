// src/components/website/LoginSection.jsx - مع Auto-fill
import React, { useState, useRef, useEffect } from "react";  
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImg from "../../assets/hero-illustration.png";
import "./Login.css";

function LoginSection({
  isLoaded,
  onSignupClick,
  onForgotClick,
  onLoginSuccess,
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  //  الـ ref الجديد للإيميل
  const emailRef = useRef(null);

  //  Auto-fill من Forgot Password URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromForgot = urlParams.get('email');
    
    if (emailFromForgot && emailRef.current) {
      setEmail(emailFromForgot);
      emailRef.current.value = emailFromForgot;
      // Focus على password input بعد شوية
      setTimeout(() => {
        const passwordInput = document.getElementById('password');
        passwordInput?.focus();
      }, 300);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("login.error_email_password"));
      return;
    }

    if (password.length < 6) {
      setError(t("login.error_password_length"));
      return;
    }

    setIsSubmitting(true);

    try {
      const demoRole = "Patient";
      const fakeData = {
        token: "DEMO_TOKEN",
        userId: "DEMO_USER",
        role: demoRole,
        expiration: new Date(
          Date.now() + 2 * 60 * 60 * 1000
        ).toISOString(),
        email,
      };

      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: fakeData.token,
          userId: fakeData.userId,
          role: demoRole,
          expiration: fakeData.expiration,
        })
      );

      onLoginSuccess?.({ ...fakeData, role: demoRole });
    } catch (err) {
      setError(t("login.error_generic") || "Login failed, please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

      {/* navbar بسيط: لوجو بس */}
      <nav className={`navbar ${isLoaded ? "fade-in-down" : ""}`}>
        <div className="logo-container">
          <span className="logo-text-main">Shifaa</span>
        </div>
      </nav>

      {/* محتوى صفحة اللوجين */}
      <main className="login-wrapper">
        <div className={`login-card ${isLoaded ? "fade-in-up" : ""}`}>
          <div className="login-header">
            <div className="login-badge">{t("login.welcome")}</div>
            <h1 className="login-title">{t("login.title")}</h1>
            <p className="login-subtitle">{t("login.subtitle")}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">{t("login.email")}</label>
              <input
                ref={emailRef}  
                id="email"
                type="email"
                placeholder="name@example.com"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">{t("login.password")}</label>
              <div
                className={`password-wrapper ${
                  isArabic ? "rtl" : "ltr"
                }`}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="login-input password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-row">
              <button
                type="button"
                className="link-button"
                onClick={onForgotClick}
              >
                {t("login.forgot")}
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary btn-lg login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("login.logging") : t("login.login")}
              {!isSubmitting && (
                <ArrowRight
                  size={18}
                  style={{ marginLeft: "8px" }}
                />
              )}
            </button>
          </form>

          <p className="login-footer-text">
            {t("login.no_account")}{" "}
            <button
              type="button"
              className="link-button"
              onClick={onSignupClick}
            >
              {t("login.signup")}
            </button>
          </p>
        </div>
      </main>
    </>
  );
}

export default LoginSection;
