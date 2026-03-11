// src/components/FloatingLanguageSwitcher.jsx
import React, { useState, useEffect, useRef } from "react";
import i18n from "../i18n";
import "../FloatingLanguageSwitcher.css";

import flagEn from "../assets/us.svg";
import flagAr from "../assets/sa.svg";
import flagFr from "../assets/fr.svg";
import flagEs from "../assets/es.svg";
import flagZh from "../assets/cn.svg";

const languages = [
  { code: "en", label: "English", flag: flagEn },
  { code: "ar", label: "العربية", flag: flagAr },
  { code: "fr", label: "Français", flag: flagFr },
  { code: "es", label: "Español", flag: flagEs },
  { code: "cn", label: "中文", flag: flagZh },
];

export default function FloatingLanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  // الإحداثيات تُخزن كتـ translateX/Y بالنسبة للشاشة
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("app-lang", code);
    localStorage.setItem("i18nextLng", code);
    setOpen(false);
  };

  // تحميل اللغة المحفوظة
  useEffect(() => {
    const stored =
      localStorage.getItem("app-lang") ||
      localStorage.getItem("i18nextLng");
    if (stored) i18n.changeLanguage(stored);
  }, []);

  // تحميل موضع الزر المحفوظ
  useEffect(() => {
    const storedPos = localStorage.getItem("fab-lang-pos-v2");
    if (storedPos) {
      try {
        const parsed = JSON.parse(storedPos);
        if (
          parsed &&
          typeof parsed.x === "number" &&
          typeof parsed.y === "number"
        ) {
          setPosition(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
    return { x: e.pageX, y: e.pageY };
  };

  const startDrag = (e) => {
    e.preventDefault();
    if (!buttonRef.current) return;

    const { x, y } = getPoint(e);

    const rect = buttonRef.current.getBoundingClientRect();
    // نحسب offset من منتصف الزر علشان السحب يكون طبيعي
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    startOffsetRef.current = {
      x: x - centerX,
      y: y - centerY,
    };

    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      e.preventDefault();
      const { x, y } = getPoint(e);

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const size = 56; // حجم الزر تقريبًا

      let newX = x - window.innerWidth + size / 2 - startOffsetRef.current.x;
      let newY = y - window.innerHeight + size / 2 - startOffsetRef.current.y;

      // نحول (page) إلى حدود الشاشة بشكل بسيط: من -maxX إلى 0 أفقياً، ومن -maxY إلى 0 رأسياً
      const maxX = viewportWidth - size - 24;
      const maxY = viewportHeight - size - 24;

      if (newX > 0) newX = 0;
      if (newY > 0) newY = 0;
      if (newX < -maxX) newX = -maxX;
      if (newY < -maxY) newY = -maxY;

      setPosition({ x: newX, y: newY });
    };

    const handleUp = (e) => {
      e.preventDefault();
      setDragging(false);
      localStorage.setItem("fab-lang-pos-v2", JSON.stringify(position));
    };

    document.addEventListener("mousemove", handleMove, { passive: false });
    document.addEventListener("mouseup", handleUp, { passive: false });
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleUp, { passive: false });
    document.addEventListener("touchcancel", handleUp, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("touchcancel", handleUp);
    };
  }, [dragging, position]);

  const currentLang =
    languages.find(
      (l) => i18n.language && i18n.language.toLowerCase().startsWith(l.code)
    ) || languages[0];

  const containerStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };

  return (
    <div className="fab-lang-container" style={containerStyle}>
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
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          ref={buttonRef}
        >
          🌐
        </button>
      </div>
    </div>
  );
}
