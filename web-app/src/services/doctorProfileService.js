const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getDoctorProfileApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        // بيانات وهمية (Mock Data) للاختبار
        return {
            fullName: 'هشام الديب',
            email: 'h2@example.com',
            phone: '01012345678',
            gender: 'Male',
            image: '',
            specialization: 'باطنة وجهاز هضمي',
            bio: 'طبيب استشاري بخبرة 10 سنوات في علاج أمراض الجهاز الهضمي والمناظير.',
            quote: 'الوقاية خير من العلاج، وصحتك هي رأس مالك.'
        };
    }
    return await response.json();
};

export const updateDoctorProfileApi = async (profileData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Users/profile`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });

    if (!response.ok) throw new Error("فشل تحديث الملف الشخصي");
    return true;
};

export const getWorkingHoursApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Users/working-hours`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        // بيانات وهمية افتراضية إذا لم يكن هناك بيانات
        return [
            { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '17:00', isDayOff: false },
            { dayOfWeek: 'Sunday', startTime: '09:00', endTime: '17:00', isDayOff: false },
            { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isDayOff: false },
            { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isDayOff: false },
            { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isDayOff: false },
            { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '14:00', isDayOff: false },
            { dayOfWeek: 'Friday', startTime: '00:00', endTime: '00:00', isDayOff: true },
        ];
    }
    return await response.json();
};

// حفظ أوقات العمل
export const updateWorkingHoursApi = async (hoursData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Users/working-hours`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hoursData)
    });
    if (!response.ok) throw new Error("فشل تحديث أوقات العمل");
    return true;
};