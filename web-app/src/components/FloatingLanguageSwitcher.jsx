// src/components/FloatingLanguageSwitcher.jsx
import React, { useState, useEffect, useRef } from "react";
import i18n from "../i18n";
import "../FloatingLanguageSwitcher.css";

import flagEn from "../assets/us.svg";
import flagAr from "../assets/sa.svg";
import flagFr from "../assets/fr.svg";
import flagEs from "../assets/es.svg";
import flagZh from "../assets/cn.svg"; // لازم تضيفي cn.svg في assets

const languages = [
  { code: "en", label: "English", flag: flagEn },   // index 0 (فوق)
  { code: "ar", label: "العربية", flag: flagAr },   // index 1 (يمين)
  { code: "fr", label: "Français", flag: flagFr },  // index 2 (تحت يمين)
  { code: "es", label: "Español", flag: flagEs },   // index 3 (تحت يسار)
  { code: "cn", label: "中文", flag: flagZh },       // index 4 (يسار)
];

export default function FloatingLanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("app-lang", code);
    localStorage.setItem("i18nextLng", code);
    setOpen(false);
  };

  useEffect(() => {
    const stored =
      localStorage.getItem("app-lang") ||
      localStorage.getItem("i18nextLng");
    if (stored) i18n.changeLanguage(stored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const currentLang =
    languages.find(
      (l) => i18n.language && i18n.language.toLowerCase().startsWith(l.code)
    ) || languages[0];

  return (
    <div className="fab-lang-container" ref={containerRef}>
      <div className="fab-center">
        <div className={`fab-radial ${open ? "fab-radial-open" : ""}`}>
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              className={`fab-radial-item ${
                currentLang.code === lang.code ? "fab-radial-item-active" : ""
              }`}
              data-index={index}
              type="button"
              onClick={() => handleChange(lang.code)}
            >
              <img
                src={lang.flag}
                alt={lang.label}
                className="fab-radial-flag"
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`fab-lang-button ${open ? "fab-lang-button-open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          🌐
        </button>
      </div>
    </div>
  );
}
