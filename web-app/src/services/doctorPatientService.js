const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getDoctorPatientsApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Doctors/my-patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        // بيانات وهمية (Mock Data) لاختبار الواجهة
        return [
            { patientID: 'p1', name: 'أحمد محمود', age: 34, gender: 'Male', phone: '01012345678', lastVisit: '2026-03-15', totalVisits: 3 },
            { patientID: 'p2', name: 'سارة خالد', age: 28, gender: 'Female', phone: '01198765432', lastVisit: '2026-04-01', totalVisits: 1 },
            { patientID: 'p3', name: 'محمد عبد الله', age: 45, gender: 'Male', phone: '01234567890', lastVisit: '2026-01-20', totalVisits: 5 },
            { patientID: 'p4', name: 'فاطمة علي', age: 52, gender: 'Female', phone: '01555555555', lastVisit: '2026-04-05', totalVisits: 2 },
        ];
    }
    
    const data = await response.json();
    console.log("data =>", data);
    
    return data;
};