// src/components/website/AllServices.jsx
import React, { useState, useEffect } from "react";
import { Shield, Search, Loader2 } from "lucide-react";
import "./AllServices.css";
import CardService from "./CardService";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../store/slices/servicesSlice";

function AllServices() {
    const dispatch = useDispatch();

    const { data, isLoading, isLoaded, error } = useSelector(
        (state) => state.services || {},
    );
    const services = Array.isArray(data) ? data : [];

    // حالات البحث والفلترة
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    // استخراج الأقسام الفريدة ديناميكياً من البيانات القادمة
    const categories = [
        "الكل",
        ...new Set(services.map((s) => s.category).filter(Boolean)),
    ];

    // منطق البحث والفلترة المشترك
    const filteredData = services.filter((service) => {
        const matchesSearch =
            service.serviceName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            service.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            categoryFilter === "" ||
            service.category === categoryFilter ||
            categoryFilter === "الكل";

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="premium-services-page">
            {/* خلفية الـ Aura */}
            <div className="aura-background">
                <div className="aura-orb cyan-orb"></div>
                <div className="aura-orb purple-orb"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="services-container">
                <div className={`services-header ${isLoaded ? "fade-in" : ""}`}>
                    <div className="badge-glow">رحلة شفائك تبدأ هنا</div>
                    <h1 className="main-title">
                        الخدمات <span className="gradient-text">الطبية</span>
                    </h1>
                    <p className="sub-title">
                        نرشح لك أفضل الخدمات والرعاية بناءً على أعلى معايير
                        الجودة العالمية.
                    </p>
                </div>

                <div
                    className={`controls-section ${isLoaded ? "slide-up" : ""}`}
                >
                    <div className="search-box-premium">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="ابحث عن خدمة أو طبيب..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="search-glow-border"></div>
                    </div>

                    <div className="filters-premium">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* عرض الحالات: خطأ، تحميل، أو عرض البيانات */}
                {error ? (
                    <div className="empty-state error-state">
                        <Shield size={48} className="error-icon" />
                        <h3>{error}</h3>
                        <button
                            className="retry-btn"
                            onClick={() => window.location.reload()}
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                ) : isLoading ? (
                    <div className="loading-state">
                        <Loader2 size={48} className="spinner-icon" />
                        <p>جاري تحميل الخدمات الطبية...</p>
                    </div>
                ) : (
                    <div className="crystal-grid">
                        {filteredData.length > 0 ? (
                            filteredData.map((service, index) => (
                                <CardService
                                    key={service.id}
                                    service={service}
                                    index={index}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🩺</div>
                                <h3>لم نجد ما تبحث عنه...</h3>
                                <p>
                                    حاول استخدام كلمات أخرى أو تصفح الأقسام
                                    المختلفة.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllServices;
