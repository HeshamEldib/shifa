import React, { useEffect, useMemo, useRef, useState } from "react";

function isValidEmail(v) {
  return /^\S+@\S+\.\S+$/.test(String(v || "").trim());
}

function ForgotPassword({ isLoaded, onBackClick, role = "patient" }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | sending | done
  const [hint, setHint] = useState("you@");
  const [showEscape, setShowEscape] = useState(false);
  const [showEscHint, setShowEscHint] = useState(false);

  const inputRef = useRef(null);
  const idleTimer = useRef(null);

  const roleLine = useMemo(() => {
    const map = {
      patient: "Let’s get you back—quietly and safely.",
      doctor: "We’ll secure your access so you can get back to care.",
      center: "We’ll secure access for your organization.",
    };
    return map[role] || "Let’s secure your access.";
  }, [role]);

  // focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape appears after 10s (hidden safety exit) في مرحلة الكتابة بس
  useEffect(() => {
    if (phase !== "typing") return;
    const t = setTimeout(() => setShowEscape(true), 10000);
    return () => clearTimeout(t);
  }, [phase]);

  // Esc key = back (accessibility)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onBackClick?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBackClick]);

  // animated placeholder hint
  useEffect(() => {
    if (phase !== "typing") return;
    const samples = ["you@", "name@", "account@", "email@"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % samples.length;
      setHint(samples[i]);
    }, 1400);
    return () => clearInterval(t);
  }, [phase]);

  function scheduleAutoSend(nextEmail) {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!isValidEmail(nextEmail)) return;

    idleTimer.current = setTimeout(() => {
      autoSend(nextEmail);
    }, 900);
  }

  async function autoSend(value) {
    if (phase !== "typing") return;
    if (!isValidEmail(value)) return;

    setPhase("sending");

    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 900));

    setPhase("done");
  }

  const onChangeEmail = (e) => {
    const v = e.target.value;
    setEmail(v);
    scheduleAutoSend(v);
  };

  // بعد ما نوصل لمرحلة done: ندي المستخدم دقيقة، لو ما عملش حاجة نرجعه إحنا
  useEffect(() => {
    if (phase !== "done") {
      setShowEscHint(false);
      return;
    }

    // بعد شوية صغيرين نطلع همسة Esc
    const hintTimer = setTimeout(() => {
      setShowEscHint(true);
    }, 4000); // بعد 4 ثواني مثلاً

    // بعد دقيقة نرجّع المستخدم تلقائيًا
    const autoBackTimer = setTimeout(() => {
      onBackClick?.();
    }, 30000); // 60 ثانية

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(autoBackTimer);
    };
  }, [phase, onBackClick]);

  return (
    <main className={`ne-page ${isLoaded ? "fade-in-up" : ""}`}>
      <div className="ne-bg" />

      {/* Hidden-ish escape (typing only, after 10s) */}
      {phase === "typing" && showEscape && (
        <button type="button" className="ne-escape" onClick={onBackClick}>
          ← Not now
        </button>
      )}

      <section className="ne-center" aria-label="Account recovery">
        {phase === "typing" && (
          <div className="ne-card">
            <div className="ne-title">Let’s get you back.</div>
            <div className="ne-sub">Where should we send the access?</div>
            <div className="ne-role">{roleLine}</div>

            <input
              ref={inputRef}
              className="ne-input"
              type="email"
              value={email}
              onChange={onChangeEmail}
              placeholder={`${hint}example.com`}
              aria-label="Email address"
              autoComplete="email"
            />

            <div className="ne-mini">
              Just type your email and pause for a moment. We’ll handle the rest.
            </div>
          </div>
        )}

        {phase === "sending" && (
          <div className="ne-focus">
            <div className="ne-breath" aria-hidden="true" />
            <div className="ne-title2">Hold on…</div>
            <div className="ne-sub2">Securing your access.</div>
          </div>
        )}

        {phase === "done" && (
          <div className="ne-focus">
            <div className="ne-title2">You’re safe.</div>
            <div className="ne-sub2">Check your inbox.</div>
            <div className="ne-sub3">
              If an account exists for that email, a link was sent.
            </div>

            {showEscHint && (
              <div className="ne-whisper" aria-hidden="true">
                Press Esc to go back now. We’ll take you back automatically in .5 minute.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default ForgotPassword;
