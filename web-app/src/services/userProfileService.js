const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/profile`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("فشل في جلب بيانات الملف الشخصي");
    }

    const data = await response.json();

    data.image = data.image ? (API_URL + data.image) : "/user.png";
    // تحديث التخزين المحلي لضمان مزامنة الاسم والصورة في الهيدر
    // localStorage.setItem("user", JSON.stringify(data));
    
    return data;
};


// 2. تحديث البيانات النصية
export const updateUserProfileApi = async (profileData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error("فشل تحديث البيانات");
    return await response.json();
};

// 3. رفع صورة الملف الشخصي
export const uploadProfileImageApi = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/profile/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // لا نضع Content-Type هنا، المتصفح سيحدده تلقائياً للـ FormData
        body: formData
    });
    if (!response.ok) throw new Error("فشل رفع الصورة");
    return await response.json(); // ننتظر الـ URL الجديد للصورة
};