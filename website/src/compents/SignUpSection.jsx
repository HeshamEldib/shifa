
// src/components/SignUpSection.jsx
import React, { useMemo, useState } from "react";
import heroImg from "../../assets/hero-illustration.png";
import"./SignUp.css"

const ROLES = [
  { key: "patient", label: "Patient", icon: "👤" },
  { key: "doctor", label: "Doctor", icon: "👨‍⚕️" },
  { key: "center", label: "Medical center / Pharmacy", icon: "🏥" },
];

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

function SignUpSection({ isLoaded, onBackClick, onLoginClick, onSignupSuccess }) {
  // باقي الكود كما هو

  const [role, setRole] = useState("patient");
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'apple' | null
  const [submitState, setSubmitState] = useState("idle"); // idle | loading | success

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
    country: "Egypt",
    specialization: "",
    medicalId: "",
    centerName: "",
    licenseNumber: "",
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

    // Step 1
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";

    // Step 2
    if (step >= 2) {
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.gender) e.gender = "Gender is required.";
      if (!form.age) e.age = "Age is required.";
      else if (Number(form.age) < 1 || Number(form.age) > 120)
        e.age = "Enter a valid age.";
      if (!form.country) e.country = "Country is required.";
    }

    // Step 3 role-based
    if (step >= 3) {
      if (role === "doctor") {
        if (!form.specialization.trim())
          e.specialization = "Specialization is required.";
        if (!form.medicalId.trim()) e.medicalId = "Medical ID is required.";
      }
      if (role === "center") {
        if (!form.centerName.trim())
          e.centerName = "Center name is required.";
        if (!form.licenseNumber.trim())
          e.licenseNumber = "License number is required.";
      }
      if (!form.agree)
        e.agree = "You must agree to Terms & Privacy Policy.";
    }

    return e;
  }, [form, role, step]);

  const stepCount = 3;
  const progressPct = Math.round((step / stepCount) * 100);

  const canGoNext = () => {
    if (step === 1)
      return !errors.fullName && !errors.email && !errors.password;
    if (step === 2)
      return (
        !errors.phone && !errors.gender && !errors.age && !errors.country
      );
    return true;
  };

  const goNext = () => {
    setTouched((p) => ({
      ...p,
      ...(step === 1
        ? { fullName: true, email: true, password: true }
        : {}),
    }));
    if (!canGoNext()) return;
    setStep((s) => Math.min(stepCount, s + 1));
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = (e) => {
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
    specialization: true,
    medicalId: true,
    centerName: true,
    licenseNumber: true,
    agree: true,
  }));
  if (Object.keys(errors).length) return;

  setSubmitState("loading");

  // هنا منطق اختيار الـrole النهائي زي ما محتاجاه للـDashboard
  let finalRole = "Patient";
  if (role === "doctor") finalRole = "Doctor";
  else if (role === "center") finalRole = "Admin";

  window.setTimeout(() => {
    setSubmitState("success");
    // ابعتي الـrole دا للبّيرنت لو محتاجه
    if (typeof onSignupSuccess === "function") {
      onSignupSuccess({ role: finalRole });
    }
  }, 900);
};


  const handleSocialClick = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      alert(`Social signup with ${provider} is not connected yet.`);
    }, 700);
  };

  const showError = (name) => touched[name] && errors[name];
  const validMark = (name) => touched[name] && !errors[name] && form[name];

  const renderFieldStatus = (name) => {
    if (showError(name)) return <span className="su-status su-bad">✖</span>;
    if (validMark(name)) return <span className="su-status su-good">✔</span>;
    return null;
  };

  const stepHint =
    step === 1
      ? "Account basics"
      : step === 2
      ? "Personal details"
      : "Professional info";

  return (
    <>
      {/* Split background */}
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
        {/* Left branding */}
        <section className={`su-left ${isLoaded ? "fade-in-up" : ""}`}>
          <div
            className="su-brand"
            onClick={onBackClick}
            style={{ cursor: "pointer" }}
          >
            <span className="su-brand-mark">+</span>
            <span className="su-brand-text">Shifaa</span>
          </div>

          <h1 className="su-left-title">
            Start your health journey with confidence
          </h1>
          <p className="su-left-sub">
            Shifaa helps you manage appointments, results, and conversations in
            one calm place.
          </p>

          <div className="su-left-points">
            <div className="su-left-point">
              <span className="su-dot" />
              <span>Appointments, results, and messaging in one timeline.</span>
            </div>
            <div className="su-left-point">
              <span className="su-dot" />
              <span>Flows designed to feel natural, not stressful.</span>
            </div>
            <div className="su-left-point">
              <span className="su-dot" />
              <span>A privacy‑first home for your medical data.</span>
            </div>
          </div>
        </section>

        {/* Right form */}
        <section className={`su-right ${isLoaded ? "fade-in-up" : ""}`}>
          <div className="su-form-shell">
            {/* Social */}
            <div className="su-social">
              <button
                type="button"
                className="su-social-btn su-social-google"
                onClick={() => handleSocialClick("google")}
                disabled={!!socialLoading}
              >
                <span className="su-social-ic">G</span>
                <span>
                  {socialLoading === "google"
                    ? "Connecting to Google…"
                    : "Sign up with Google"}
                </span>
              </button>
              <button
                type="button"
                className="su-social-btn su-social-apple"
                onClick={() => handleSocialClick("apple")}
                disabled={!!socialLoading}
              >
                <span className="su-social-ic"></span>
                <span>
                  {socialLoading === "apple"
                    ? "Connecting to Apple…"
                    : "Sign up with Apple"}
                </span>
              </button>
              <div className="su-sep">
                <span />
                <em>or create your account manually</em>
                <span />
              </div>
            </div>

            {/* Role selection */}
            <div className="su-role">
              <h2 className="su-h2">Choose account type</h2>
              <div
                className="su-role-grid"
                role="radiogroup"
                aria-label="Account type"
              >
                {ROLES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    role="radio"
                    aria-checked={role === r.key}
                    className={`su-role-card ${
                      role === r.key ? "is-active" : ""
                    }`}
                    onClick={() => setRole(r.key)}
                  >
                    <span className="su-role-ic">{r.icon}</span>
                    <span className="su-role-label">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="su-progress">
              <div className="su-progress-top">
                <span className="su-step-text">
                  Step {step} of {stepCount}
                </span>
                <span className="su-step-hint">{stepHint}</span>
              </div>
              <div className="su-progress-bar">
                <div
                  className="su-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Form */}
            <form className="su-form" onSubmit={onSubmit} noValidate>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="su-step">
                  <div
                    className={`su-field ${
                      showError("fullName") ? "has-error" : ""
                    }`}
                  >
                    <label>Full name</label>
                    <div className="su-input-wrap">
                      <input
                        value={form.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        onBlur={() =>
                          setTouched((p) => ({ ...p, fullName: true }))
                        }
                        placeholder="Full name"
                        autoComplete="name"
                      />
                      {renderFieldStatus("fullName")}
                    </div>
                    {showError("fullName") && (
                      <small className="su-err">{errors.fullName}</small>
                    )}
                  </div>

                  <div
                    className={`su-field ${
                      showError("email") ? "has-error" : ""
                    }`}
                  >
                    <label>Email address</label>
                    <div className="su-input-wrap">
                      <input
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        onBlur={() =>
                          setTouched((p) => ({ ...p, email: true }))
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                      {renderFieldStatus("email")}
                    </div>
                    {showError("email") && (
                      <small className="su-err">{errors.email}</small>
                    )}
                  </div>

                  <div
                    className={`su-field ${
                      showError("password") ? "has-error" : ""
                    }`}
                  >
                    <label>Password</label>
                    <div className="su-input-wrap">
                      <input
                        value={form.password}
                        onChange={(e) => setField("password", e.target.value)}
                        onBlur={() =>
                          setTouched((p) => ({ ...p, password: true }))
                        }
                        placeholder="Create a password"
                        type={showPw ? "text" : "password"}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="su-eye"
                        onClick={() => setShowPw((v) => !v)}
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? "Hide" : "Show"}
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
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="su-step">
                  <div
                    className={`su-field ${
                      showError("phone") ? "has-error" : ""
                    }`}
                  >
                    <label>Phone number</label>
                    <div className="su-input-wrap">
                      <input
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() =>
                          setTouched((p) => ({ ...p, phone: true }))
                        }
                        placeholder="+20 ..."
                        autoComplete="tel"
                        inputMode="tel"
                      />
                      {renderFieldStatus("phone")}
                    </div>
                    {showError("phone") && (
                      <small className="su-err">{errors.phone}</small>
                    )}
                  </div>

                  <div
                    className={`su-field ${
                      showError("gender") ? "has-error" : ""
                    }`}
                  >
                    <label>Gender</label>
                    <div className="su-input-wrap">
                      <select
                        value={form.gender}
                        onChange={(e) => setField("gender", e.target.value)}
                        onBlur={() =>
                          setTouched((p) => ({ ...p, gender: true }))
                        }
                      >
                        <option value="">Select</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                      {renderFieldStatus("gender")}
                    </div>
                    {showError("gender") && (
                      <small className="su-err">{errors.gender}</small>
                    )}
                  </div>

                  <div
                    className={`su-field ${
                      showError("age") ? "has-error" : ""
                    }`}
                  >
                    <label>Age</label>
                    <div className="su-input-wrap">
                      <input
                        value={form.age}
                        onChange={(e) => setField("age", e.target.value)}
                        onBlur={() =>
                          setTouched((p) => ({ ...p, age: true }))
                        }
                        placeholder="e.g. 23"
                        inputMode="numeric"
                      />
                      {renderFieldStatus("age")}
                    </div>
                    {showError("age") && (
                      <small className="su-err">{errors.age}</small>
                    )}
                  </div>

                  <div
                    className={`su-field ${
                      showError("country") ? "has-error" : ""
                    }`}
                  >
                    <label>Country</label>
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
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="su-step">
                  {role === "doctor" && (
                    <>
                      <div
                        className={`su-field ${
                          showError("specialization") ? "has-error" : ""
                        }`}
                      >
                        <label>Specialization</label>
                        <div className="su-input-wrap">
                          <input
                            value={form.specialization}
                            onChange={(e) =>
                              setField("specialization", e.target.value)
                            }
                            onBlur={() =>
                              setTouched((p) => ({
                                ...p,
                                specialization: true,
                              }))
                            }
                            placeholder="e.g. Cardiology"
                          />
                          {renderFieldStatus("specialization")}
                        </div>
                        {showError("specialization") && (
                          <small className="su-err">
                            {errors.specialization}
                          </small>
                        )}
                      </div>

                      <div
                        className={`su-field ${
                          showError("medicalId") ? "has-error" : ""
                        }`}
                      >
                        <label>Medical ID</label>
                        <div className="su-input-wrap">
                          <input
                            value={form.medicalId}
                            onChange={(e) =>
                              setField("medicalId", e.target.value)
                            }
                            onBlur={() =>
                              setTouched((p) => ({
                                ...p,
                                medicalId: true,
                              }))
                            }
                            placeholder="ID number"
                          />
                          {renderFieldStatus("medicalId")}
                        </div>
                        {showError("medicalId") && (
                          <small className="su-err">{errors.medicalId}</small>
                        )}
                      </div>
                    </>
                  )}

                  {role === "center" && (
                    <>
                      <div
                        className={`su-field ${
                          showError("centerName") ? "has-error" : ""
                        }`}
                      >
                        <label>Center name</label>
                        <div className="su-input-wrap">
                          <input
                            value={form.centerName}
                            onChange={(e) =>
                              setField("centerName", e.target.value)
                            }
                            onBlur={() =>
                              setTouched((p) => ({
                                ...p,
                                centerName: true,
                              }))
                            }
                            placeholder="Center name"
                          />
                          {renderFieldStatus("centerName")}
                        </div>
                        {showError("centerName") && (
                          <small className="su-err">
                            {errors.centerName}
                          </small>
                        )}
                      </div>

                      <div
                        className={`su-field ${
                          showError("licenseNumber") ? "has-error" : ""
                        }`}
                      >
                        <label>License number</label>
                        <div className="su-input-wrap">
                          <input
                            value={form.licenseNumber}
                            onChange={(e) =>
                              setField("licenseNumber", e.target.value)
                            }
                            onBlur={() =>
                              setTouched((p) => ({
                                ...p,
                                licenseNumber: true,
                              }))
                            }
                            placeholder="License number"
                          />
                          {renderFieldStatus("licenseNumber")}
                        </div>
                        {showError("licenseNumber") && (
                          <small className="su-err">
                            {errors.licenseNumber}
                          </small>
                        )}
                      </div>
                    </>
                  )}

                  {role === "patient" && (
                    <div className="su-patient-note">
                      No extra details needed for patient accounts.
                    </div>
                  )}

                  <label
                    className={`su-check ${
                      showError("agree") ? "has-error" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => setField("agree", e.target.checked)}
                      onBlur={() =>
                        setTouched((p) => ({ ...p, agree: true }))
                      }
                    />
                    <span>
                      I agree to{" "}
                      <button type="button" className="su-inline-link">
                        Terms
                      </button>{" "}
                      &
                      <button type="button" className="su-inline-link">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {showError("agree") && (
                    <small className="su-err">{errors.agree}</small>
                  )}

                  <p className="su-lock">
                    🔒 Your data is encrypted and securely stored.
                  </p>
                </div>
              )}

              {/* Nav buttons */}
              <div className="su-nav">
                <button
                  type="button"
                  className="su-ghost"
                  onClick={step === 1 ? onBackClick : goPrev}
                >
                  {step === 1 ? "Back" : "Previous"}
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    className={`su-next ${canGoNext() ? "ready" : ""}`}
                    onClick={goNext}
                    disabled={!canGoNext()}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="su-next"
                    disabled={submitState === "loading"}
                  >
                    {submitState === "loading" ? "Creating…" : "Create account"}
                  </button>
                )}
              </div>

              <div className="su-footer">
                <span>Already have an account?</span>{" "}
                <button
                  type="button"
                  className="su-inline-link"
                  onClick={onLoginClick}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Success overlay */}
      {submitState === "success" && (
        <div className="su-success-overlay" role="dialog" aria-modal="true">
          <div className="su-success-card">
            <div className="su-success-check">✔</div>
            <h3>Account created successfully</h3>
            <p>Your health journey starts now.</p>
            <button type="button" className="su-next" onClick={onBackClick}>
              Go to dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpSection;