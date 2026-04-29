import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    Calendar as CalendarIcon,
    Clock,
    FileText,
    CheckCircle,
    Banknote,
    Stethoscope,
} from "lucide-react";
import {
    getAvailableSlots,
    bookAppointment,
} from "../../services/appointmentService";
import "./BookingPage.css"; // (نفس ملف الـ CSS الذي أرسلته لك سابقاً)
import { fetchServices } from "../../store/slices/servicesSlice";

function BookingPage() {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const dispatch = useDispatch();

    // 2. جلب تفاصيل الخدمة من Redux (Global State)
    const { data: allServices } = useSelector((state) => state.services || []);
    const selectedService = allServices.find((s) => s.serviceID === serviceId);

    const doctorId = selectedService?.doctorID;

    useEffect(() => {
        if (allServices.length === 0) {
            dispatch(fetchServices());
        }
    }, [dispatch, allServices.length]);
    // 3. إدارة الحالات المحلية (Local States)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [notes, setNotes] = useState("");

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // 4. جلب المواعيد عند تغيير اليوم (Live Data)
    useEffect(() => {
        if (!serviceId) return;

        const fetchSlots = async () => {
            setLoadingSlots(true);
            setErrorMessage("");
            try {
                // تحويل التاريخ لصيغة YYYY-MM-DD
                const formattedDate = selectedDate.toLocaleDateString("en-CA");
                const data = await getAvailableSlots(
                    doctorId,
                    serviceId,
                    formattedDate,
                );
                setAvailableSlots(data);
            } catch (err) {
                setErrorMessage(err.message);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [doctorId, serviceId, selectedDate]);

    // 5. دالة إرسال الحجز
    const handleBooking = async () => {
        if (!selectedSlot) return;

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await bookAppointment(
                doctorId,
                serviceId,
                selectedSlot.startTime,
                notes,
            );
            setBookingSuccess(true);

            // توجيه المريض لصفحة مواعيده بعد النجاح
            setTimeout(() => {
                navigate("/patient/appointments");
            }, 3000);
        } catch (err) {
            setErrorMessage(err.message);
            setIsSubmitting(false);
        }
    };

    // حماية الصفحة إذا كان الرابط ناقصاً
    if (!doctorId || !serviceId) {
        return (
            <div className="premium-booking-page p-5 text-center">
                <h3>بيانات الحجز غير مكتملة، يرجى العودة لصفحة الخدمات.</h3>
            </div>
        );
    }

    return (
        <div className="premium-booking-page">
            {/* خلفية الأمان */}
            <div className="security-aura">
                <div className="aura-glow blue-glow"></div>
                <div className="aura-glow cyan-glow"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="booking-container">
                <div className="checkout-grid">
                    {/* ========================================= */}
                    {/* العمود الأيمن: التفاعل (التقويم والمواعيد) */}
                    {/* ========================================= */}
                    <div className="main-booking-section fade-in-up">
                        <div className="section-header">
                            <h2 className="title-with-icon">
                                <CalendarIcon
                                    size={24}
                                    className="secure-icon pulse"
                                />{" "}
                                حجز موعد جديد
                            </h2>
                            <p className="subtitle">
                                اختر اليوم والوقت المناسب لك لإتمام الحجز.
                            </p>
                        </div>

                        {errorMessage && (
                            <div
                                className="alert alert-danger"
                                style={{ borderRadius: "10px" }}
                            >
                                {errorMessage}
                            </div>
                        )}

                        {/* القسم الأول: التقويم */}
                        <div className="booking-card mb-4">
                            <h4 className="card-inner-title">
                                <CalendarIcon size={18} /> 1. اختر تاريخ الموعد
                            </h4>
                            <div className="calendar-wrapper">
                                <Calendar
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                        setSelectedSlot(null); // تصفير الوقت عند تغيير اليوم
                                    }}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    className="dark-theme-calendar"
                                />
                            </div>
                        </div>

                        {/* القسم الثاني: الأوقات المتاحة */}
                        <div className="booking-card mb-4">
                            <h4 className="card-inner-title">
                                <Clock size={18} /> 2. الأوقات المتاحة
                            </h4>
                            {loadingSlots ? (
                                <div className="text-center py-3">
                                    <span className="spinner-border text-info"></span>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="slots-grid">
                                    {availableSlots.map((slot, index) => {
                                        const timeString = new Date(
                                            slot.startTime,
                                        ).toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });
                                        return (
                                            <button
                                                key={index}
                                                className={`slot-btn ${selectedSlot?.startTime === slot.startTime ? "active" : ""}`}
                                                onClick={() =>
                                                    setSelectedSlot(slot)
                                                }
                                            >
                                                {timeString}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-warning text-center py-3">
                                    لا توجد مواعيد متاحة في هذا اليوم، يرجى
                                    اختيار يوم آخر.
                                </div>
                            )}
                        </div>

                        {/* القسم الثالث: الملاحظات */}
                        <div className="booking-card">
                            <h4 className="card-inner-title">
                                <FileText size={18} /> 3. ملاحظات للطبيب
                                (اختياري)
                            </h4>
                            <textarea
                                className="notes-input"
                                placeholder="اكتب هنا أي أعراض تعاني منها أو ملاحظات تود إخبار الطبيب بها..."
                                rows="3"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* العمود الأيسر: الفاتورة والتأكيد */}
                    {/* ========================================= */}
                    <div className="receipt-section fade-in-up booking delay">
                        <div className="glass-receipt booking">
                            <div className="receipt-header">
                                <h3>ملخص الحجز</h3>
                            </div>

                            {selectedService ? (
                                <>
                                    <div className="receipt-doctor">
                                        <img
                                            src={
                                                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
                                            }
                                            alt="Doctor Avatar"
                                        />
                                        <div>
                                            <h4>
                                                د. {selectedService.doctorName}
                                            </h4>
                                            <span>
                                                <Stethoscope size={14} />{" "}
                                                {selectedService.serviceName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="receipt-details">
                                        <div className="detail-row">
                                            <span className="icon-label">
                                                <CalendarIcon size={16} />{" "}
                                                التاريخ
                                            </span>
                                            <span className="highlight-val">
                                                {selectedDate.toLocaleDateString(
                                                    "ar-EG",
                                                )}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="icon-label">
                                                <Clock size={16} /> الوقت
                                            </span>
                                            <span className="highlight-val text-cyan">
                                                {selectedSlot
                                                    ? new Date(
                                                          selectedSlot.startTime,
                                                      ).toLocaleTimeString(
                                                          "ar-EG",
                                                          {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          },
                                                      )
                                                    : "لم يُحدد"}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="icon-label">
                                                <Clock size={16} /> المدة
                                                المتوقعة
                                            </span>
                                            <span className="highlight-val">
                                                {
                                                    selectedService.durationMinutes
                                                }{" "}
                                                دقيقة
                                            </span>
                                        </div>
                                    </div>

                                    <div className="receipt-divider"></div>

                                    <div className="receipt-finance">
                                        <div className="finance-total">
                                            <span>إجمالي التكلفة</span>
                                            <span className="total-price">
                                                {selectedService.price} ج.م
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-muted py-3">
                                    جاري تحميل البيانات...
                                </p>
                            )}

                            {/* ملاحظة الدفع */}
                            <div className="cash-notice my-4">
                                <Banknote size={24} className="notice-icon" />
                                <div>
                                    <h6
                                        className="mb-1"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        الدفع في العيادة
                                    </h6>
                                    <p
                                        className="mb-0"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        لن يتم خصم أي مبالغ الآن. يرجى الدفع
                                        نقداً عند الوصول.
                                    </p>
                                </div>
                            </div>

                            {/* زر التأكيد السحري */}
                            <button
                                className={`magic-pay-btn ${bookingSuccess ? "bg-success" : ""}`}
                                disabled={
                                    !selectedSlot ||
                                    isSubmitting ||
                                    bookingSuccess
                                }
                                onClick={handleBooking}
                            >
                                {isSubmitting ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : bookingSuccess ? (
                                    <span>
                                        <CheckCircle size={18} /> تم الحجز
                                        بنجاح!
                                    </span>
                                ) : (
                                    <span>
                                        تأكيد الحجز الآن{" "}
                                        <CheckCircle size={18} />
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
