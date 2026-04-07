const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getNotificationsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("فشل جلب الإشعارات");
    return await response.json();
};

export const markAsReadApi = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/Notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const markAllAsReadApi = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/Notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const getUnreadCountApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Notifications/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count;
};