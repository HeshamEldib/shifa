import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice"; // افترض وجودها في الـ Slice
import {
    User,
    LayoutDashboard,
    LogOut,
    Calendar,
    Activity,
} from "lucide-react";
import "./UserMenu.css";
import { fetchUserProfile } from "../store/slices/userProfileSlice";

function UserMenu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // جلب بيانات المستخدم من Redux
    const { data: user } = useSelector((state) => state.userProfile || {});

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user]);

    return (
        <div
            className="user-menu-container"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* صورة المستخدم أو أيقونة افتراضية */}
            <div className="user-avatar-wrapper">
                <img
                    src={
                        !user
                            ? "/user.png"
                            : !user.image
                              ? "/user.png"
                              : user.image
                    }
                    alt={user ? user.fullName : "User"}
                    className="user-avatar-img"
                />
                {/* <div className={`status-indicator ${user.isActive ? 'online' : ''}`}></div> */}
            </div>

            {/* القائمة المنسدلة */}
            {isOpen && (
                <div className="user-dropdown-menu fade-in">
                    <div className="dropdown-header">
                        <p className="user-name">{user.fullName}</p>
                        <p className="user-role">{user.role}</p>
                    </div>

                    <hr />

                    {user.role.toLowerCase() === "patient" && (
                        <>
                            <Link to="/patient/profile" className="dropdown-item">
                                <User size={18} /> ملفي الشخصي
                            </Link>
                            <Link
                                to="/patient/appointments"
                                className="dropdown-item"
                            >
                                <Calendar size={18} /> مواعيدي
                            </Link>
                            <Link
                                to="/patient/records"
                                className="dropdown-item"
                            >
                                <Activity size={18} /> السجل الطبي
                            </Link>
                        </>
                    )}

                    {/* إظهار لوحة التحكم للأدمن والطبيب فقط */}
                    {(user.role === "Admin" || user.role === "Doctor") && (
                        <Link
                            to={
                                user.role === "Admin"
                                    ? "/admin"
                                    : "/doctor"
                            }
                            className="dropdown-item"
                        >
                            <LayoutDashboard size={18} /> لوحة التحكم
                        </Link>
                    )}

                    {/* <Link to="/settings" className="dropdown-item">
            <Settings size={18} /> الإعدادات
          </Link> */}

                    <hr />

                    <button
                        onClick={handleLogout}
                        className="dropdown-item logout-btn"
                    >
                        <LogOut size={18} /> تسجيل الخروج
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
