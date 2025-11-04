import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./authSlice";
import MessageReducer from "./messageSlice";

export default configureStore({
    reducer: {
        auth: AuthReducer,
        message: MessageReducer,
    },
});
