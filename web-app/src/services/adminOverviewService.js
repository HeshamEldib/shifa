const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getAdminOverviewApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Admin/dashboard-overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        throw new Error("فشل في جلب بيانات لوحة التحكم");
    }
    return await response.json();
};