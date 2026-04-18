const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

// جلب جميع المرضى
export const getAdminPatientsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل في جلب قائمة المرضى");
    return await response.json();
};

// إضافة مريض جديد
export const addPatientApi = async (patientData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/patients`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(patientData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تسجيل المريض");
    }
    return await response.json();
};

// تغيير حالة حساب المريض (إيقاف / تفعيل)
export const togglePatientStatusApi = async (patientId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/patients/${patientId}/toggle-status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحديث حالة الحساب");
    }
    return await response.json();
};

export const getPatientDetailsApi = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/patients/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
};