import React, { useState } from "react";
import DoctorProfile from "./DoctorProfile";
import DoctorWorkingTime from "./DoctorWorkingTime";
import { User, CalendarDays } from "lucide-react";
import "./DoctorProfile.css";

function DoctorSettings() {
    const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'schedule'

    return (
        <div className="doctor-settings-page fade-in-up">
            {/* 1. قائمة التبويبات (Tabs Navigation) */}
            <div className="settings-tabs-container">
                <button
                    className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    <User size={18} /> الملف الشخصي للعيادة
                </button>
                <button
                    className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
                    onClick={() => setActiveTab("schedule")}
                >
                    <CalendarDays size={18} /> أوقات العمل والمواعيد
                </button>
            </div>

            {/* {saveMessage && (
        <div className={`custom-alert ${saveMessage.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
          {saveMessage.text}
        </div>
      )} */}

            {/* ========================================= */}
            {/* 2. محتوى تبويب الملف الشخصي */}
            {/* ========================================= */}
            {activeTab === "profile" && <DoctorProfile />}

            {/* ========================================= */}
            {/* 3. محتوى تبويب أوقات العمل */}
            {/* ========================================= */}
            {activeTab === "schedule" && <DoctorWorkingTime />}
        </div>
    );
}

export default DoctorSettings;
