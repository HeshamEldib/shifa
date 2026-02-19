
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import heroImg from "../../assets/hero-illustration.png";
import "./Login.css";

function normalizeRole(role) {
  if (role === null || role === undefined) return "";
  const r = String(role).trim().toLowerCase();

  if (r === "admin" || r.includes("admin")) return "Admin";
  if (r === "doctor" || r === "dr" || r === "physician") return "Doctor";
  if (r === "patient" || r === "user") return "Patient";
  if (r === "1") return "Patient";
  if (r === "2") return "Doctor";

  return String(role).trim();
}

function LoginSection({
  isLoaded,
  onBackClick,
  onSignupClick,
  onForgotClick,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // NEW: demo role selector (auto/patient/doctor/admin)
  const [roleChoice, setRoleChoice] = useState("auto");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    // Role selection logic:
    // - auto: guess from email (your old behavior)
    // - otherwise: take selected role directly
    let decidedRole = "Patient";

    if (roleChoice === "auto") {
      let guessedRole = "Patient";
      const lower = email.toLowerCase();
      if (lower.includes("admin")) guessedRole = "Admin";
      else if (lower.includes("doctor") || lower.includes("dr.")) guessedRole = "Doctor";
      decidedRole = guessedRole;
    } else {
      decidedRole = roleChoice;
    }

    const fixedRole = normalizeRole(decidedRole);

    const fakeData = {
      token: "DEMO_TOKEN",
      userId: "DEMO_USER",
      role: fixedRole,
      expiration: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      email,
    };

    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: fakeData.token,
        userId: fakeData.userId,
        role: fixedRole,
        expiration: fakeData.expiration,
      })
    );

    // ده اللي بيغيّر الـ view في App.js
    onLoginSuccess?.({ ...fakeData, role: fixedRole });

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="background-wrapper">
        <div className="bg-image" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="bg-overlay"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      <nav className={`navbar ${isLoaded ? "fade-in-down" : ""}`}>
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
              strokeWidth="6"
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

        <div className="nav-buttons desktop-only">
          <button className="btn-secondary" onClick={onBackClick}>
            Back to Home
          </button>
        </div>
      </nav>

      <main className="login-wrapper">
        <div className={`login-card ${isLoaded ? "fade-in-up" : ""}`}>
          <div className="login-header">
            <div className="login-badge">Welcome back</div>
            <h1 className="login-title">Login to Shifaa</h1>
            <p className="login-subtitle">
              Patients, doctors and admins sign in with their Shifaa account.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* NEW: Demo role selector */}
            <div className="form-group">
              <label htmlFor="roleChoice">Sign in as (demo)</label>
              <select
                id="roleChoice"
                className="login-input"
                value={roleChoice}
                onChange={(e) => setRoleChoice(e.target.value)}
              >
                <option value="auto">Auto (guess from email)</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="login-row">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="link-button" onClick={onForgotClick}>
                Forgot password?
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary btn-lg login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
              {!isSubmitting && <ArrowRight size={18} style={{ marginLeft: "8px" }} />}
            </button>
          </form>

          <p className="login-security-note">Your data is encrypted and securely stored.</p>

          <p className="login-footer-text">
            Don’t have an account?{" "}
            <button type="button" className="link-button" onClick={onSignupClick}>
              Sign up
            </button>
          </p>
        </div>
      </main>
    </>
  );
}

export default LoginSection;