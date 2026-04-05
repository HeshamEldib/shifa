import { createSlice } from "@reduxjs/toolkit";

// نجلب البيانات المبدئية من المتصفح عشان لو عمل Refresh ما يخرجش من الحساب
const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || "Patient",
  userId: localStorage.getItem("userId") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // دالة تسجيل الدخول
    setCredentials: (state, action) => {
      const { token, role, userId } = action.payload;
      state.token = token;
      state.role = role;
      state.userId = userId;
      state.isAuthenticated = true;

      // نحفظ في الـ LocalStorage عشان الـ Refresh
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (userId) localStorage.setItem("userId", userId);
    },
    // دالة تسجيل الخروج
    logout: (state) => {
      state.token = null;
      state.role = "Patient";
      state.userId = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;