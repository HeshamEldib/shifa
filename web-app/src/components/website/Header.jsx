import { Link } from "react-router-dom";
import "./Header.css";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import UserMenu from "../UserMenu";
import { useSelector } from "react-redux";
import NotificationBell from "../NotificationBell";

export default function Header() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    return (
        <header className="navbar-wrapper">
            <nav className="capsule-navbar">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-brand">
                        <div className="logo-icon-neon">S</div>
                        <span className="logo-text">شــفاء</span>
                    </Link>
                </div>
                <div className="nav-links desktop-only">
                    <Link to="/" className="nav-item active">
                        الرئيسية
                    </Link>

                    <Link to="/services" className="nav-item">
                        الخدمات
                    </Link>

                    <Link to="/doctors" className="nav-item">
                        الأطباء
                    </Link>

                    <Link to="/about" className="nav-item">
                        من نحن
                    </Link>

                    <Link to="/contact" className="nav-item">
                        تواصل معنا
                    </Link>
                </div>

<div className="header-actions">
                {token ? (
                    <div className="ms-3 authenticated-actions">
                        <NotificationBell />
                        <UserMenu />
                    </div>
                ) : (
                    <div className="nav-actions desktop-only">
                        <Link to="/login" className="btn-text">
                            تسجيل دخول
                        </Link>

                        <Link to="/signup" className="btn-glow">
                            حساب جديد
                        </Link>
                    </div>
                )}
                </div>

                <button
                    className="mobile-menu-toggle mobile-only"
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                >
                    {isMobileNavOpen ? (
                        <X size={24} color="#fff" />
                    ) : (
                        <Menu size={24} color="#fff" />
                    )}
                </button>
            </nav>
        </header>
    );
}
