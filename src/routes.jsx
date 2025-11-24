import { lazy } from "react";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import GuestRoute from "./middlewares/GuestRoute";

// lazy load pages for code splitting
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const TestPage = lazy(() => import("./pages/TestPage"));
const TestOnePage = lazy(() => import("./pages/TestOnePage"));
const SetupAccountPage = lazy(() => import("./pages/SetupAccountPage"));

export const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "test", element: <TestPage /> },
                    { path: "setup-account", element: <SetupAccountPage /> },
                ],
            },
        ],
    },
    {
        path: "/auth",
        element: <GuestRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: "login", element: <LoginPage /> },
                    {
                        path: "forgot-password",
                        element: <ForgotPasswordPage />,
                    },
                    { path: "test", element: <TestPage /> },
                ],
            },
        ],
    },
];
