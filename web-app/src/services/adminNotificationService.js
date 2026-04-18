const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

/**
 * جلب قائمة الإشعارات الواردة للإدارة
 */
export const getAdminNotificationsApi = async () => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/api/Admin/notifications`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        // محاولة جلب رسالة الخطأ من السيرفر إن وجدت
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "فشل في جلب الإشعارات من الخادم.");
    }

    return await response.json();
};

/**
 * إرسال إشعار تعميم (Broadcast) لمجموعة من المستخدمين
 * @param {Object} broadcastData - { targetAudience: string, title: string, content: string }
 */
export const sendBroadcastApi = async (broadcastData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/Admin/notifications/broadcast`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(broadcastData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "حدث خطأ أثناء إرسال التعميم الإداري.");
    }

    return await response.json();
};