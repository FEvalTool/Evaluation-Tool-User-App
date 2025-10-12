import { lazy } from "react";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// lazy load pages for code splitting
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const TestPage = lazy(() => import("../pages/TestPage"));

export const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [{ path: "test", element: <TestPage /> }],
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
