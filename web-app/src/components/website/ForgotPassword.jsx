import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ForgotPass.css";

function isValidEmail(v) {
  return /^\S+@\S+\.\S+$/.test(String(v || "").trim());
}

function ForgotPassword({ isLoaded, role = "patient" }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.resolvedLanguage === "ar";
  const eyeSide = isArabic ? "ne-eye-left" : "ne-eye-right";

  // States
  const [phase, setPhase] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [magicTransition, setMagicTransition] = useState(false);
  const [message, setMessage] = useState("");

  const inputRef = useRef(null);

  const BACKEND_CONFIG = {
    enabled: process.env.REACT_APP_USE_BACKEND === "true",
    url: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    endpoints: {
      FORGOT: "/auth/forgot-password",
      VERIFY: "/auth/verify-code", 
      RESET: "/auth/reset-password"
    }
  };

  const canSubmit = useCallback(() => {
    switch (phase) {
      case "email": return isValidEmail(email);
      case "code": return code.length === 6;
      case "reset": 
        return password.length >= 6 && 
               confirmPassword.length >= 6 && 
               password === confirmPassword;
      default: return false;
    }
  }, [phase, email, code, password, confirmPassword]);

  const getEmailError = useCallback(() => 
    phase === "email" && !isValidEmail(email) ? 
      t("forgot.invalid_email") || "Invalid email" : "", 
    [phase, email, t]
  );

  const getCodeError = useCallback(() => 
    phase === "code" && code.length !== 6 ? 
      t("forgot.invalid_code") || "6 digits required" : "", 
    [phase, code, t]
  );

  const getPasswordError = useCallback(() => {
    if (phase !== "reset") return "";
    if (!password || !confirmPassword) return "";
    if (password.length < 6) 
      return t("forgot.password_short") || "6+ characters";
    if (password !== confirmPassword) 
      return t("forgot.passwords_not_match") || "Passwords don't match";
    return "";
  }, [phase, password, confirmPassword, t]);

  const apiCall = useCallback(async (endpoint, data) => {
    if (!BACKEND_CONFIG.enabled) {
      await new Promise(r => setTimeout(r, 1500));
      return { success: true, message: "Demo OK" };
    }
    try {
      const response = await fetch(`${BACKEND_CONFIG.url}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "API Error");
      return result;
    } catch (error) {
      throw new Error(error.message || "Network error");
    }
  }, []);

  const sendCode = async (e) => {
    e?.preventDefault();
    if (!canSubmit()) return;
    setLoading(true); setMessage("");
    try {
      await apiCall(BACKEND_CONFIG.endpoints.FORGOT, { email, role });
      setMessage(t("forgot.code_sent") || "Code sent to email");
      setPhase("code");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e?.preventDefault();
    if (!canSubmit()) return;
    setLoading(true); setMessage("");
    try {
      await apiCall(BACKEND_CONFIG.endpoints.VERIFY, { email, code });
      setPhase("reset");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e?.preventDefault();
    if (!canSubmit()) return;
    setLoading(true); setMessage("");
    try {
      await apiCall(BACKEND_CONFIG.endpoints.RESET, { email, password, code });
      setPhase("success");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { inputRef.current?.focus(); }, [phase]);
  useEffect(() => {
    if (phase === "success") {
      setParticles(Array.from({ length: 25 }, (_, i) => ({
        id: i, x: Math.random() * 350 + 50, y: Math.random() * 250 + 100,
        vx: (Math.random() - 0.5) * 120, vy: Math.random() * -120 - 60,
        size: Math.random() * 5 + 2, opacity: 1
      })));
      const timer = setTimeout(() => setMagicTransition(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (magicTransition) {
      const timer = setTimeout(() => {
        navigate(`/login?email=${encodeURIComponent(email)}`);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [magicTransition, email, navigate]);

  return (
    <main className={`ne-page ${isLoaded ? "fade-in-up" : ""} ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="ne-bg" />
      <button className="ne-escape" onClick={() => navigate(-1)}>
        {isArabic ? "← رجوع" : "← Back"}
      </button>

      <section className="ne-center">
        {phase === "email" && (
          <div className="ne-card">
            <div className="ne-title">{t("forgot.title_email") || "Forgot Password?"}</div>
            <div className="ne-sub">{t("forgot.subtitle_email") || "Enter your email"}</div>
            {message && <div className="ne-message">{message}</div>}
            <form className="ne-form" onSubmit={sendCode}>
              <div className={`ne-field ${getEmailError() ? "has-error" : ""}`}>
                <input 
                  ref={inputRef} 
                  className="ne-input" 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="your@email.com"
                  autoComplete="email" 
                />
                {getEmailError() && <small className="ne-error">{getEmailError()}</small>}
              </div>
              <button className={`ne-btn ${canSubmit() && !loading ? "ready" : ""}`} disabled={!canSubmit() || loading}>
                {loading ? t("forgot.sending") || "Sending..." : t("forgot.send_code") || "Send Code"}
              </button>
            </form>
          </div>
        )}

        {phase === "code" && (
          <div className="ne-card">
            <div className="ne-title">{t("forgot.title_code") || "Verify Code"}</div>
            <div className="ne-email-display">{email}</div>
            {message && <div className="ne-message">{message}</div>}
            <form className="ne-form" onSubmit={verifyCode}>
              <div className={`ne-field ${getCodeError() ? "has-error" : ""}`}>
                <label>{t("forgot.code_label") || "Verification Code"}</label>
                <input 
                  ref={inputRef} 
                  className="ne-input ne-code" 
                  type="text" 
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))} 
                  maxLength={6}
                  placeholder="000000" 
                />
                {getCodeError() && <small className="ne-error">{getCodeError()}</small>}
              </div>
              <button className={`ne-btn ${canSubmit() && !loading ? "ready" : ""}`} disabled={!canSubmit() || loading}>
                {loading ? t("forgot.verifying") || "Verifying..." : t("forgot.continue") || "Continue"}
              </button>
            </form>
            <button className="ne-back" onClick={() => setPhase("email")}>← Different Email</button>
          </div>
        )}

        {phase === "reset" && (
          <div className="ne-card">
            <div className="ne-title">{t("forgot.title_reset") || "New Password"}</div>
            {message && <div className="ne-message">{message}</div>}
            <form className="ne-form" onSubmit={resetPassword}>
              
              {/* ✅ Password Field */}
              <div className={`ne-field ${getPasswordError() ? "has-error" : ""}`}>
                <label>{t("forgot.new_password") || "New Password"}</label>
                <div className="ne-password-wrap">
                  <input 
                    ref={inputRef}
                    className="ne-input" 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    placeholder="6+ characters" 
                  />
                  <button 
                    type="button" 
                    className={`ne-eye ${eyeSide}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {getPasswordError() && <small className="ne-error">{getPasswordError()}</small>}
              </div>

              {/* ✅ Confirm Password Field */}
              <div className="ne-field">
                <label>{t("forgot.confirm_password") || "Confirm Password"}</label>
                <div className="ne-password-wrap">
                  <input 
                    className="ne-input" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password" 
                  />
                  <button 
                    type="button" 
                    className={`ne-eye ${eyeSide}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className={`ne-btn ${canSubmit() && !loading ? "ready" : ""}`} disabled={!canSubmit() || loading}>
                {loading ? t("forgot.saving") || "Saving..." : t("forgot.reset_password") || "Reset Password"}
              </button>
            </form>
            <button className="ne-back" onClick={() => setPhase("code")}>← Back</button>
          </div>
        )}

        {phase === "success" && (
          <div className="ne-magic-container">
            <div className="ne-magic-checkmark shifaa-glow">✔</div>
            <div className="ne-success-title">{t("forgot.success_title") || "Success!"}</div>
            <div className="ne-success-sub">{t("forgot.success_sub") || "Password reset complete"}</div>
            {particles.map(p => (
              <div key={p.id} className="ne-particle" style={{
                left: `${p.x}px`, top: `${p.y}px`, width: `${p.size}px`,
                height: `${p.size}px`, opacity: p.opacity,
                transform: `translate(${p.vx * 0.1}px, ${p.vy * 0.1}px)`
              }} />
            ))}
          </div>
        )}

        {magicTransition && <div className="ne-magic-portal" />}
      </section>
    </main>
  );
}

export default ForgotPassword;
