import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { accountData } from "../../mocks/data/account";
import {
    requestCallTracker,
    requestValidationErrorTracker,
    responseQueue,
} from "../../mocks/mockServer";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import GuestRoute from "../../../src/middlewares/GuestRoute";
import { ROUTES } from "../../../src/constants";

function AppRouter() {
    return (
        <Routes>
            <Route path={ROUTES.TEST_MAIN} element={<h1>Dashboard</h1>} />
            <Route element={<GuestRoute />}>
                <Route path={ROUTES.LOGIN} element={<h1>LoginPage</h1>} />
            </Route>
        </Routes>
    );
}

describe("GuestRoute", () => {
    test("should show protected page when token valid", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(
            () => {
                // Assert redirected to protected page
                expect(screen.getByText("Dashboard")).toBeInTheDocument();
            },
            /**
             * (Optional) NOTE: Extended timeout needed here (10000ms vs default 1000ms)
             *
             * This test simulates the full token refresh flow which requires waiting for:
             * - 3 sequential MSW mock API responses
             * - Multiple state updates in useAuthValidator hook
             * - React Router navigation component rendering
             *
             * Without the extended timeout, the test passes in normal runs but can fail
             * inconsistently when debugging due to timing differences in React's rendering cycle.
             */
            { timeout: 10000 },
        );

        // Assert API call and no validation error happened
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should show protected page when token expired but refresh success", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);
        responseQueue.add(REQUEST_KEYS.REFRESH_TOKEN, 200);
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(
            () => {
                // Assert redirected to protected page
                expect(screen.getByText("Dashboard")).toBeInTheDocument();
            },
            // (Optional) Add and increase timeout when debugging
            // to avoid false positive when running navigation
            // (Explain above)
            { timeout: 10000 },
        );

        // Assert API call and no validation error happened
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(2);
        expect(requestCallTracker.get(REQUEST_KEYS.REFRESH_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should redirect to current page (Outlet - Login) when refresh token failed", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);
        responseQueue.add(REQUEST_KEYS.REFRESH_TOKEN, 401);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(() => {
            // Assert redirected to current page (Outlet - Login)
            expect(screen.getByText("LoginPage")).toBeInTheDocument();
        });

        // Assert API call and no validation error happened
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestCallTracker.get(REQUEST_KEYS.REFRESH_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should redirect to current page (Outlet - Login) when token failed and not refresh token", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(() => {
            // Assert redirected to current page (Outlet - Login)
            expect(screen.getByText("LoginPage")).toBeInTheDocument();
        });

        // Assert API call and no validation error happened
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });
});
