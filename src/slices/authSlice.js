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
            let payload = { user: response.data.user };
            if (response.data["scope_exp"]) {
                payload["scopeExp"] = response.data["scope_exp"];
            }
            return payload;
        } catch (err) {
            dispatch(
                showMessage({
                    type: "error",
                    content:
                        err?.response?.data?.message || "Something went wrong",
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
                    content:
                        err?.response?.data?.message || "Something went wrong",
                })
            );
            return rejectWithValue();
        }
    }
);

// Helper function for common setup logic
const handleSetupCompletion = async (
    setupAction,
    values,
    successMessage,
    dispatch
) => {
    await setupAction(values);
    const response = await accountService.getUserSetupStatus();

    dispatch(
        showMessage({
            type: "success",
            content: successMessage,
        })
    );

    // If user complete setup account, preserve first_time_setup flag
    let userPayload = response.data.user;
    if (!userPayload["first_time_setup"]) {
        userPayload = {
            ...userPayload,
            first_time_setup: true,
            is_password_setup: true,
            is_security_qa_setup: true,
        };
    }

    return { user: userPayload };
};

export const setupPasswordFirstTime = createAsyncThunk(
    "auth/setupPassword",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            return await handleSetupCompletion(
                accountService.setPassword,
                values,
                "Set password successfully",
                dispatch
            );
        } catch (err) {
            dispatch(
                showMessage({
                    type: "error",
                    content:
                        err?.response?.data?.message || "Something went wrong",
                })
            );
            return rejectWithValue();
        }
    }
);

export const setupSecurityQAFirstTime = createAsyncThunk(
    "auth/setupSecurityQA",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            return await handleSetupCompletion(
                accountService.setSecurityQA,
                values,
                "Set security QA successfully",
                dispatch
            );
        } catch (err) {
            dispatch(
                showMessage({
                    type: "error",
                    content:
                        err?.response?.data?.message || "Something went wrong",
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
            : {},
        scopeExp: localStorage.getItem("scopeExp")
            ? parseInt(localStorage.getItem("scopeExp"), 10)
            : 0, // Expire time for scope token
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
                if (action.payload.scopeExp) {
                    state.scopeExp = action.payload.scopeExp;
                    localStorage.setItem("scopeExp", action.payload.scopeExp);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {};
                state.scopeExp = 0;
                localStorage.removeItem("user");
                localStorage.removeItem("scopeExp");
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(setupPasswordFirstTime.pending, (state) => {
                state.loading = true;
            })
            .addCase(setupPasswordFirstTime.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
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
                state.user = action.payload.user;
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );
            })
            .addCase(setupSecurityQAFirstTime.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
