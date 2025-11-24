import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../../src/middlewares/ProtectedRoute";
import authService from "../../src//services/authService";
import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import { ROUTES } from "../../src/constants";

vi.mock("../../src/services/authService");

function AppRouter() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.TEST_MAIN} element={<div>Dashboard</div>} />
                <Route
                    path={ROUTES.SETUP_ACCOUNT}
                    element={<div>SetupPage</div>}
                />
            </Route>
            <Route path={ROUTES.LOGIN} element={<div>LoginPage</div>} />
        </Routes>
    );
}

describe("ProtectedRoute", () => {
    test("should show protected page when token valid", async () => {
        authService.verifyToken.mockResolvedValueOnce({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
    });

    test("should show protected page when token expired but refresh success", async () => {
        authService.verifyToken.mockRejectedValueOnce({
            response: { status: 401 },
        });
        authService.refreshToken.mockResolvedValueOnce({});
        authService.verifyToken.mockResolvedValueOnce({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
    });

    test("should redirect to login page when refresh token failed", async () => {
        authService.verifyToken.mockRejectedValue({
            response: { status: 401 },
        });
        authService.refreshToken.mockRejectedValue({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() =>
            expect(screen.getByText("LoginPage")).toBeInTheDocument()
        );
    });

    test("should prevent accessing other page (except setup account page) if user first time setup account", async () => {
        authService.verifyToken.mockResolvedValue({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() =>
            expect(screen.getByText("SetupPage")).toBeInTheDocument()
        );
    });

    test("should prevent accessing setup account page when user already setup account", async () => {
        authService.verifyToken.mockResolvedValue({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.SETUP_ACCOUNT,
        });

        await waitFor(() =>
            expect(screen.getByText("Dashboard")).toBeInTheDocument()
        );
    });
});
