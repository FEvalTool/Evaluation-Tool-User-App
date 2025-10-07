import { Route, Routes } from "react-router-dom";

import AuthLayout from "./components/layouts/AuthLayout";
import MainLayout from "./components/layouts/MainLayout";
import Test from "./pages/Test";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/test-auth" element={<Test />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/test-main" element={<Test />} />
            </Route>
        </Routes>
    );
}

export default App;
