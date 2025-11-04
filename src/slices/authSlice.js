import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showMessage } from "./messageSlice";
import authServices from "../services/authServices";

export const login = createAsyncThunk(
    "auth/login",
    async (values, { dispatch, rejectWithValue }) => {
        try {
            const response = await authServices.login(values);
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

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))
            : null,
        loading: false,
    },
    reducers: {
        logout: (state, action) => {
            state.user = null;
            localStorage.removeItem("user");
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
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
