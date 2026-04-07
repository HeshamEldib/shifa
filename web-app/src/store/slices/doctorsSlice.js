import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDoctors } from "../../services/doctorsService";

// Thunks لجلب البيانات من الـ API
export const fetchDoctors = createAsyncThunk(
    "data/fetchDoctors",
    async (_, thunkAPI) => {
        try {
            return await getAllDoctors();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

const doctorsSlice = createSlice({
    name: "doctors",
    initialState: {
        data: [],
        isLoading: false,
        isLoaded: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // حالات الأطباء (Doctors)
            .addCase(fetchDoctors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoaded = true;
                state.data = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default doctorsSlice.reducer;
