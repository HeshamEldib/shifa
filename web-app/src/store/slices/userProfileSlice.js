import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile, updateUserProfileApi, uploadProfileImageApi } from "../../services/userProfileService";

// Thunks لجلب البيانات من الـ API
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, thunkAPI) => {
        try {
            return await getUserProfile();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

export const updateProfile = createAsyncThunk(
    "userProfile/update",
    async (data, thunkAPI) => {
        try {
            const updatedUser = await updateUserProfileApi(data);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) { return thunkAPI.rejectWithValue(error.message); }
    }
);

export const updateProfileImage = createAsyncThunk(
    "userProfile/updateImage",
    async (file, thunkAPI) => {
        try {
            const data = await uploadProfileImageApi(file);
            // نفترض أن الباك إند يعيد كائن المستخدم كاملاً أو رابط الصورة
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const newUser = { ...currentUser, image: data.imageUrl };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        } catch (error) { return thunkAPI.rejectWithValue(error.message); }
    }
);

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: {
        data: null,
        isLoading: false,
        isLoaded: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoaded = true;
                state.data = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default userProfileSlice.reducer;
