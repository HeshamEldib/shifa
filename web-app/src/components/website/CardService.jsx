import {
    Activity,
    Clock,
    Eye,
    FlaskConical,
    Shield,
    Smile,
    Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./AllServices.css";

export default function CardService({ service, index }) {
    // دالة لتوزيع الأيقونات بناءً على اسم القسم اللي راجع من الداتا
    const getIconForCategory = (category) => {
        switch (category) {
            case "قلب":
                return <Activity size={32} />;
            case "أسنان":
                return <Smile size={32} />;
            case "عيون":
                return <Eye size={32} />;
            case "تحاليل":
                return <FlaskConical size={32} />;
            case "جلدية":
                return <Shield size={32} />;
            default:
                return <Activity size={32} />;
        }
    };

    // دالة تأثير الإضاءة (Spotlight)
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <div
            className="crystal-card"
            onMouseMove={handleMouseMove}
            style={{ animationDelay: `${index * 0.15}s` }}
        >
            <div className="scan-line"></div>

            <div className="card-inner">
                <div className="card-top">
                    <div className="icon-glass-wrapper">
                        {getIconForCategory(service.category)}
                    </div>
                    <div className="rating-badge">
                        <Star size={14} className="star-icon" />
                        <span>{service.rating}</span>
                    </div>
                </div>

                <div className="card-body">
                    <h3 className="service-title">{service.serviceName}</h3>
                    <p className="doctor-name">د. {service.doctorName}</p>

                    <div className="service-meta">
                        <div className="meta-item">
                            <Clock size={16} />
                            <span>{service.durationMinutes} دقيقة</span>
                        </div>
                        <div className="price-tag">{service.price}</div>
                    </div>
                </div>

                <div className="unfold-action">
                    <Link
                        to={`/service/${service.serviceID}`}
                        className="btn-outline-premium center"
                    >
                        <span>احجز الآن</span>
                        <div className="btn-glow-effect"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
