const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getDoctorServicesApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/DoctorServices/my-services`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    
    return data;
};

export const saveDoctorServiceApi = async (serviceData) => {
    // هذه الدالة ستتعامل مع الإضافة والتعديل بناءً على وجود الـ ID
    const token = localStorage.getItem("token");
    const method = serviceData.serviceID ? 'PUT' : 'POST';
    const url = serviceData.serviceID ? `${API_URL}/api/DoctorServices/${serviceData.serviceID}` : `${API_URL}/api/DoctorServices`;

    const response = await fetch(url, {
        method: method,
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
    });

    if (!response.ok) throw new Error("فشل حفظ الخدمة");
    return true;
};

export const toggleStatusDoctorServiceApi = async (serviceId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/DoctorServices/${serviceId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل تغيير حالة الخدمة");
    return true;
};

export const deleteDoctorServiceApi = async (serviceId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/DoctorServices/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل حذف الخدمة");
    return true;
};
