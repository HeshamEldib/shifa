import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorsReducer from "./slices/doctorsSlice";
import servicesReducer from "./slices/servicesSlice";
import userProfileReducer from "./slices/userProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    services: servicesReducer,
    userProfile: userProfileReducer,
  },
});