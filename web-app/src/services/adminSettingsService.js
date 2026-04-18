const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

// جلب الإعدادات العامة
export const getGlobalSettingsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        throw new Error("فشل في جلب إعدادات النظام");
    }
    return await response.json();
};

// تحديث الإعدادات
export const updateGlobalSettingsApi = async (settingsData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/settings`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(settingsData)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "حدث خطأ أثناء حفظ الإعدادات");
    }
    return await response.json();
};

export const uploadLogoApi = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/Admin/upload-logo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    if (!response.ok) throw new Error("فشل رفع الصورة");
    return await response.json(); // ننتظر الـ URL الجديد للصورة
};