// src/components/website/SignUpSection.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import heroImg from "../../assets/hero-illustration.png";
import "./SignUp.css";
import { authService } from "../../services/authService";

function passwordStrength(pw) {
  if (!pw) return { label: "Weak", score: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", score: 1 };
  if (score === 2) return { label: "Medium", score: 2 };
  return { label: "Strong", score: 3 };
}

function SignUpSection({ isLoaded, onLoginClick, onSignupSuccess }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";

  const [showPw, setShowPw] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [submitState, setSubmitState] = useState("idle");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
    country: "Egypt",
    agree: false,
  });

  const [touched, setTouched] = useState({});

  const countries = useMemo(
    () => ["Egypt", "Saudi Arabia", "UAE", "Jordan", "Kuwait"],
    []
  );

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const pw = passwordStrength(form.password);

  const errors = useMemo(() => {
    const e = {};

    if (!form.fullName.trim())
      e.fullName = t("signup.full_name_required", {
        defaultValue: "Full name is required.",
      });

    if (!form.email.trim())
      e.email = t("signup.email_required", {
        defaultValue: "Email is required.",
      });
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = t("signup.email_invalid", {
        defaultValue: "Enter a valid email address.",
      });

    if (!form.password)
      e.password = t("signup.password_required", {
        defaultValue: "Password is required.",
      });
    else if (form.password.length < 8)
      e.password = t("signup.password_min", {
        defaultValue: "Password must be at least 8 characters.",
      });

    if (!form.phone.trim())
      e.phone = t("signup.phone_required", {
        defaultValue: "Phone number is required.",
      });
      
    if (!form.gender)
      e.gender = t("signup.gender_required", {
        defaultValue: "Gender is required.",
      });
      
    if (!form.age)
      e.age = t("signup.age_required", {
        defaultValue: "Age is required.",
      });
    else if (Number(form.age) < 1 || Number(form.age) > 120)
      e.age = t("signup.age_invalid", {
        defaultValue: "Enter a valid age.",
      });
      
    if (!form.country)
      e.country = t("signup.country_required", {
        defaultValue: "Country is required.",
      });
      
    if (!form.agree)
      e.agree = t("signup.agree_required", {
        defaultValue: "You must agree to Terms & Privacy Policy.",
      });

    return e;
  }, [form, t]);

  const canSubmit = () => {
    return !Object.keys(errors).length;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched((p) => ({
      ...p,
      fullName: true,
      email: true,
      password: true,
      phone: true,
      gender: true,
      age: true,
      country: true,
      agree: true,
    }));
    
    if (!canSubmit()) return;

    setSubmitState("loading");

    try {
      const data = await authService.register(form, "Patient");

      setSubmitState("success");
      
      if (typeof onSignupSuccess === "function") {
        onSignupSuccess({ role: "Patient", token: data.token, userId: data.userId });
      }
    } catch (err) {
      setSubmitState("idle");
    }
  };

  const handleSocialClick = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      // TODO: Integrate with your backend OAuth
      // console.log(`Social signup with ${provider} clicked`);
    }, 700);
  };

  const showError = (name) => touched[name] && errors[name];
  const validMark = (name) => touched[name] && !errors[name] && form[name];

  const renderFieldStatus = (name) => {
    if (showError(name))
      return (
        <span
          className={`su-status ${isArabic ? "rtl" : "ltr"} su-bad`}
        >
          ✖
        </span>
      );
    if (validMark(name))
      return (
        <span
          className={`su-status ${isArabic ? "rtl" : "ltr"} su-good`}
        >
          ✔
        </span>
      );
    return null;
  };

  return (
    <>
      <div className="su-split-bg">
        <div className="su-left-bg">
          <div className="su-left-grad" />
          <div
            className="su-left-illustration"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
        </div>
        <div className="su-right-bg" />
      </div>

      <main className="su-page">
        <section className={`su-left ${isLoaded ? "fade-in-up" : ""}`}>
          <div className="su-brand">
            <span className="su-brand-mark">+</span>
            <span className="su-brand-text">Shifaa</span>
          </div>

          <h1 className="su-left-title">
            {t("signup.left_title")}
          </h1>
          <p className="su-left-sub">
            {t("signup.left_sub")}
          </p>

          <div className="su-left-points">
            <div className="su-left-point">
              <span className="su-dot" />
              <span>{t("signup.point_1")}</span>
            </div>
            <div className="su-left-point">
              <span className="su-dot" />
              <span>{t("signup.point_2")}</span>
            </div>
            <div className="su-left-point">
              <span className="su-dot" />
              <span>{t("signup.point_3")}</span>
            </div>
          </div>
        </section>

        <section className={`su-right ${isLoaded ? "fade-in-up" : ""}`}>
          <div className="su-form-shell">
            <div className="su-social">
              <button
                type="button"
                className="su-social-btn su-social-google"
                onClick={() => handleSocialClick("google")}
                disabled={!!socialLoading || submitState === "loading"}
              >
                <span className="su-social-ic">G</span>
                <span>
                  {socialLoading === "google"
                    ? t("signup.social_google_loading")
                    : t("signup.social_google")}
                </span>
              </button>
              <button
                type="button"
                className="su-social-btn su-social-apple"
                onClick={() => handleSocialClick("apple")}
                disabled={!!socialLoading || submitState === "loading"}
              >
                <span className="su-social-ic"></span>
                <span>
                  {socialLoading === "apple"
                    ? t("signup.social_apple_loading")
                    : t("signup.social_apple")}
                </span>
              </button>
              <div className="su-sep">
                <span />
                <em>{t("signup.manual_title")}</em>
                <span />
              </div>
            </div>

            <form className="su-form" onSubmit={onSubmit} noValidate>
              <div className={`su-field ${showError("fullName") ? "has-error" : ""}`}>
                <label>{t("signup.full_name_label")}</label>
                <div className="su-input-wrap">
                  <input
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, fullName: true }))
                    }
                    placeholder={t("signup.full_name_placeholder")}
                    autoComplete="name"
                  />
                  {renderFieldStatus("fullName")}
                </div>
                {showError("fullName") && (
                  <small className="su-err">{errors.fullName}</small>
                )}
              </div>

              <div className={`su-field ${showError("email") ? "has-error" : ""}`}>
                <label>{t("signup.email_label")}</label>
                <div className="su-input-wrap">
                  <input
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, email: true }))
                    }
                    placeholder={t("signup.email_placeholder")}
                    autoComplete="email"
                    inputMode="email"
                  />
                  {renderFieldStatus("email")}
                </div>
                {showError("email") && (
                  <small className="su-err">{errors.email}</small>
                )}
              </div>

              <div className={`su-field ${showError("password") ? "has-error" : ""}`}>
                <label>{t("signup.password_label")}</label>
                <div
                  className={`su-input-wrap su-password-wrap ${
                    isArabic ? "rtl" : "ltr"
                  }`}
                >
                  <input
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, password: true }))
                    }
                    placeholder={t("signup.password_placeholder")}
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    className="su-password-input"
                  />
                  <button
                    type="button"
                    className="su-eye"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={
                      showPw
                        ? t("signup.hide_password")
                        : t("signup.show_password")
                    }
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {renderFieldStatus("password")}
                </div>

                <div className="su-strength">
                  <div className={`su-strength-bar s${pw.score}`}>
                    <span />
                  </div>
                  <span className="su-strength-text">{pw.label}</span>
                </div>

                {showError("password") && (
                  <small className="su-err">{errors.password}</small>
                )}
              </div>

              <div className={`su-field ${showError("phone") ? "has-error" : ""}`}>
                <label>{t("signup.phone_label")}</label>
                <div className="su-input-wrap">
                  <input
                    value={form.phone}
                    pattern="01[0-9]{9}"
                    maxLength="11"
                    minLength="11"
                    onChange={(e) => setField("phone", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, phone: true }))
                    }
                    placeholder={t("signup.phone_placeholder")}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {renderFieldStatus("phone")}
                </div>
                {showError("phone") && (
                  <small className="su-err">{errors.phone}</small>
                )}
              </div>

              <div className={`su-field ${showError("gender") ? "has-error" : ""}`}>
                <label>{t("signup.gender_label")}</label>
                <div className="su-input-wrap">
                  <select
                    value={form.gender}
                    onChange={(e) => setField("gender", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, gender: true }))
                    }
                  >
                    <option value="">
                      {t("signup.gender_select")}
                    </option>
                    <option value="female">
                      {t("signup.gender_female")}
                    </option>
                    <option value="male">
                      {t("signup.gender_male")}
                    </option>
                  </select>
                  {renderFieldStatus("gender")}
                </div>
                {showError("gender") && (
                  <small className="su-err">{errors.gender}</small>
                )}
              </div>

              <div className={`su-field ${showError("age") ? "has-error" : ""}`}>
                <label>{t("signup.age_label")}</label>
                <div className="su-input-wrap">
                  <input
                    value={form.age}
                    type="number"
                    min="0"
                    max="120"
                    onChange={(e) => setField("age", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, age: true }))
                    }
                    placeholder={t("signup.age_placeholder")}
                    inputMode="numeric"
                  />
                  {renderFieldStatus("age")}
                </div>
                {showError("age") && (
                  <small className="su-err">{errors.age}</small>
                )}
              </div>

              <div className={`su-field ${showError("country") ? "has-error" : ""}`}>
                <label>{t("signup.country_label")}</label>
                <div className="su-input-wrap">
                  <select
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    onBlur={() =>
                      setTouched((p) => ({ ...p, country: true }))
                    }
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {renderFieldStatus("country")}
                </div>
                {showError("country") && (
                  <small className="su-err">{errors.country}</small>
                )}
              </div>

              <label className={`su-check ${showError("agree") ? "has-error" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setField("agree", e.target.checked)}
                  onBlur={() =>
                    setTouched((p) => ({ ...p, agree: true }))
                  }
                />
                <span>
                  {t("signup.agree_prefix")}{" "}
                  <button type="button" className="su-inline-link">
                    {t("signup.terms")}
                  </button>{" "}
                  &nbsp;
                  <button type="button" className="su-inline-link">
                    {t("signup.privacy")}
                  </button>
                </span>
              </label>
              {showError("agree") && (
                <small className="su-err">{errors.agree}</small>
              )}

              <p className="su-lock">
                🔒 {t("signup.lock_note")}
              </p>

              <div className="su-nav">
                <button
                  type="submit"
                  className={`su-next ${canSubmit() ? "ready" : ""}`}
                  disabled={submitState === "loading" || !canSubmit()}
                >
                  {submitState === "loading"
                    ? t("signup.creating")
                    : t("signup.create_account")}
                </button>
              </div>

              <div className="su-footer">
                <span>{t("signup.have_account")}</span>{" "}
                <button
                  type="button"
                  className="su-inline-link"
                  onClick={onLoginClick}
                >
                  {t("signup.login")}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {submitState === "success" && (
        <div className="su-success-overlay" role="dialog" aria-modal="true">
          <div className="su-success-card">
            <div className="su-success-check">✔</div>
            <h3>{t("signup.success_title")}</h3>
            <p>{t("signup.success_sub")}</p>
            <button
              type="button"
              className="su-next"
              onClick={onLoginClick}
            >
              {t("signup.success_button")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpSection;