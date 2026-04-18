import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { getUnreadCountApi } from "../services/notificationService";
import "./NotificationBell.css";

function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchCount = async () => {
            const count = await getUnreadCountApi();
            setUnreadCount(count);
        };

        fetchCount();
        // اختياري: تحديث العدد كل دقيقتين
        const interval = setInterval(fetchCount, 120000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="nav-notification-wrapper"
            onClick={() =>
                navigate(
                    role === "Patient"
                        ? "/patient/notifications"
                        : role === "Admin"
                            ? "/admin/notifications"
                            : "/doctor/notifications",
                )
            }
        >
            <Bell size={22} className="nav-bell-icon" />
            {unreadCount > 0 && (
                <span className="notification-badge">
                    {unreadCount > 9 ? "+9" : unreadCount}
                </span>
            )}
        </div>
    );
}

export default NotificationBell;
