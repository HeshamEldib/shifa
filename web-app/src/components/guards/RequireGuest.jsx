import { Navigate, Outlet } from 'react-router-dom';

const RequireGuest = () => {
    // نتحقق من وجود التوكن (يمكنك تعديلها إذا كنت تستخدم Context API)
    const token = localStorage.getItem('token'); 

    // إذا لم يكن هناك توكن، اسمح له بالمرور (Outlet). إذا وجد توكن، وجهه للرئيسية.
    return !token ? <Outlet /> : <Navigate to="/" replace />; 
};

export default RequireGuest;