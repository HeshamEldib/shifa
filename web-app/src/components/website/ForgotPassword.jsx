import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ForgotPass.css";
import { forgotPassword, resetPassword } from "../../services/authService";

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
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [magicTransition, setMagicTransition] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const inputRef = useRef(null);

  const canSubmit = useCallback(() => {
    switch (phase) {
      case "email": return isValidEmail(email);
      case "otp": return otp.length === 6;
      case "reset": 
        return password.length >= 6 && 
              confirmPassword.length >= 6 && 
              password === confirmPassword;
      default: return false;
    }
  }, [phase, email, otp, password, confirmPassword]);

  const getEmailError = useCallback(() => 
    phase === "email" && !isValidEmail(email) ? 
      t("forgot.invalid_email") || "Invalid email" : "", 
    [phase, email, t]
  );

  const getOtpError = useCallback(() => 
    phase === "otp" && otp.length !== 6 ? 
      t("forgot.invalid_otp") || "6 digits required" : "", 
    [phase, otp, t]
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

  // دالة إرسال الإيميل
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await forgotPassword(email);
            setSuccessMessage(res.message); // "تم إرسال كود التحقق..."
            setStep(2); // الانتقال للخطوة الثانية
            setPhase("otp");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // دالة إعادة تعيين كلمة المرور
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await resetPassword(email, otp, password);
            setSuccessMessage(res.message); // "تم تغيير كلمة المرور بنجاح"
            
            // تحويل المستخدم لصفحة تسجيل الدخول بعد ثانيتين
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            setError(err.message);
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

  // useEffect(() => {
  //   if (magicTransition) {
  //     const timer = setTimeout(() => {
  //       navigate(`/login?email=${enotpURIComponent(email)}`);
  //     }, 1400);
  //     return () => clearTimeout(timer);
  //   }
  // }, [magicTransition, email, navigate]);

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
            <form className="ne-form" onSubmit={handleSendEmail}>
              <div className={`ne-field ${getEmailError() ? "has-error" : ""}`}>
                <input 
                  ref={inputRef} 
                  className="ne-input" 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="your@gmail.com"
                  autoComplete="email" 
                />
                {getEmailError() && <small className="ne-error">{getEmailError()}</small>}
              </div>
              <button className={`ne-btn ${canSubmit() && !loading ? "ready" : ""}`} disabled={!canSubmit() || loading}>
                {loading ? t("forgot.sending") || "Sending..." : t("forgot.send_otp") || "Send OTP"}
              </button>
            </form>
          </div>
        )}

        {phase === "otp" && (
          <div className="ne-card">
            <div className="ne-title">{t("forgot.title_otp") || "Verify OTP"}</div>
            <div className="ne-email-display">{email}</div>
            {message && <div className="ne-message">{message}</div>}
            <div className="ne-form">
              <div className={`ne-field ${getOtpError() ? "has-error" : ""}`}>
                <label>{t("forgot.otp_label") || "Verification OTP"}</label>
                <input 
                  ref={inputRef} 
                  className="ne-input ne-otp" 
                  type="text" 
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                  maxLength={6}
                  placeholder="000000" 
                />
                {getOtpError() && <small className="ne-error">{getOtpError()}</small>}
              </div>
              <button className={`ne-btn ${canSubmit() && !loading ? "ready" : ""}`} disabled={!canSubmit() || loading}
              onClick={() => setPhase("reset")}>
                {loading ? t("forgot.verifying") || "Verifying..." : t("forgot.continue") || "Continue"}
              </button>
            </div>
            <button className="ne-back" onClick={() => setPhase("email")}>← Different Email</button>
          </div>
        )}

        {phase === "reset" && (
          <div className="ne-card">
            <div className="ne-title">{t("forgot.title_reset") || "New Password"}</div>
            {message && <div className="ne-message">{message}</div>}
            <form className="ne-form" onSubmit={handleResetPassword}>
              
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
            <button className="ne-back" onClick={() => setPhase("otp")}>← Back</button>
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