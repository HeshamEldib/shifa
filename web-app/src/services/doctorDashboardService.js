const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getDoctorOverviewApi = async () => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/api/Doctors/dashboard-overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error("فشل جلب بيانات لوحة التحكم");
    }
    
    return await response.json();
};