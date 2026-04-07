import { Briefcase, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "./AllDoctors.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function CardDoctor({ doc, index }) {
    return (
        <div
            className={`crystal-card doctor-card`}
            // onMouseMove={(e) => handleMouseMove(e, doc.id)}
            // onMouseEnter={() => setHoveredDoctorId(doc.id)}
            // onMouseLeave={() => setHoveredDoctorId(null)}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="scan-line"></div>

            {/* الاقتباس المخفي بيظهر عند الـ Hover */}
            <div className="hidden-quote">"صحتك هي أولويتي القصوى"</div>

            <div className="card-inner">
                <div className="doctor-header">
                    {/* 3. الصورة مع النبض والـ Tracking */}
                    <div className="avatar-wrapper">
                        <div className="trust-ring"></div>
                        {doc.image ? (
                            <img
                                src={
                                    doc.image
                                        ? `${API_URL}${doc.image}`
                                        : "/doctor.png"
                                }
                                alt={doc.fullName}
                                className="doctor-avatar"
                            />
                        ) : (
                            <img
                                src="/doctor.png"
                                alt={doc.fullName}
                                className="doctor-avatar"
                            />
                        )}
                    </div>

                    {/* 4. نبض الإتاحة (Smart Availability) */}
                    <div className="smart-availability">
                        <span className="pulse-dot"></span>
                        <span className="avail-text">{doc.availability}</span>
                    </div>
                </div>

                <div className="doctor-info">
                    <h3 className="doctor-name">{doc.fullName}</h3>
                    <p className="doctor-specialty">{doc.specialty}</p>

                    <div className="trust-stats">
                        <div className="stat-item gold-stat">
                            <Star size={14} className="stat-icon" />
                            <span>{doc.rating}</span>
                        </div>
                        <div className="stat-item">
                            <Briefcase size={14} className="stat-icon" />
                            <span>{doc.experienceYears}</span>
                        </div>
                        <div className="stat-item">
                            <Users size={14} className="stat-icon" />
                            <span>{doc.patientsCount}</span>
                        </div>
                    </div>
                </div>

                {/* 5. الأزرار المخفية المغناطيسية */}
                <div className="unfold-action multi-buttons">
                    
                    <Link
                        to={`/doctor/${doc.doctorID}`}
                        className="book-btn-premium center"
                    >
                        <span>عرض الملف</span>
                        <div className="btn-glow-effect"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
