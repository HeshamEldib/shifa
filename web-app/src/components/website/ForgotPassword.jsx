import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ForgotPass.css";

function isValidEmail(v) {
  return /^\S+@\S+\.\S+$/.test(String(v || "").trim());
}

function ForgotPassword({ isLoaded, onBackClick, role = "patient" }) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState("typing");
  const [hint, setHint] = useState("you@");
  const [showEscape, setShowEscape] = useState(false);
  const [showEscHint, setShowEscHint] = useState(false);

  const inputRef = useRef(null);
  const idleTimer = useRef(null);

  const roleLine = useMemo(() => {
    const map = {
      patient: t("forgot.role_patient"),
      doctor: t("forgot.role_doctor"),
      center: t("forgot.role_center")
    };
    return map[role] || t("forgot.role_default");
  }, [role, t]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    const tmr = setTimeout(() => setShowEscape(true), 10000);
    return () => clearTimeout(tmr);
  }, [phase]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onBackClick?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBackClick]);

  useEffect(() => {
    if (phase !== "typing") return;
    const samples = ["you@", "name@", "account@", "email@"];
    let i = 0;
    const tmr = setInterval(() => {
      i = (i + 1) % samples.length;
      setHint(samples[i]);
    }, 1400);
    return () => clearInterval(tmr);
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

    await new Promise((r) => setTimeout(r, 900));

    setPhase("done");
  }

  const onChangeEmail = (e) => {
    const v = e.target.value;
    setEmail(v);
    scheduleAutoSend(v);
  };

  useEffect(() => {
    if (phase !== "done") {
      setShowEscHint(false);
      return;
    }

    const hintTimer = setTimeout(() => {
      setShowEscHint(true);
    }, 4000);

    const autoBackTimer = setTimeout(() => {
      onBackClick?.();
    }, 30000);

    return () => {
      clearTimeout(hintTimer);
      clearTimeout(autoBackTimer);
    };
  }, [phase, onBackClick]);

  return (
    <main className={`ne-page ${isLoaded ? "fade-in-up" : ""}`}>
      <div className="ne-bg" />

      {phase === "typing" && showEscape && (
        <button type="button" className="ne-escape" onClick={onBackClick}>
          ← {t("forgot.not_now")}
        </button>
      )}

      <section className="ne-center" aria-label="Account recovery">
        {phase === "typing" && (
          <div className="ne-card">
            <div className="ne-title">{t("forgot.title_typing")}</div>
            <div className="ne-sub">{t("forgot.sub_typing")}</div>
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
              {t("forgot.mini_hint")}
            </div>
          </div>
        )}

        {phase === "sending" && (
          <div className="ne-focus">
            <div className="ne-breath" aria-hidden="true" />
            <div className="ne-title2">{t("forgot.title_sending")}</div>
            <div className="ne-sub2">{t("forgot.sub_sending")}</div>
          </div>
        )}

        {phase === "done" && (
          <div className="ne-focus">
            <div className="ne-title2">{t("forgot.title_done")}</div>
            <div className="ne-sub2">{t("forgot.sub_done")}</div>
            <div className="ne-sub3">
              {t("forgot.sub3_done")}
            </div>

            {showEscHint && (
              <div className="ne-whisper" aria-hidden="true">
                {t("forgot.esc_hint")}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default ForgotPassword;
