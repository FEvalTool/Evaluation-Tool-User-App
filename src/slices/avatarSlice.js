import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "../services/accountService";

export const fetchAvatar = createAsyncThunk(
    "avatar/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await accountService.getUserAvatar();
            return response.data.data;
        } catch {
            return rejectWithValue();
        }
    },
);

export const uploadAvatar = createAsyncThunk(
    "avatar/upload",
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await accountService.uploadUserAvatar(formData);
            return response.data.data;
        } catch (err) {
            const apiError = err.response?.data;
            return rejectWithValue({
                message:
                    apiError?.message ||
                    "Something went wrong when uploading avatar",
                code: apiError?.code,
                backend: apiError,
            });
        }
    },
);

export const deleteAvatar = createAsyncThunk(
    "avatar/delete",
    async (_, { rejectWithValue }) => {
        try {
            await accountService.deleteUserAvatar();
        } catch (err) {
            const apiError = err.response?.data;
            return rejectWithValue({
                message:
                    apiError?.message ||
                    "Something went wrong when deleting avatar",
                code: apiError?.code,
                backend: apiError,
            });
        }
    },
);

const avatarSlice = createSlice({
    name: "avatar",
    initialState: {
        url: localStorage.getItem("avatar")
            ? localStorage.getItem("avatar")
            : null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvatar.fulfilled, (state, action) => {
                state.url = action.payload;
                localStorage.setItem("avatar", action.payload);
            })
            .addCase(fetchAvatar.rejected, (state) => {
                state.url = null;
                localStorage.removeItem("avatar");
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.url = action.payload;
                localStorage.setItem("avatar", action.payload);
            })
            .addCase(deleteAvatar.fulfilled, (state) => {
                state.url = null;
                localStorage.removeItem("avatar");
            });
    },
});

export default avatarSlice.reducer;
