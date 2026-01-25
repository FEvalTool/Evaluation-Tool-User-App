import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: null,
    message: null,
    code: null,
    error: [],
    key: 0,
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        showMessage: (state, action) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.code = action.payload.code ? action.payload.code : null;
            state.error = action.payload.error ? action.payload.error : [];
            state.key++;
        },
        clearMessage: (state) => {
            state.type = null;
            state.message = null;
            state.code = null;
            state.error = [];
        },
    },
});

export const { showMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
