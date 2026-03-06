import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./authSlice";
import AvatarReducer from "./avatarSlice";
import MessageReducer from "./messageSlice";

export default configureStore({
    reducer: {
        auth: AuthReducer,
        avatar: AvatarReducer,
        message: MessageReducer,
    },
});
