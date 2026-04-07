import { Link } from "react-router-dom";
import "./Footer.css";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <div className="container">
            <footer className="giant-footer-card">
                <div className="footer-grid">
                    <div className="footer-brand-col">
                        <Link to="/" className="footer-brand-col">
                            <div className="logo-icon-neon large">S</div>
                            <span className="logo-text large">شــفاء</span>
                            <p className="footer-desc-chic">
                                الرعاية الصحية الأفضل، بين يديك في أي وقت وأي
                                مكان.
                            </p>
                        </Link>
                    </div>

                    <div className="footer-links-col">
                        <h4>روابط سريعة</h4>
                        <Link to="/services">الخدمات</Link>
                        <Link to="/doctors">الأطباء</Link>
                        <Link to="/about">من نحن</Link>
                        <Link to="/contact">تواصل معنا</Link>
                    </div>
                    <div className="footer-links-col">
                        <h4>بيانات التواصل</h4>
                        <span>info@shifaa.com</span>
                        <span>+20 123 456 7890</span>
                        <span>القاهرة، مصر</span>
                    </div>
                    <div className="footer-newsletter-col">
                        <h4>النشرة البريدية</h4>
                        <p className="newsletter-desc">
                            اشترك ليصلك أحدث المقالات الطبية.
                        </p>
                        <div className="elegant-input-group">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                            />
                            <button className="btn-glow small">اشتراك</button>
                        </div>
                        <div className="social-chic-links-pro">
                            <a href="#fb">
                                <Facebook size={22} />
                            </a>
                            <a href="#ig">
                                <Instagram size={22} />
                            </a>
                            <a href="#in">
                                <Linkedin size={22} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-chic">
                    <p>© 2026 شفاء - جميع الحقوق محفوظة</p>
                    <div className="legal-links">
                        <a href="#privacy">سياسة الخصوصية</a>
                        <a href="#terms">شروط الاستخدام</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
