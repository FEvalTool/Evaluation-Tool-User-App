import { Route, Routes } from "react-router";

import AuthLayout from "./components/layouts/AuthLayout";
import MainLayout from "./components/layouts/MainLayout";
import Test from "./pages/Test";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/test-auth" element={<Test />} />
                <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/test-main" element={<Test />} />
            </Route>
        </Routes>
    );
}

export default App;
