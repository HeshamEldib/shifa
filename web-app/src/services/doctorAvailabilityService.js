const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038"; // تأكد من البورت الخاص بك


// جلب مواعيد عمل طبيب محدد
export const getDoctorAvailability = async (doctorId) => {
    const response = await fetch(`${API_URL}/api/doctors/${doctorId}/availability`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error("تعذر جلب مواعيد الطبيب");
    return await response.json();
};

export const getMyAvailability = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/doctors/my-availability`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) throw new Error("تعذر جلب مواعيد الطبيب");
      const data = await response.json();
    
    return data;
};

// تحديث مواعيد عمل الطبيب
export const updateWorkingHoursApi = async (availabilityData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/doctors/availability`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(availabilityData)
    });

    if (!response.ok) throw new Error("تعذر تحديث مواعيد الطبيب");
    return await response.json();
};

// جلب إعدادات الصلاة للطبيب
export const getPrayerSettingsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Doctors/prayer-settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل جلب إعدادات الصلاة");
    return await response.json();
};

// تحديث إعدادات الصلاة للطبيب
export const updatePrayerSettingsApi = async (settingsData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Doctors/prayer-settings`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
    });
    if (!response.ok) throw new Error("فشل تحديث إعدادات الصلاة");
    return true;
};