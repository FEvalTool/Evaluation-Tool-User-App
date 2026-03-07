import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import App from "./App.jsx";
import "./assets/global.css";
import store from "./slices/store.js";
import { appThemeConfig } from "./configs/themeConfig.js";

// Dependency injection
import { injectDispatch } from "./services/request";
injectDispatch(store.dispatch);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <ConfigProvider theme={appThemeConfig}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    </StrictMode>,
);
