const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

// جلب قائمة الأطباء
export const getAdminDoctorsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل في جلب قائمة الأطباء");
    return await response.json();
};

// إضافة طبيب جديد
export const addDoctorApi = async (doctorData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/doctors`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(doctorData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة الطبيب");
    }
    return await response.json();
};

// تغيير حالة حساب الطبيب (إيقاف / تفعيل)
export const toggleDoctorStatusApi = async (doctorId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/doctors/${doctorId}/toggle-status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحديث حالة الطبيب");
    }
    return await response.json();
};