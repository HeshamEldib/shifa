// src/components/website/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, Lock, CheckCircle, CreditCard, Smartphone, Calendar, Clock, AlertCircle, Video } from "lucide-react";
import "./BookingPage.css";

function BookingPage() {
  const { serviceId } = useParams(); // ID الدكتور أو الخدمة من الـ URL
  const location = useLocation();
  const navigate = useNavigate();

  //  الداتا اللي جاية من صفحة الدكتور (اليوم والوقت)
  const appointmentData = location.state || { day: "اليوم", time: "10:00 ص" };

  // ==========================================
  //  STATES FOR BACKEND INTEGRATION
  // ==========================================
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' أو 'wallet'
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [walletNumber, setWalletNumber] = useState("");
  
  const [doctorInfo, setDoctorInfo] = useState(null); // هنا هتتخزن بيانات الفاتورة
  const [isLoading, setIsLoading] = useState(true); // حالة تحميل الصفحة
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة زرار الدفع (Loading)
  const [isSuccess, setIsSuccess] = useState(false); // حالة نجاح الدفع
  const [errors, setErrors] = useState({});
  const [isFlipped, setIsFlipped] = useState(false);

  // ==========================================
  // 🔗 1. GET API: جلب تفاصيل الفاتورة من السيرفر
  // ==========================================
  useEffect(() => {
    /* 
    👉 [BACKEND DEV INSTRUCTION] 
    1. Remove the setTimeout block below.
    2. Uncomment the fetch code.
    3. The expected API response should look like:
       { name: "String", specialty: "String", price: Number, fees: Number, image: "URL" }
    */
    
    setTimeout(() => {
      setDoctorInfo({
        name: "د. أحمد محمد",
        specialty: "استشاري جراحة القلب (عن بُعد)",
        price: 350,
        fees: 15,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
      });
      setIsLoading(false);
    }, 1000);

    /* 
    // الكود الحقيقي للربط:
    const fetchCheckoutData = async () => {
      try {
        const response = await fetch(`https://your-api.com/api/doctors/${serviceId}`);
        const data = await response.json();
        setDoctorInfo(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      }
    };
    fetchCheckoutData();
    */
  }, [serviceId]);

  // قيود الإدخال (Front-end Validation)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" });

    if (name === "number") {
      const onlyNums = value.replace(/[^\d]/g, '');
      const formatted = onlyNums.replace(/(\d{4})/g, '$1 ').trim();
      if (formatted.length <= 19) setCardData({ ...cardData, [name]: formatted });
    } 
    else if (name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
      setCardData({ ...cardData, [name]: onlyLetters });
    }
    else if (name === "expiry") {
      const onlyNums = value.replace(/[^\d]/g, '');
      let formatted = onlyNums;
      if (onlyNums.length >= 2) {
        const month = parseInt(onlyNums.substring(0, 2));
        if (month > 12) formatted = '12'; 
        else formatted = onlyNums.substring(0, 2) + '/' + onlyNums.substring(2, 4);
      }
      if (formatted.length <= 5) setCardData({ ...cardData, [name]: formatted });
    }
    else if (name === "cvv") {
      const onlyNums = value.replace(/[^\d]/g, '');
      if (onlyNums.length <= 3) setCardData({ ...cardData, [name]: onlyNums });
    }
    else if (name === "wallet") {
      const onlyNums = value.replace(/[^\d]/g, '');
      if (onlyNums.length <= 11) setWalletNumber(onlyNums);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    if (paymentMethod === "card") {
      if (cardData.number.length !== 19) { newErrors.number = "يجب إدخال 16 رقماً"; isValid = false; }
      if (cardData.name.trim().length < 3) { newErrors.name = "يرجى كتابة الاسم بشكل صحيح"; isValid = false; }
      if (cardData.expiry.length !== 5) { newErrors.expiry = "تاريخ غير مكتمل"; isValid = false; }
      if (cardData.cvv.length !== 3) { newErrors.cvv = "مطلوب 3 أرقام"; isValid = false; }
    } else {
      if (walletNumber.length !== 11) { newErrors.wallet = "رقم المحفظة غير صحيح"; isValid = false; }
    }
    setErrors(newErrors);
    return isValid;
  };

  // ==========================================
  //  2. POST API: إرسال بيانات الدفع والحجز للسيرفر
  // ==========================================
  const handlePayment = (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setIsSubmitting(true); // تشغيل أنيميشن التحميل في الزرار

    /* 
     [BACKEND DEV INSTRUCTION]
    1. Remove the setTimeout block below.
    2. Uncomment the fetch code to submit the booking & payment.
    3. The Payload structure is prepared for you.
    */

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true); // تشغيل أنيميشن النجاح
      setTimeout(() => navigate("/patient"), 2000); // التوجيه للوحة التحكم
    }, 2000);

    /*
    // الكود الحقيقي للربط:
    const submitPayment = async () => {
      try {
        const payload = {
          doctorId: serviceId,
          appointmentDate: appointmentData.day,
          appointmentTime: appointmentData.time,
          amount: doctorInfo.price + doctorInfo.fees,
          paymentMethod: paymentMethod, // "card" or "wallet"
          paymentDetails: paymentMethod === "card" ? cardData : { phone: walletNumber }
        };

        const response = await fetch("https://your-api.com/api/bookings/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setIsSubmitting(false);
          setIsSuccess(true);
          setTimeout(() => navigate("/patient"), 2000);
        } else {
          setIsSubmitting(false);
          // Handle payment error (e.g. insufficient funds)
          // setErrors({ general: "فشلت عملية الدفع، يرجى التأكد من الرصيد." });
        }
      } catch (error) {
        setIsSubmitting(false);
        console.error("Payment submission failed:", error);
      }
    };
    submitPayment();
    */
  };

  if (isLoading) return <div className="premium-booking-page"><div className="pulse-loader"></div></div>;

  return (
    <div className="premium-booking-page">
      <div className="security-aura">
        <div className="aura-glow blue-glow"></div>
        <div className="aura-glow cyan-glow"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="booking-container">
        <button className="back-btn-premium" onClick={() => navigate(-1)}>
          <ArrowRight size={20} />
          <span>تعديل الموعد</span>
        </button>

        <div className="checkout-grid">
          
          <div className="payment-section fade-in-up">
            <div className="section-header">
              <h2 className="title-with-icon"><Lock size={24} className="secure-icon pulse" /> تأكيد الحجز الإلكتروني</h2>
              <p className="subtitle">جميع بياناتك مشفرة. سيتم إرسال رابط الجلسة بعد إتمام الدفع.</p>
            </div>

            <div className="payment-methods">
              <div className={`method-card ${paymentMethod === "card" ? "active" : ""}`} onClick={() => setPaymentMethod("card")}>
                <CreditCard size={20} /> بطاقة ائتمان
              </div>
              <div className={`method-card ${paymentMethod === "wallet" ? "active" : ""}`} onClick={() => setPaymentMethod("wallet")}>
                <Smartphone size={20} /> محفظة إلكترونية
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="interactive-card-wrapper">
                <div className={`credit-card-3d ${isFlipped ? "flipped" : ""}`}>
                  <div className="card-front">
                    <div className="card-chip"></div>
                    <div className="card-logo">VISA</div>
                    <div className="card-number-display">{cardData.number || "#### #### #### ####"}</div>
                    <div className="card-details-display">
                      <div><span className="label">حامل البطاقة</span><span className="value">{cardData.name || "الاسم بالكامل"}</span></div>
                      <div><span className="label">تاريخ الانتهاء</span><span className="value">{cardData.expiry || "MM/YY"}</span></div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="magnetic-strip"></div>
                    <div className="cvv-display">
                      <span className="label">CVV</span>
                      <div className="cvv-box">{cardData.cvv || "***"}</div>
                    </div>
                    <p className="security-text">Secured by Shifaa Telehealth 256-bit encryption.</p>
                  </div>
                </div>

                <form className="floating-form">
                  <div className={`input-group ${errors.number ? "has-error shake" : ""}`}>
                    <input type="text" name="number" value={cardData.number} onChange={handleInputChange} placeholder=" " onFocus={() => setIsFlipped(false)} />
                    <label>رقم البطاقة</label>
                    <div className="input-glow-line"></div>
                    {errors.number && <span className="error-msg"><AlertCircle size={12} /> {errors.number}</span>}
                  </div>

                  <div className={`input-group ${errors.name ? "has-error shake" : ""}`}>
                    <input type="text" name="name" value={cardData.name} onChange={handleInputChange} placeholder=" " onFocus={() => setIsFlipped(false)} />
                    <label>الاسم على البطاقة</label>
                    <div className="input-glow-line"></div>
                    {errors.name && <span className="error-msg"><AlertCircle size={12} /> {errors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className={`input-group ${errors.expiry ? "has-error shake" : ""}`}>
                      <input type="text" name="expiry" value={cardData.expiry} onChange={handleInputChange} placeholder=" " onFocus={() => setIsFlipped(false)} />
                      <label>تاريخ الانتهاء</label>
                      <div className="input-glow-line"></div>
                      {errors.expiry && <span className="error-msg"><AlertCircle size={12} /> {errors.expiry}</span>}
                    </div>
                    <div className={`input-group ${errors.cvv ? "has-error shake" : ""}`}>
                      <input type="password" name="cvv" value={cardData.cvv} onChange={handleInputChange} placeholder=" " onFocus={() => setIsFlipped(true)} />
                      <label>رمز CVV</label>
                      <div className="input-glow-line"></div>
                      {errors.cvv && <span className="error-msg"><AlertCircle size={12} /> {errors.cvv}</span>}
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {paymentMethod === "wallet" && (
              <div className="wallet-section fade-in-up">
                <div className="wallet-notice">
                  <Smartphone size={24} className="notice-icon" />
                  <p>يرجى إدخال رقم المحفظة. ستصلك رسالة على هاتفك لتأكيد خصم المبلغ.</p>
                </div>
                <form className="floating-form" style={{marginTop: '20px'}}>
                  <div className={`input-group ${errors.wallet ? "has-error shake" : ""}`}>
                    <input type="text" name="wallet" value={walletNumber} onChange={handleInputChange} placeholder=" " />
                    <label>رقم الهاتف المرتبط بالمحفظة</label>
                    <div className="input-glow-line"></div>
                    {errors.wallet && <span className="error-msg"><AlertCircle size={12} /> {errors.wallet}</span>}
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="receipt-section fade-in-up delay">
            <div className="glass-receipt">
              <div className="receipt-header"><h3>ملخص الجلسة</h3></div>
              <div className="receipt-doctor">
                <img src={doctorInfo.image} alt={doctorInfo.name} />
                <div><h4>{doctorInfo.name}</h4><span>{doctorInfo.specialty}</span></div>
              </div>
              
              <div className="telehealth-badge">
                <Video size={16} /> <span>استشارة فيديو عن بُعد</span>
              </div>

              <div className="receipt-details">
                <div className="detail-row"><span className="icon-label"><Calendar size={16} /> الموعد</span><span className="highlight-val">{appointmentData.day}</span></div>
                <div className="detail-row"><span className="icon-label"><Clock size={16} /> الساعة</span><span className="highlight-val">{appointmentData.time}</span></div>
              </div>
              <div className="receipt-divider"></div>
              <div className="receipt-finance">
                <div className="finance-row"><span>رسوم الاستشارة</span><span>{doctorInfo.price} ج.م</span></div>
                <div className="finance-row"><span>رسوم الشبكة والأمان</span><span>{doctorInfo.fees} ج.م</span></div>
                <div className="finance-total"><span>الإجمالي</span><span className="total-price">{doctorInfo.price + doctorInfo.fees} ج.م</span></div>
              </div>
              <div className="trust-badges">
                <span><ShieldCheck size={14} /> حماية 256-bit</span>
                <span><Lock size={14} /> بوابة دفع آمنة</span>
              </div>
              <button className={`magic-pay-btn ${isSubmitting ? "loading" : ""} ${isSuccess ? "success" : ""}`} onClick={handlePayment} disabled={isSubmitting || isSuccess}>
                {!isSubmitting && !isSuccess && <span>تأكيد الدفع وإتمام الحجز <ArrowRight size={18} /></span>}
                {isSubmitting && <span className="btn-spinner"></span>}
                {isSuccess && <span><CheckCircle size={20} /> تم تأكيد جلستك!</span>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingPage;
