import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = (role) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!role.role) {
        // إذا كان هناك توكن، اسمح له بالمرور. إذا لم يوجد، وجهه لصفحة تسجيل الدخول.
        return token ? <Outlet /> : <Navigate to="/login" replace />;
    } else {
        // إذا كان هناك توكن والدور يطابق، اسمح له بالمرور. إذا لم يوجد توكن أو الدور لا يطابق، وجهه لصفحة تسجيل الدخول.
        return token && userRole === role.role ? (
            <Outlet />
        ) : (
            <Navigate to="/login" replace />
        );
    }
};

export default RequireAuth;
