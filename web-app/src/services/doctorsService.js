const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038"; // تأكد من البورت الخاص بك

// جلب جميع الأطباء
export const getAllDoctors = async () => {
    const response = await fetch(`${API_URL}/api/doctors`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error("تعذر جلب قائمة الأطباء");
    return await response.json();
};

// جلب مواعيد عمل طبيب محدد
export const getDoctorAvailability = async (doctorId) => {
    const response = await fetch(`${API_URL}/api/doctors/${doctorId}/availability`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error("تعذر جلب مواعيد الطبيب");
    return await response.json();
};

// جلب الخدمات التي يقدمها طبيب محدد
export const getDoctorServices = async (doctorId) => {
    const response = await fetch(`${API_URL}/api/doctorServices/doctor/${doctorId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error("تعذر جلب خدمات الطبيب");
    
    return await response.json();
};