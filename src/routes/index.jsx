import { lazy } from "react";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../middlewares/ProtectedRoute";

// lazy load pages for code splitting
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const TestPage = lazy(() => import("../pages/TestPage"));
const TestOnePage = lazy(() => import("../pages/TestOnePage"));
const TestTwoPage = lazy(() => import("../pages/TestTwoPage"));

export const routes = [
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: "test", element: <TestPage /> },
                    { path: "test1", element: <TestOnePage /> },
                    { path: "test2", element: <TestTwoPage /> },
                ],
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "forgot-password", element: <ForgotPasswordPage /> },
            { path: "test", element: <TestPage /> },
        ],
    },
];
