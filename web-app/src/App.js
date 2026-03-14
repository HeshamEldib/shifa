// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";
import "./index.css";

import PageTitle from "./components/PageTitle.jsx";
import FloatingLanguageSwitcher from "./components/FloatingLanguageSwitcher.jsx";

// website
import HomeSection from "./components/website/HomeSection.jsx";
import LoginSection from "./components/website/LoginSection.jsx";
import ContactSection from "./components/website/ContactSection.jsx";
import AboutSection from "./components/website/AboutSection.jsx";
import SignUpSection from "./components/website/SignUpSection.jsx";
import ForgotPassword from "./components/website/ForgotPassword.jsx";

// dashboard
import PatientHome from "./components/dashboard/PatientHome.jsx";
import PatientAppointments from "./components/dashboard/PatientAppointments.jsx";
import DoctorDashboard from "./components/dashboard/DoctorDashboard.jsx";
import SilentDiagnosisScreen from "./components/dashboard/SilentDiagnosisScreen.jsx";
import SmartPrescription from "./components/dashboard/SmartPrescription.jsx";
import PatientPrescriptions from "./components/dashboard/PatientPrescriptions.jsx";
import AdminDashboard from "./components/dashboard/AdminDashboard.jsx";
import SettingsPage from "./components/dashboard/SettingsPage.jsx";
import DoctorPatientRecords from "./components/dashboard/DoctorPatientRecords.jsx";
import DoctorProfile from "./components/dashboard/DoctorProfile.jsx";

// ---------- favicon SVG ----------
const shifaaFaviconSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12B4CF" />
      <stop offset="100%" stop-color="#0b043f" />
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="256" height="256" rx="56" fill="url(#bg)" />

  <path
    d="M 40 140
       L 80 140
       L 98 110
       L 118 170
       L 138 120
       L 158 160
       L 176 140
       L 216 140"
    fill="none"
    stroke="#FFFFFF"
    stroke-width="16"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <circle cx="216" cy="140" r="10" fill="#FFFFFF" />
</svg>
`;
// ---------------------------------

function AppWrapper() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [activePatient] = useState({
    id: "2026-01",
    name: "Rana Ali",
    age: 32,
    gender: "Female",
  });
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => setIsLoaded(true), []);

  // اتجاه الصفحة حسب اللغة
  useEffect(() => {
    const dir =
      i18n.language && i18n.language.startsWith("ar") ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [i18n.language]);

  // favicon من الكود
  useEffect(() => {
    const svgBlob = new Blob([shifaaFaviconSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  const issuePrescription = (medicines) => {
    const rx = {
      id: `SHIFAA-RX-${new Date().getFullYear()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
      createdAt: new Date().toISOString(),
      patientId: activePatient.id,
      patientName: activePatient.name,
      medicines: medicines || [],
      status: "Issued",
    };
    setPrescriptions((prev) => [rx, ...prev]);
    return rx;
  };

  const patientPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => p.patientId === activePatient.id);
  }, [prescriptions, activePatient.id]);

  const currentRole = localStorage.getItem("role") || "Patient";

  return (
    <>
      <FloatingLanguageSwitcher />

      <Routes>
        {/* Website داخل app-container */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.home")} />
              <HomeSection
                isLoaded={isLoaded}
                onLoginClick={() => navigate("/login")}
                onContactClick={() => navigate("/contact")}
                onAboutClick={() => navigate("/about")}
                onSignupClick={() => navigate("/signup")}
                role={currentRole}
                onGoPatient={() => navigate("/patient")}
                onGoAppointments={() => navigate("/appointments")}
                onGoPatientPrescriptions={() =>
                  navigate("/patient-prescriptions")
                }
              />
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.login")} />
              <LoginSection
                isLoaded={isLoaded}
                onBackClick={() => navigate("/")}
                onSignupClick={() => navigate("/signup")}
                onForgotClick={() => navigate("/forgot")}
                onLoginSuccess={(data) => {
                  const r = data?.role || "Patient";

                  localStorage.setItem("role", r);
                  if (data?.token) {
                    localStorage.setItem("token", data.token);
                  }
                  if (data?.userId) {
                    localStorage.setItem("userId", data.userId);
                  }

                  if (r === "Patient") navigate("/patient");
                  else if (r === "Doctor") navigate("/doctor");
                  else if (r === "Admin") navigate("/admin");
                }}
              />
            </div>
          }
        />

        <Route
          path="/contact"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.contact")} />
              <ContactSection
                isLoaded={isLoaded}
                onBackClick={() => navigate("/")}
                onLoginClick={() => navigate("/login")}
                onAboutClick={() => navigate("/about")}
                onSignupClick={() => navigate("/signup")}
              />
            </div>
          }
        />

        <Route
          path="/about"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.about")} />
              <AboutSection
                isLoaded={isLoaded}
                onBackClick={() => navigate("/")}
              />
            </div>
          }
        />

        <Route
          path="/signup"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.signup")} />
              <SignUpSection
                isLoaded={isLoaded}
                onBackClick={() => navigate("/")}
                onLoginClick={() => navigate("/login")}
                onSignupSuccess={({ role, token, userId }) => {
                  const r = role || "Patient";
                  localStorage.setItem("role", r);
                  if (token) localStorage.setItem("token", token);
                  if (userId) localStorage.setItem("userId", userId);

                  if (r === "Patient") navigate("/patient");
                  else if (r === "Doctor") navigate("/doctor");
                  else if (r === "Admin") navigate("/admin");
                  else navigate("/patient");
                }}
              />
            </div>
          }
        />

        {/* Forgot خارج app-container */}
        <Route
          path="/forgot"
          element={
            <>
              <PageTitle title={t("pages.forgot")} />
              <ForgotPassword
                isLoaded={isLoaded}
                onDone={() => navigate("/login")}
              />
            </>
          }
        />

        {/* Patient */}
        <Route
          path="/patient"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.patient_dashboard")} />
              <PatientHome
                onLogout={() => navigate("/")}
                onOpenAppointments={() => navigate("/appointments")}
                onOpenPrescriptions={() => navigate("/patient-prescriptions")}
                onOpenSettings={() => navigate("/settings")}
                onOpenScreenCall={() => navigate("/silent")}
              />
            </div>
          }
        />

        <Route
          path="/appointments"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.appointments")} />
              <PatientAppointments onBack={() => navigate(-1)} />
            </div>
          }
        />

        <Route
          path="/patient-prescriptions"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.prescriptions")} />
              <PatientPrescriptions
                patient={activePatient}
                prescriptions={patientPrescriptions}
                onBack={() => navigate(-1)}
              />
            </div>
          }
        />

        {/* Doctor */}
        <Route
          path="/doctor"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.doctor_dashboard")} />
              <DoctorDashboard
                onLogout={() => navigate("/")}
                onOpenSettings={() => navigate("/settings")}
                onOpenSilent={() => navigate("/silent")}
                onOpenPrescription={() => navigate("/prescription")}
                onOpenAppointments={() => navigate("/doctor-records")}
              />
            </div>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.doctor_profile", "Doctor profile")} />
              <DoctorProfile />
            </div>
          }
        />

        <Route
          path="/doctor-records"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.patient_records")} />
              <DoctorPatientRecords
                onBack={() => navigate("/doctor")}
                onOpenPrescription={() => navigate("/prescription")}
              />
            </div>
          }
        />

        <Route
          path="/silent"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.silent_diagnosis")} />
              <SilentDiagnosisScreen onBack={() => navigate(-1)} />
            </div>
          }
        />

        <Route
          path="/prescription"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.smart_prescription")} />
              <SmartPrescription
                onBack={() => navigate(-1)}
                patient={activePatient}
                onIssue={issuePrescription}
                onViewProfile={(patientFromRx) =>
                  navigate("/doctor-records", {
                    state: { patient: patientFromRx || activePatient },
                  })
                }
              />
            </div>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.admin_dashboard")} />
              <AdminDashboard
                onLogout={() => navigate("/")}
                onOpenSettings={() => navigate("/settings")}
              />
            </div>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <div className="app-container">
              <PageTitle title={t("pages.settings")} />
              <SettingsPage role={currentRole} onBack={() => navigate(-1)} />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default AppWrapper;
