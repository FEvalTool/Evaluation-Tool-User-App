import { useEffect, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import { routes } from "./routes/index.jsx";
import { clearMessage } from "./slices/messageSlice";

function AppRoutes() {
    return useRoutes(routes);
}

function App() {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const { type, content, key } = useSelector((state) => state.message);

    useEffect(() => {
        if (content) {
            messageApi.open({ type, content });
            dispatch(clearMessage());
        }
    }, [key]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {contextHolder}
            <AppRoutes />
        </Suspense>
    );
}

export default App;
