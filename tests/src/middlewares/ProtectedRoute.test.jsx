import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";

import { accountData } from "../../mocks/data/account";
import {
    requestCallTracker,
    requestValidationErrorTracker,
    responseQueue,
} from "../../mocks/mockServer";
import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import { ROUTES } from "../../../src/constants";
import ProtectedRoute from "../../../src/middlewares/ProtectedRoute";

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
    test("should show protected page when token valid for active user", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should show setup account page when token valid for new user", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });

        await waitFor(() => {
            expect(screen.getByText("SetupPage")).toBeInTheDocument();
        });
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should show protected page when token expired but refresh success", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);
        responseQueue.add(REQUEST_KEYS.REFRESH_TOKEN, 200);
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(2);
        expect(requestCallTracker.get(REQUEST_KEYS.REFRESH_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should redirect to login page when refresh token failed - for active user", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);
        responseQueue.add(REQUEST_KEYS.REFRESH_TOKEN, 401);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(
            () => {
                expect(screen.getByText("LoginPage")).toBeInTheDocument();
            },
            // (Optional) Add and increase timeout when debugging
            // to avoid false positive when running navigation
            // (Explain in GuestRoute.test.jsx)
            { timeout: 10000 },
        );
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestCallTracker.get(REQUEST_KEYS.REFRESH_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should redirect to login page when verify token failed - for new user", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });

        await waitFor(
            () => {
                expect(screen.getByText("LoginPage")).toBeInTheDocument();
            },
            // (Optional) Add and increase timeout when debugging
            // to avoid false positive when running navigation
            // (Explain in GuestRoute.test.jsx)
            { timeout: 10000 },
        );
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should prevent new user accessing other page (except setup account page)", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(
            () => {
                expect(screen.getByText("SetupPage")).toBeInTheDocument();
            },
            // (Optional) Add and increase timeout when debugging
            // to avoid false positive when running navigation
            // (Explain in GuestRoute.test.jsx)
            { timeout: 10000 },
        );
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should prevent active user accessing setup account page", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.SETUP_ACCOUNT,
        });

        await waitFor(
            () => {
                expect(screen.getByText("Dashboard")).toBeInTheDocument();
            },
            // (Optional) Add and increase timeout when debugging
            // to avoid false positive when running navigation
            // (Explain in GuestRoute.test.jsx)
            { timeout: 10000 },
        );
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });
});
