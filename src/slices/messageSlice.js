import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: null,
    content: null,
    key: 0,
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        showMessage: (state, action) => {
            state.type = action.payload.type;
            state.content = action.payload.content;
            state.key++;
        },
        clearMessage: (state) => {
            state.type = null;
            state.content = null;
        },
    },
});

export const { showMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
