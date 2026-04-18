const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getPatientRecordsApi = async (patientId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/MedicalRecords/patient/${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 404) return []; // المريض ليس لديه سجلات بعد
    if (!response.ok) throw new Error("فشل جلب السجلات الطبية");
    return await response.json();
};

export const addMedicalRecordApi = async (recordData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/MedicalRecords`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "فشل حفظ السجل الطبي");
    }
    return await response.json();
};

// export const getMedicationsApi = async () => {
//     const response = await fetch(`${API_URL}/api/Medications`);
//     if (!response.ok) throw new Error("فشل جلب قائمة الأدوية");
//     return await response.json();
// };