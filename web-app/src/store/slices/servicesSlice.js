import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllServices } from "../../services/servicesService";

// Thunks لجلب البيانات من الـ API
export const fetchServices = createAsyncThunk(
    "data/fetchServices",
    async (_, thunkAPI) => {
        try {
            return await getAllServices();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

const servicesSlice = createSlice({
    name: "services",
    initialState: {
        data: [],
        isLoading: false,
        isLoaded: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // حالات الخدمات (Services)
            .addCase(fetchServices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.isLoaded = true;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default servicesSlice.reducer;
