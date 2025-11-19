import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showMessage } from "./messageSlice";
import authService from "../services/authService";

export const login = createAsyncThunk(
    "auth/login",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.login(values);
            dispatch(
                showMessage({
                    type: "success",
                    content: response.data.message,
                })
            );
            return { user: response.data.user };
        } catch (err) {
            dispatch(
                showMessage({
                    type: "error",
                    content: err.response.data.message,
                })
            );
            return rejectWithValue();
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            if (values["first_time_setup"]) {
                await authService.deleteScopeToken();
            } else {
                await authService.logout();
            }
            dispatch(
                showMessage({
                    type: "success",
                    content: "Logout successfully",
                })
            );
        } catch (err) {
            dispatch(
                showMessage({
                    type: "error",
                    content: err.response.data.message,
                })
            );
            return rejectWithValue();
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))
            : null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                localStorage.removeItem("user");
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
