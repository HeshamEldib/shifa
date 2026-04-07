const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

// 1. جلب المواعيد المتاحة
export const getAvailableSlots = async (doctorId, serviceId, date) => {
    const response = await fetch(`${API_URL}/api/appointments/available-slots?doctorId=${doctorId}&serviceId=${serviceId}&date=${date}`);
    
    if (!response.ok) {
        throw new Error('فشل في جلب المواعيد المتاحة');
    }
    
    return await response.json();
};

// 2. إرسال طلب الحجز
export const bookAppointment = async (doctorId, serviceId, appointmentDate, notes) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("يجب تسجيل الدخول أولاً لإتمام الحجز.");
    }

    const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorId, serviceId, appointmentDate, notes })
    });

    if (!response.ok) {
        // قراءة رسالة الخطأ القادمة من الباك إند
        const errorText = await response.text(); 
        throw new Error(errorText || 'فشل في إتمام الحجز');
    }

    return await response.json();
};

export const getPatientAppointmentsApi = async (patientId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Appointments/my-appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 404) return [];
    if (!response.ok) throw new Error("فشل جلب المواعيد");
    return await response.json();
};

export const cancelAppointmentApi = async (appointmentId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل إلغاء الموعد");
    return true;
};