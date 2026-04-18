import React, { useState, useEffect } from "react";
import {
    BriefcaseMedical,
    Plus,
    Edit2,
    Clock,
    CreditCard,
    Video,
    MapPin,
    Power,
    X,
    Tag,
    Star,
    Trash2,
    AlertTriangle,
} from "lucide-react";
import {
    deleteDoctorServiceApi,
    getDoctorServicesApi,
    saveDoctorServiceApi,
    toggleStatusDoctorServiceApi,
} from "../../services/doctorServicesService";
import "./DoctorServices.css";

function DoctorServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    // أضف هذه الحالة مع باقي الحالات في أعلى المكون
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // تحديث حالة الفورم لتشمل category و type معاً
    const [formData, setFormData] = useState({
        serviceName: "",
        price: "",
        durationMinutes: "15",
        category: "General",
        type: "In-Clinic",
        isActive: true,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await getDoctorServicesApi();
            setServices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData(service);
        } else {
            setEditingService(null);
            setFormData({
                serviceName: "",
                price: "",
                durationMinutes: "15",
                category: "Consultation",
                type: "In-Clinic",
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveDoctorServiceApi(formData);
            if (editingService) {
                setServices(
                    services.map((s) =>
                        s.serviceID === editingService.serviceID
                            ? { ...formData, serviceID: s.serviceID }
                            : s,
                    ),
                );
            } else {
                const newService = {
                    ...formData,
                    serviceID: Math.random().toString(),
                };
                setServices([...services, newService]);
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const toggleStatus = async (serviceID) => {
        try {
            await toggleStatusDoctorServiceApi(serviceID);
            setServices(
                services.map((s) =>
                    s.serviceID === serviceID
                        ? { ...s, isActive: !s.isActive }
                        : s,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = (service) => {
        setServiceToDelete(service); // تفتح النافذة المنبثقة التحذيرية
    };

    const executeDelete = async () => {
        if (!serviceToDelete) return;

        try {
            await deleteDoctorServiceApi(serviceToDelete.serviceID);
            setServices(
                services.filter(
                    (s) => s.serviceID !== serviceToDelete.serviceID,
                ),
            );
            setServiceToDelete(null); // إغلاق النافذة بعد النجاح
        } catch (error) {
            alert("حدث خطأ أثناء محاولة الحذف: " + error.message);
        }
    };

    // دالة مساعدة لترجمة التصنيفات للغة العربية
    const getCategoryLabel = (cat) => {
        const labels = {
            Consultation: "استشارة طبية",
            FollowUp: "إعادة كشف",
            Procedure: "إجراء طبي / جراحة",
            Aesthetic: "تجميل",
        };
        return labels[cat] || cat;
    };

    if (isLoading)
        return (
            <div className="overview-loading">
                <div className="custom-spinner"></div>
                <p>جاري تحميل الخدمات...</p>
            </div>
        );

    return (
        <div className="doctor-services-page fade-in-up">
            <div className="page-header-flex">
                <div>
                    <h2 className="text-white mb-1">
                        <BriefcaseMedical
                            className="text-cyan me-2"
                            size={28}
                        />{" "}
                        خدماتي وأسعاري
                    </h2>
                    <p className="text-muted m-0">
                        قم بإدارة أنواع الكشوفات، تسعيرها، وتصنيفها.
                    </p>
                </div>
                <button
                    className="btn-primary-action"
                    onClick={() => handleOpenModal()}
                >
                    <Plus size={18} /> إضافة خدمة
                </button>
            </div>

            <div className="services-grid">
                {services.length === 0 ? (
                    <div
                        className="empty-state text-center glass-receipt"
                        style={{ gridColumn: "1 / -1" }}
                    >
                        <BriefcaseMedical
                            size={48}
                            className="text-muted mb-3"
                            opacity="0.4"
                        />
                        <h5 className="text-white">
                            لم تقم بإضافة أي خدمات بعد
                        </h5>
                    </div>
                ) : (
                    services.map((service) => (
                        <div
                            key={service.serviceID}
                            className={`service-card glass-receipt ${!service.isActive ? "service-inactive" : ""}`}
                        >
                            <div className="service-header">
                                <div className="service-header-info">
                                    <h4 className="service-title">
                                        {service.serviceName}
                                    </h4>
                                    {/* عرض التصنيف (Category) هنا */}
                                    <span className="meta-tag category-tag">
                                        <Tag size={12} className="meta-icon" />{" "}
                                        {getCategoryLabel(service.category)}
                                    </span>

                                    <span
                                        className="meta-tag rating-tag"
                                        title="تقييم المرضى لهذه الخدمة"
                                    >
                                        <Star
                                            size={12}
                                            className="meta-icon"
                                            fill="currentColor"
                                        />
                                        {/* نفترض أن السيرفر يرجع التقييم، وإذا لم يوجد نعرض "جديد" */}
                                        {service.rating
                                            ? service.rating.toFixed(1)
                                            : "جديد"}
                                    </span>
                                </div>
                                {/* عرض النوع (Type) هنا */}
                                <div className="service-type-badge">
                                    {service.type === "Telemedicine" ? (
                                        <>
                                            <Video size={14} /> أونلاين
                                        </>
                                    ) : (
                                        <>
                                            <MapPin size={14} /> عيادة
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="service-details">
                                <div className="detail-item">
                                    <CreditCard
                                        size={18}
                                        className="text-success"
                                    />
                                    <span className="price-tag">
                                        {service.price} ج.م
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={18} className="text-warning" />
                                    <span>{service.durationMinutes} دقيقة</span>
                                </div>
                            </div>

                            <div className="service-footer">
                                <button
                                    className="btn-toggle-status"
                                    onClick={() =>
                                        toggleStatus(service.serviceID)
                                    }
                                    title={
                                        service.isActive
                                            ? "إيقاف الخدمة"
                                            : "تفعيل الخدمة"
                                    }
                                >
                                    <Power
                                        size={18}
                                        className={
                                            service.isActive
                                                ? "text-danger"
                                                : "text-success"
                                        }
                                    />
                                    {service.isActive ? "إيقاف مؤقت" : "تفعيل"}
                                </button>
                                <button
                                    className="btn-edit-service"
                                    onClick={() => handleOpenModal(service)}
                                >
                                    <Edit2 size={16} /> تعديل
                                </button>

                                <button
                                    className="btn-delete-service"
                                    onClick={() => confirmDelete(service)}
                                >
                                    <Trash2 size={16} /> حذف
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content glass-receipt fade-in-up">
                        <div className="modal-header">
                            <h4 className="modal-title">
                                {editingService ? "تعديل الخدمة" : "إضافة خدمة"}
                            </h4>
                            <button
                                className="btn-close-modal"
                                onClick={handleCloseModal}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>اسم الخدمة</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.serviceName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            serviceName: e.target.value,
                                        })
                                    }
                                    className="custom-input"
                                    placeholder="مثال: كشف باطنة..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>السعر (ج.م)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="custom-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>المدة المتوقعة</label>
                                    <select
                                        value={formData.durationMinutes}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                durationMinutes: e.target.value,
                                            })
                                        }
                                        className="custom-input"
                                    >
                                        <option value="10">10 دقائق</option>
                                        <option value="15">15 دقيقة</option>
                                        <option value="20">20 دقيقة</option>
                                        <option value="30">30 دقيقة</option>
                                        <option value="40">40 دقيقة</option>
                                        <option value="45">45 دقيقة</option>
                                        <option value="50">50 دقيقة</option>
                                        <option value="60">ساعة</option>
                                    </select>
                                </div>
                            </div>

                            {/* حقل التصنيف (Category) الجديد */}
                            <div className="form-group">
                                <label>التصنيف الطبي</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                    className="custom-input"
                                >
                                    <option value="Consultation">
                                        استشارة طبية (كشف)
                                    </option>
                                    <option value="FollowUp">
                                        إعادة كشف (متابعة)
                                    </option>
                                    <option value="Procedure">
                                        إجراء طبي / جراحة صغرى
                                    </option>
                                    <option value="Aesthetic">
                                        تجميل / ليزر
                                    </option>
                                </select>
                            </div>

                            {/* حقل النوع (Type) */}
                            <div className="form-group">
                                <label>مكان الخدمة (النوع)</label>
                                <div className="type-options">
                                    <label
                                        className={`type-radio ${formData.type === "In-Clinic" ? "active" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            value="In-Clinic"
                                            checked={
                                                formData.type === "In-Clinic"
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    type: e.target.value,
                                                })
                                            }
                                        />
                                        <MapPin size={18} /> بالعيادة
                                    </label>
                                    <label
                                        className={`type-radio ${formData.type === "Telemedicine" ? "active" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            value="Telemedicine"
                                            checked={
                                                formData.type === "Telemedicine"
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    type: e.target.value,
                                                })
                                            }
                                        />
                                        <Video size={18} /> أونلاين
                                    </label>
                                </div>
                            </div>

                            <div className="modal-actions-wrapper">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={handleCloseModal}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary-action"
                                >
                                    حفظ الخدمة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد الحذف (Delete Modal) */}
            {serviceToDelete && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content glass-receipt fade-in-up delete-modal">
                        <div className="modal-header delete-header">
                            <h4 className="modal-title warning-title">
                                <AlertTriangle size={24} /> تأكيد الحذف
                            </h4>
                            <button
                                className="btn-close-modal"
                                onClick={() => setServiceToDelete(null)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="delete-modal-body">
                            <p>
                                هل أنت متأكد من رغبتك في حذف خدمة{" "}
                                <strong className="text-white">
                                    "{serviceToDelete.serviceName}"
                                </strong>{" "}
                                نهائياً؟
                            </p>
                            <p className="warning-text">
                                لا يمكن التراجع عن هذا الإجراء بعد تنفيذه ولن
                                يتمكن المرضى من حجزها.
                            </p>

                            <div className="delete-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setServiceToDelete(null)}
                                >
                                    تراجع
                                </button>
                                <button
                                    type="button"
                                    className="btn-danger-action"
                                    onClick={executeDelete}
                                >
                                    <Trash2 size={18} /> نعم، احذف الخدمة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorServices;
