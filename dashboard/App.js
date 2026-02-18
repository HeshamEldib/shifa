import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

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

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [view, setView] = useState("home");
  const [prevView, setPrevView] = useState("home");

  const [activePatient] = useState({
    id: "2026-01",
    name: "Rana Ali",
    age: 32,
    gender: "Female",
  });

  const [prescriptions, setPrescriptions] = useState([]);

  const [role, setRole] = useState(
    () => localStorage.getItem("role") || "Patient"
  );

  useEffect(() => setIsLoaded(true), []);

  const navigate = (next) => {
    setPrevView(view);
    setView(next);
  };

  const back = () => setView(prevView || "home");

  const goHome = () => navigate("home");
  const goLogin = () => navigate("login");
  const goContact = () => navigate("contact");
  const goAbout = () => navigate("about");
  const goSignup = () => navigate("signup");
  const goForgot = () => navigate("forgot");

  const goPatient = () => navigate("patient");
  const goAppointments = () => navigate("appointments");
  const goPatientPrescriptions = () => navigate("patient_prescriptions");

  const goDoctor = () => navigate("doctor");
  const goSilent = () => navigate("silent");
  const goPrescription = () => navigate("prescription");

  const goAdmin = () => navigate("admin");
  const goSettings = () => navigate("settings");

  // view جديد لملف المريض من ناحية الدكتور
  const goDoctorPatientRecords = () => navigate("doctor_patient_records");

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

  // رجوع من Silent حسب الدور
  const handleBackFromSilent = () => {
    if (role === "Doctor") {
      goDoctor();
    } else if (role === "Patient") {
      goPatient();
    } else if (role === "Admin") {
      goAdmin();
    } else {
      goHome();
    }
  };

  return (
    <div className="app-container">
      {view === "home" && (
        <HomeSection
          isLoaded={isLoaded}
          onLoginClick={goLogin}
          onContactClick={goContact}
          onAboutClick={goAbout}
          onSignupClick={goSignup}
          onGoPatient={goPatient}
          onGoAppointments={goAppointments}
          onGoPatientPrescriptions={goPatientPrescriptions}
          role={role}
        />
      )}

      {view === "login" && (
        <LoginSection
          isLoaded={isLoaded}
          onBackClick={goHome}
          onSignupClick={goSignup}
          onForgotClick={goForgot}
          onLoginSuccess={(data) => {
            const r = data?.role || "Patient";
            setRole(r);
            localStorage.setItem("role", r);

            if (r === "Patient") goPatient();
            else if (r === "Doctor") goDoctor();
            else if (r === "Admin") goAdmin();
          }}
        />
      )}

      {view === "contact" && (
        <ContactSection
          isLoaded={isLoaded}
          onBackClick={goHome}
          onLoginClick={goLogin}
          onAboutClick={goAbout}
          onSignupClick={goSignup}
        />
      )}

      {view === "about" && (
        <AboutSection isLoaded={isLoaded} onBackClick={goHome} />
      )}

      {view === "signup" && (
        <SignUpSection
          isLoaded={isLoaded}
          onBackClick={goHome}
          onLoginClick={goLogin}
          onSignupSuccess={(data) => {
            const r = data?.role || "Patient";
            setRole(r);
            localStorage.setItem("role", r);

            if (r === "Patient") goPatient();
            else if (r === "Doctor") goDoctor();
            else if (r === "Admin") goAdmin();
          }}
        />
      )}

      {view === "forgot" && (
        <ForgotPassword isLoaded={isLoaded} onBackClick={goLogin} />
      )}

      {/* جانب المريض */}
      {view === "patient" && (
        <PatientHome
          onLogout={goHome}
          onOpenAppointments={goAppointments}
          onOpenPrescriptions={goPatientPrescriptions}
          onOpenSettings={goSettings}
          onOpenScreenCall={goSilent}
        />
      )}

      {view === "appointments" && <PatientAppointments onBack={back} />}

      {view === "patient_prescriptions" && (
        <PatientPrescriptions
          patient={activePatient}
          prescriptions={patientPrescriptions}
          onBack={back}
        />
      )}

      {/* جانب الدكتور */}
      {view === "doctor" && (
        <DoctorDashboard
          onLogout={goHome}
          onOpenSettings={goSettings}
          onOpenSilent={goSilent}
          onOpenPrescription={goPrescription}
          onOpenAppointments={goDoctorPatientRecords}
        />
      )}

      {view === "doctor_patient_records" && (
        <DoctorPatientRecords
          onBack={goDoctor}
          onOpenPrescription={goPrescription}
        />
      )}

      {view === "silent" && (
        <SilentDiagnosisScreen onBack={handleBackFromSilent} />
      )}

      {view === "prescription" && (
        <SmartPrescription
          onBack={back}
          patient={activePatient}
          onIssue={issuePrescription}
        />
      )}

      {view === "admin" && (
        <AdminDashboard
          onLogout={goHome}
          onOpenSettings={goSettings}
        />
      )}

      {view === "settings" && (
        <SettingsPage role={role} onBack={back} />
      )}
    </div>
  );
}

export default App;
