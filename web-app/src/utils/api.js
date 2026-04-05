// عنوان السيرفر الأساسي (الباك إند)
const BASE_URL = "http://localhost:5038";

export const fetchWithAuth = async (endpoint, options = {}) => {
  // 1. جلب التوكن من التخزين المحلي (الذي وضعه Redux)
  const token = localStorage.getItem("token");

  // 2. تجهيز الـ Headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 3. إضافة التوكن إذا كان موجوداً
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // 4. تنفيذ الطلب الفعلي
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 5. التحقق من انتهاء صلاحية التوكن (Unauthorized)
    if (response.status === 401) {
      console.error("Token expired or invalid. Please login again.");
      // يمكنك هنا استدعاء دالة تسجيل الخروج من Redux لاحقاً
      // أو توجيه المستخدم لصفحة اللوجين
    }

    return response;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};