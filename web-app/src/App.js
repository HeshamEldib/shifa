import React, { useEffect, useMemo, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    Outlet,
} from "react-router-dom"; // إضافة Outlet
import { useTranslation } from "react-i18next";
import "./i18n";
import "./index.css";

import PageTitle from "./components/PageTitle.jsx";
import FloatingLanguageSwitcher from "./components/FloatingLanguageSwitcher.jsx";

// تأكد من استيراد الـ Header والـ Footer
import Header from "./components/website/Header.jsx";
import Footer from "./components/website/Footer.jsx";

// website
import HomeSection from "./components/website/HomeSection.jsx";
import LoginSection from "./components/website/LoginSection.jsx";
import ContactSection from "./components/website/ContactSection.jsx";
import AboutSection from "./components/website/AboutSection.jsx";
import SignUpSection from "./components/website/SignUpSection.jsx";
import ForgotPassword from "./components/website/ForgotPassword.jsx";

// الصفحات الجديدة
import AllServices from "./components/website/AllServices.jsx";
import AllDoctors from "./components/website/AllDoctors.jsx";
import DoctorDetails from "./components/website/DoctorDetails.jsx";
import BookingPage from "./components/website/BookingPage.jsx";

// dashboard
import PatientHome from "./components/dashboard/PatientHome.jsx";
// import PatientAppointments from "./components/dashboard/PatientAppointments.jsx";
import DoctorDashboard from "./components/dashboard/DoctorDashboard.jsx";
import SilentDiagnosisScreen from "./components/dashboard/SilentDiagnosisScreen.jsx";
import SmartPrescription from "./components/dashboard/SmartPrescription.jsx";
import PatientPrescriptions from "./components/dashboard/PatientPrescriptions.jsx";
import AdminDashboard from "./components/dashboard/AdminDashboard.jsx";
import SettingsPage from "./components/dashboard/SettingsPage.jsx";
import DoctorPatientRecords from "./components/dashboard/DoctorPatientRecords.jsx";
import DoctorProfile from "./components/dashboard/DoctorProfile.jsx";
import RequireGuest from "./components/guards/RequireGuest.jsx";
import RequireAuth from "./components/guards/RequireAuth.jsx";
import Profile from "./components/dashboard/Profile.jsx";
import PatientDashboardLayout from "./components/dashboard/PatientDashboardLayout.jsx";
import PatientRecords from "./components/dashboard/PatientRecords.jsx";
import PatientAppointments from "./components/dashboard/PatientAppointments.jsx";
import PatientNotifications from "./components/dashboard/Notifications.jsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import DoctorOverview from "./components/dashboard/DoctorOverview.jsx";
import DoctorAppointments from "./components/dashboard/DoctorAppointments.jsx";
import DoctorPatientsList from "./components/dashboard/DoctorPatientsList.jsx";
import DoctorServices from "./components/dashboard/DoctorServices.jsx";
import DoctorMedicines from "./components/dashboard/DoctorMedicines.jsx";
import DoctorSettings from "./components/dashboard/DoctorSettings.jsx";
import DoctorNotifications from "./components/dashboard/DoctorNotifications.jsx";
import AdminOverview from "./components/dashboard/AdminOverview.jsx";
import AdminPatients from "./components/dashboard/AdminPatients.jsx";
import AdminDoctors from "./components/dashboard/AdminDoctors.jsx";
import AdminAppointments from "./components/dashboard/AdminAppointments.jsx";
import AdminSpecialties from "./components/dashboard/AdminSpecialties.jsx";
import AdminSettings from "./components/dashboard/AdminSettings.jsx";
import AdminNotifications from "./components/dashboard/AdminNotifications.jsx";
import AdminProfile from "./components/dashboard/AdminProfile.jsx";

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
<path d="M 40 140 L 80 140 L 98 110 L 118 170 L 138 120 L 158 160 L 176 140 L 216 140" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
<circle cx="216" cy="140" r="10" fill="#FFFFFF" />
</svg>
`;
// ---------------------------------

// 1. Layout للصفحات الرئيسية التي تحتوي على Header و Footer
const MainLayout = () => (
    <>
        <Header />
        <div className="app-container">
            <Outlet />
        </div>
        <Footer />
    </>
);

const PatientLayout = () => (
    <>
        <Header />
        <div className="app-container">
            <Outlet />
        </div>
        {/* <Footer /> */}
    </>
);

const DashboardLayoutWrapper = () => (
        <Outlet />
    // <div className="app-container">
    // </div>
);

// 2. Layout لصفحات المصادقة (بدون Header و Footer)
const AuthLayout = () => (
    <div className="app-container">
        <Outlet />
    </div>
);

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

        return () => URL.revokeObjectURL(url);
    }, []);

    const issuePrescription = (medicines) => {
        const rx = {
            id: `SHIFAA-RX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
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

    const currentRole = localStorage.getItem("role");
    // const isLoggedIn = !!currentRole; // محذوف لعدم استخدامه لتجنب تحذيرات Linter

    const handleAuthSuccess = (data) => {
        const r = data?.role || "Patient";
        localStorage.setItem("role", r);
        if (data?.token) localStorage.setItem("token", data.token);
        if (data?.userId) localStorage.setItem("userId", data.userId);

        if (r === "Patient") navigate("/patient");
        else if (r === "Doctor") navigate("/doctor");
        else if (r === "Admin") navigate("/admin");
        else navigate("/patient");
    };

    return (
        <>
            <FloatingLanguageSwitcher />

            <Routes>
                <Route element={<DashboardLayoutWrapper />}>
                {/* ========================================= */}
                {/* مسارات لوحة تحكم الطبيب */}
                {/* ========================================= */}
                <Route element={<RequireAuth role="Doctor" />}>
                    <Route path="/doctor" element={<DashboardLayout />}>
                        {/* سيتم حقن هذه الصفحات مكان <Outlet /> */}
                        <Route path="" element={<DoctorOverview />} />
                        <Route path="dashboard" element={<DoctorOverview />} />
                        <Route
                            path="appointments"
                            element={<DoctorAppointments />}
                        />
                        <Route
                            path="patients"
                            element={<DoctorPatientsList />}
                        />
                        <Route path="records/:patientId" element={<DoctorPatientRecords />} />
                        <Route path="medicines" element={<DoctorMedicines />} />
                        <Route path="services" element={<DoctorServices />} />
                        <Route path="notifications" element={<DoctorNotifications />} />
                        <Route path="settings" element={<DoctorSettings />} />
                    </Route>
                </Route>

                {/* ========================================= */}
                {/* مسارات لوحة تحكم الإدارة (Admin) */}
                {/* ========================================= */}
                <Route element={<RequireAuth role="Admin" />}>
                    <Route path="/admin" element={<DashboardLayout />}>
                        <Route path="" element={<AdminOverview />} />
                        <Route path="overview" element={<AdminOverview />} />
                        <Route path="patients" element={<AdminPatients />} />
                        <Route path="doctors" element={<AdminDoctors />} />
                        <Route path="appointments" element={<AdminAppointments />} />
                        <Route path="specialties" element={<AdminSpecialties />} />
                        <Route path="notifications" element={<AdminNotifications />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="profile" element={<AdminProfile />} />
                    </Route>
                </Route>
                </Route>

                {/* --- 1. مسارات المصادقة للزوار فقط (بدون Header و Footer) --- */}
                <Route element={<RequireGuest />}>
                    <Route element={<AuthLayout />}>
                        <Route
                            path="/login"
                            element={
                                <>
                                    <PageTitle title={t("pages.login")} />
                                    <LoginSection
                                        isLoaded={isLoaded}
                                        onBackClick={() => navigate("/")}
                                        onSignupClick={() =>
                                            navigate("/signup")
                                        }
                                        onForgotClick={() =>
                                            navigate("/forgot")
                                        }
                                        onLoginSuccess={handleAuthSuccess}
                                    />
                                </>
                            }
                        />

                        <Route
                            path="/signup"
                            element={
                                <>
                                    <PageTitle title={t("pages.signup")} />
                                    <SignUpSection
                                        isLoaded={isLoaded}
                                        onBackClick={() => navigate("/")}
                                        onLoginClick={() => navigate("/login")}
                                        onSignupSuccess={handleAuthSuccess}
                                    />
                                </>
                            }
                        />
                    </Route>

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
                </Route>

                {/* --- 2. المسارات العامة (مع Header و Footer) --- */}
                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={
                            <>
                                <PageTitle title={t("pages.home")} />
                                <HomeSection
                                    isLoaded={isLoaded}
                                    role={currentRole || "Guest"}
                                />
                            </>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <>
                                <PageTitle title={t("pages.profile")} />
                                <Profile />
                            </>
                        }
                    />

                    <Route
                        path="/contact"
                        element={
                            <>
                                <PageTitle title={t("pages.contact")} />
                                <ContactSection
                                    isLoaded={isLoaded}
                                    onBackClick={() => navigate("/")}
                                    onLoginClick={() => navigate("/login")}
                                    onAboutClick={() => navigate("/about")}
                                    onSignupClick={() => navigate("/signup")}
                                />
                            </>
                        }
                    />

                    <Route
                        path="/about"
                        element={
                            <>
                                <PageTitle title={t("pages.about")} />
                                <AboutSection
                                    isLoaded={isLoaded}
                                    onBackClick={() => navigate("/")}
                                />
                            </>
                        }
                    />

                    <Route
                        path="/services"
                        element={
                            <>
                                <PageTitle title="جميع الخدمات" />
                                <AllServices />
                            </>
                        }
                    />
                    <Route
                        path="/doctors"
                        element={
                            <>
                                <PageTitle title="أطباؤنا المتميزون" />
                                <AllDoctors />
                            </>
                        }
                    />
                    <Route
                        path="/doctor/:doctorId"
                        element={
                            <>
                                <PageTitle title="تفاصيل الطبيب" />
                                <DoctorDetails />
                            </>
                        }
                    />
                </Route>

                {/* 👈 مجموعة مسارات المريض المتداخلة */}
                <Route element={<RequireAuth />}>
                    <Route element={<PatientLayout />}>
                        <Route
                            path="/patient"
                            element={<PatientDashboardLayout />}
                        >
                            {/* /patient/profile */}
                            <Route path="profile" element={<Profile />} />

                            {/* /patient/records */}
                            <Route
                                path="records"
                                element={<PatientRecords />}
                            />
                            {/* /patient/appointments */}
                            <Route
                                path="appointments"
                                element={<PatientAppointments />}
                            />
                            {/* /patient/notifications */}
                            <Route
                                path="notifications"
                                element={<PatientNotifications />}
                            />
                        </Route>
                    </Route>
                </Route>

                {/* --- 3. المسارات المحمية للمستخدمين المسجلين (مع Header و Footer) --- */}
                <Route element={<RequireAuth />}>
                    <Route element={<MainLayout />}>
                        {/* مسارات المريض */}
                        <Route
                            path="/patient"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.patient_dashboard")}
                                    />
                                    <PatientHome
                                        onLogout={() => navigate("/")}
                                        onOpenAppointments={() =>
                                            navigate("/appointments")
                                        }
                                        onOpenPrescriptions={() =>
                                            navigate("/patient-prescriptions")
                                        }
                                        onOpenSettings={() =>
                                            navigate("/settings")
                                        }
                                        onOpenScreenCall={() =>
                                            navigate("/silent")
                                        }
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/appointments"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.appointments")}
                                    />
                                    <PatientAppointments
                                        onBack={() => navigate(-1)}
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/patient-prescriptions"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.prescriptions")}
                                    />
                                    <PatientPrescriptions
                                        patient={activePatient}
                                        prescriptions={patientPrescriptions}
                                        onBack={() => navigate(-1)}
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/service/:serviceId"
                            element={
                                <>
                                    <PageTitle title="تأكيد الحجز" />
                                    <BookingPage />
                                </>
                            }
                        />

                        {/* مسارات الطبيب */}
                        <Route
                            path="/doctor"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.doctor_dashboard")}
                                    />
                                    <DoctorDashboard
                                        onLogout={() => navigate("/")}
                                        onOpenSettings={() =>
                                            navigate("/settings")
                                        }
                                        onOpenSilent={() => navigate("/silent")}
                                        onOpenPrescription={() =>
                                            navigate("/prescription")
                                        }
                                        onOpenAppointments={() =>
                                            navigate("/doctor-records")
                                        }
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/doctor/profile"
                            element={
                                <>
                                    <PageTitle
                                        title={t(
                                            "pages.doctor_profile",
                                            "Doctor profile",
                                        )}
                                    />
                                    <DoctorProfile />
                                </>
                            }
                        />
                        <Route
                            path="/doctor-records"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.patient_records")}
                                    />
                                    <DoctorPatientRecords
                                        onBack={() => navigate("/doctor")}
                                        onOpenPrescription={() =>
                                            navigate("/prescription")
                                        }
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/silent"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.silent_diagnosis")}
                                    />
                                    <SilentDiagnosisScreen
                                        onBack={() => navigate(-1)}
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/prescription"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.smart_prescription")}
                                    />
                                    <SmartPrescription
                                        onBack={() => navigate(-1)}
                                        patient={activePatient}
                                        onIssue={issuePrescription}
                                        onViewProfile={(patientFromRx) =>
                                            navigate("/doctor-records", {
                                                state: {
                                                    patient:
                                                        patientFromRx ||
                                                        activePatient,
                                                },
                                            })
                                        }
                                    />
                                </>
                            }
                        />

                        {/* مسارات الإدمن والإعدادات المشتركة */}
                        <Route
                            path="/admin"
                            element={
                                <>
                                    <PageTitle
                                        title={t("pages.admin_dashboard")}
                                    />
                                    <AdminDashboard
                                        onLogout={() => navigate("/")}
                                        onOpenSettings={() =>
                                            navigate("/settings")
                                        }
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <>
                                    <PageTitle title={t("pages.settings")} />
                                    <SettingsPage
                                        role={currentRole}
                                        onBack={() => navigate(-1)}
                                    />
                                </>
                            }
                        />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default AppWrapper;

// dotnet ef migrations add AddIsActiveToAvailability --project ../Shifa.Infrastructure
// dotnet ef database update --project ../Shifa.Infrastructure
