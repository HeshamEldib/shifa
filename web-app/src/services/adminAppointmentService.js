const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getAdminAppointmentsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل في جلب المواعيد");
    return await response.json();
};

export const updateAppointmentStatusApi = async (id, status) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في تحديث حالة الموعد");
    }
    return await response.json();
};

export const getAppointmentDetailsApi = async (appointmentId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/appointments/${appointmentId}/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل في جلب تفاصيل SPAC");
    return await response.json();
};