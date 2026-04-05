import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const token = localStorage.getItem('token');

    // إذا كان هناك توكن، اسمح له بالمرور. إذا لم يوجد، وجهه لصفحة تسجيل الدخول.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;