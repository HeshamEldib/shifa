import { Link } from "react-router-dom";
import "./Header.css";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import UserMenu from "../UserMenu";
import { useSelector } from "react-redux";
import NotificationBell from "../NotificationBell";
import { useTranslation } from "react-i18next"; // استيراد مكتبة الترجمة

export default function Header() {
    const { t } = useTranslation(); // تفعيل الترجمة
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    return (
        <header className="navbar-wrapper">
            <nav className="capsule-navbar">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-brand">
                        <div className="logo-icon-neon">S</div>
                        <span className="logo-text">{t('header.brandName')}</span>
                    </Link>
                </div>
                <div className="nav-links desktop-only">
                    <Link to="/" className="nav-item active">
                        {t('header.home')}
                    </Link>

                    <Link to="/services" className="nav-item">
                        {t('header.services')}
                    </Link>

                    <Link to="/doctors" className="nav-item">
                        {t('header.doctors')}
                    </Link>

                    <Link to="/about" className="nav-item">
                        {t('header.about')}
                    </Link>

                    <Link to="/contact" className="nav-item">
                        {t('header.contact')}
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
                            {t('header.login')}
                        </Link>

                        <Link to="/signup" className="btn-glow">
                            {t('header.signup')}
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