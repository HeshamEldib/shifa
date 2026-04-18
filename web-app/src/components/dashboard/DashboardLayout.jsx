import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    Activity,
    Menu,
    X,
    LogOut,
    ShieldCheck,
    BriefcaseMedical,
    CreditCard,
    Bell,
    Pill,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import "./DashboardLayout.css";
import { fetchUserProfile } from "../../store/slices/userProfileSlice";

function DashboardLayout() {
    // const { user } = useSelector(state => state.auth);
    const { data: user } = useSelector((state) => state.userProfile || {});
    const userRole = localStorage.getItem("role");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // console.log("test =>", user);

    // التأكد من وجود دور للمستخدم لتجنب الأخطاء
    // const userRole = user?.role || 'Doctor';

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    // 1. روابط الطبيب
    const doctorLinks = [
        {
            name: "الرئيسية",
            path: "/doctor/dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "إدارة المواعيد",
            path: "/doctor/appointments",
            icon: <Calendar size={20} />,
        },
        { name: "مرضاي", path: "/doctor/patients", icon: <Users size={20} /> },
        {
            name: "خدماتي وأسعاري",
            path: "/doctor/services",
            icon: <BriefcaseMedical size={20} />,
        },
        {
            name: "الأدوية",
            path: "/doctor/medicines",
            icon: <Pill size={20} />,
        },
        {
            name: "الإشعارات",
            path: "/doctor/notifications",
            icon: <Bell size={20} />,
        },
        {
            name: "الإعدادات",
            path: "/doctor/settings",
            icon: <Settings size={20} />,
        },
    ];

    // 2. روابط الإدارة
    const adminLinks = [
        {
            name: "الإحصائيات",
            path: "/admin/overview",
            icon: <Activity size={20} />,
        },
        {
            name: "المرضى",
            path: "/admin/patients",
            icon: <Users size={20} />,
        },
        {
            name: "الأطباء",
            path: "/admin/doctors",
            icon: <ShieldCheck size={20} />,
        },
        {
            name: "المواعيد",
            path: "/admin/appointments",
            icon: <Calendar size={20} />,
        },
        // {
        //     name: "التخصصات",
        //     path: "/admin/specialties",
        //     icon: <BriefcaseMedical size={20} />,
        // },
        {
            name: "الإشعارات",
            path: "/admin/notifications",
            icon: <Bell size={20} />,
        },
        {
            name: "الإعدادات",
            path: "/admin/settings",
            icon: <Settings size={20} />,
        },
        // {
        //     name: "الملف الشخصي",
        //     path: "/admin/profile",
        //     icon: <User size={20} />,
        // },
    ];

    // اختيار الروابط بناءً على الدور
    const sidebarLinks = userRole === "Admin" ? adminLinks : doctorLinks;

    // console.log("test =>", user);

    return (
        <div className="dashboard-layout">
            {/* 1. القائمة الجانبية (Sidebar) */}
            <aside
                className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}
            >
                <div className="sidebar-header">
                    <h3 className="text-cyan mb-0">شِفاء</h3>
                    <span className="role-badge">
                        {userRole === "Admin" ? "الإدارة" : "لوحة الطبيب"}
                    </span>
                    <button
                        className="close-sidebar-btn d-lg-none"
                        onClick={closeSidebar}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {sidebarLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            className="sidebar-link"
                            onClick={closeSidebar} // لإغلاق القائمة في الموبايل عند الضغط
                        >
                            {link.icon} {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link logout-btn"
                    >
                        <LogOut size={20} /> تسجيل الخروج
                    </button>
                </div>
            </aside>

            {/* خلفية معتمة للموبايل عند فتح القائمة */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            {/* 2. منطقة المحتوى (Main Content) */}
            <div className="dashboard-main">
                {/* الشريط العلوي (Topbar) */}
                <header className="dashboard-topbar">
                    <div className="topbar-right">
                        <button
                            className="menu-toggle-btn"
                            onClick={toggleSidebar}
                        >
                            <Menu size={24} />
                        </button>
                        {/* يمكن إضافة مسار الصفحة هنا (Breadcrumbs) مستقبلاً */}
                        <h5 className="page-title m-0 d-none d-sm-block">
                            مرحباً د. {user?.fullName?.split(" ")[0] || "هشام"}
                        </h5>
                    </div>

                    <div className="topbar-left">
                        <Link to="/" className="view-site-btn">
                            زيارة الموقع
                        </Link>

                        <div className="topbar-icon-wrapper">
                            <Link
                                to={
                                    userRole === "Admin"
                                        ? "/admin/notifications"
                                        : "/doctor/notifications"
                                }
                                className="topbar-icon-link"
                            >
                                <Bell size={20} />
                                <span className="topbar-badge">3</span>
                            </Link>
                        </div>

                        <div className="topbar-user">
                            <Link
                                to={
                                    userRole === "Admin"
                                        ? "/admin/profile"
                                        : "/doctor/profile"
                                }
                                className="user-profile-link"
                            >
                                <img
                                    src={user?.image || "/user.png"}
                                    alt="User"
                                />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* المساحة المتغيرة للصفحات (Outlet) */}
                <main className="dashboard-content fade-in-up">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
