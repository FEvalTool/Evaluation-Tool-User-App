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
            payload = { user: response.data.user };
            if (response.data["scope_exp"]) {
                payload["scopeExp"] = response.data["scope_exp"];
            }
            return payload;
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
            // If user complete setup account
            // We don't want first_time_setup to be false
            // If this flag is false => will redirect to dashboard page
            // => redirect to login page (no access token) (scope token still exist)
            let userPayload = response.data.user;
            if (!userPayload["first_time_setup"]) {
                userPayload["first_time_setup"] = true;
                userPayload["is_password_setup"] = true;
                userPayload["is_security_qa_setup"] = true;
            }
            return { user: userPayload };
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
            // Same issue mentioned in setupPasswordFirstTime
            let userPayload = response.data.user;
            if (!userPayload["first_time_setup"]) {
                userPayload["first_time_setup"] = true;
                userPayload["is_password_setup"] = true;
                userPayload["is_security_qa_setup"] = true;
            }
            return { user: userPayload };
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
        scopeExp: localStorage.getItem("scopeExp")
            ? JSON.parse(localStorage.getItem("scopeExp"))
            : 0, // Expire time for scope token
        loading: false,
    },
    reducers: {
        setZeroScopeExp(state) {
            state.scopeExp = 0;
        },
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
                state.user = null;
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

export const { setZeroScopeExp } = authSlice.actions;
export default authSlice.reducer;
