const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getDoctorAppointmentsApi = async (dateFilter = '') => {
    const token = localStorage.getItem("token");
    // مسار افتراضي لجلب مواعيد الطبيب (يمكن تمرير التاريخ كـ Query Parameter)
    const url = dateFilter ? `${API_URL}/api/Appointments/my-appointments?date=${dateFilter}` : `${API_URL}/api/Appointments/my-appointments`;
    
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل جلب المواعيد");

    return await response.json();
};

export const updateAppointmentStatusApi = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/api/Appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        // نرسل المفتاح status ليطابق الـ UpdateAppointmentStatusDto
        body: JSON.stringify({ status: newStatus }) 
    });

    if (!response.ok) {
        // يمكنك طباعة الخطأ لمعرفة السبب إن فشل
        const errorData = await response.text();
        throw new Error(errorData || "فشل تحديث حالة الموعد");
    }
    
    return true;
};