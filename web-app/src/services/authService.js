const API_URL = process.env.REACT_APP_API_URL;

export const authService = {
    // 1. دالة تسجيل الدخول
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "حدث خطأ في تسجيل الدخول");
        }

        return data; // ترجع التوكن والصلاحية
    },

    // 2. دالة إنشاء حساب جديد (مريض أو طاقم طبي)
    register: async (form) => {
        let endpoint = "";
        let payload = {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            phone: form.phone,
            age: form.age,
            gender: form.gender,
            country: form.country,
        };

        endpoint = "/api/auth/register-patient";

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "حدث خطأ أثناء إنشاء الحساب.");
        }

        return data;
    },
};

// طلب إرسال كود التحقق (OTP) إلى الإيميل
export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok)
        throw new Error(data.message || "حدث خطأ أثناء إرسال الكود.");
    return data;
};

// إعادة تعيين كلمة المرور باستخدام الكود
export const resetPassword = async (email, otp, newPassword) => {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();
    if (!response.ok)
        throw new Error(data.message || "الكود غير صحيح أو حدث خطأ.");
    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("user");
}