import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";

import GuestRoute from "../../src/middlewares/GuestRoute";
import authService from "../../src//services/authService";
import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { ROUTES } from "../../src/constants";

vi.mock("../../src/services/authService");

function AppRouter() {
    return (
        <Routes>
            <Route path={ROUTES.TEST_MAIN} element={<div>Dashboard</div>} />
            <Route element={<GuestRoute />}>
                <Route path={ROUTES.LOGIN} element={<div>LoginPage</div>} />
            </Route>
        </Routes>
    );
}

describe("GuestRoute", () => {
    test("should show protected page when token valid", async () => {
        authService.verifyToken.mockResolvedValueOnce({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: { first_time_setup: false } } },
            route: ROUTES.LOGIN,
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
            preloadedState: { auth: { user: { first_time_setup: false } } },
            route: ROUTES.LOGIN,
        });

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
    });

    test("should redirect to current page (Outlet) when refresh token failed", async () => {
        authService.verifyToken.mockRejectedValue({
            response: { status: 401 },
        });
        authService.refreshToken.mockRejectedValue({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: { first_time_setup: false } } },
            route: ROUTES.LOGIN,
        });

        await waitFor(() =>
            expect(screen.getByText("LoginPage")).toBeInTheDocument()
        );
    });
});
