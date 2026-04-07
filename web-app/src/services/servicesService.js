const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038"; // تأكد من البورت الخاص بك

// جلب جميع الخدمات (التخصصات)
export const getAllServices = async () => {
    const response = await fetch(`${API_URL}/api/services`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error("تعذر جلب قائمة الخدمات");
    
    return await response.json();
};