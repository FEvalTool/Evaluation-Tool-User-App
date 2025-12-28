import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showMessage } from "./messageSlice";
import authService from "../services/authService";
import accountService from "../services/accountService";

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

export const setupPasswordFirstTime = createAsyncThunk(
    "auth/setupPassword",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            await accountService.setPassword(values);
            const response = await accountService.getUserInfo();
            dispatch(
                showMessage({
                    type: "success",
                    content: "Set password successfully",
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
)

export const setupSecurityQAFirstTime = createAsyncThunk(
    "auth/setupSecurityQA",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            await accountService.setSecurityQA(values);
            const response = await accountService.getUserInfo();
            dispatch(
                showMessage({
                    type: "success",
                    content: "Set security QA successfully",
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
)

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
            })
            .addCase(setupPasswordFirstTime.pending, (state) => {
                state.loading = true;
            })
            .addCase(setupPasswordFirstTime.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user["first_time_setup"]) {
                    state.user["first_time_setup"] = action.payload.user["first_time_setup"]
                    state.user["is_password_setup"] = action.payload.user["is_password_setup"]
                    state.user["is_security_qa_setup"] = action.payload.user["is_security_qa_setup"]
                } else {
                    delete state.user["first_time_setup"]
                    delete state.user["is_password_setup"]
                    delete state.user["is_security_qa_setup"]
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify(state.user)
                );
            })
            .addCase(setupPasswordFirstTime.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(setupSecurityQAFirstTime.pending, (state) => {
                state.loading = true;
            })
            .addCase(setupSecurityQAFirstTime.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user["first_time_setup"]) {
                    state.user["first_time_setup"] = action.payload.user["first_time_setup"]
                    state.user["is_password_setup"] = action.payload.user["is_password_setup"]
                    state.user["is_security_qa_setup"] = action.payload.user["is_security_qa_setup"]
                } else {
                    delete state.user["first_time_setup"]
                    delete state.user["is_password_setup"]
                    delete state.user["is_security_qa_setup"]
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify(state.user)
                );
            })
            .addCase(setupSecurityQAFirstTime.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
