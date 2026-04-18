const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5038";

export const getMedicinesApi = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/Medications`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return []; // يمكن وضع بيانات وهمية هنا للاختبار
    return await response.json();
};

export const saveMedicineApi = async (medicine) => {
    const token = localStorage.getItem("token");
    const method = medicine.medicationID ? 'PUT' : 'POST';
    const url = medicine.medicationID ? `${API_URL}/api/Medications/${medicine.medicationID}` : `${API_URL}/api/Medications`;

    await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine)
    });
};