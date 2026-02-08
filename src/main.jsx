import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import App from "./App.jsx";
import "./assets/global.css";
import store from "./slices/store.js";
import { themeConfig } from "./configs/themeConfig.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <ConfigProvider theme={themeConfig}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    </StrictMode>,
);
