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
            <Route
                path={ROUTES.SETUP_ACCOUNT}
                element={<h1>Setup Account</h1>}
            />
            <Route element={<GuestRoute />}>
                <Route path={ROUTES.LOGIN} element={<h1>LoginPage</h1>} />
            </Route>
        </Routes>
    );
}

describe("GuestRoute - Internal redierct", () => {
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

    test("should redirect to previous page when location state has from pathname", async () => {
        // This test case test when user being redirected to login page
        // from a protected route, after login success, user should be
        // redirected back to the protected route
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: {
                pathname: ROUTES.LOGIN,
                state: { from: { pathname: ROUTES.TEST_MAIN } },
            },
        });

        await waitFor(() => {
            // Assert redirected to protected page
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        // Assert API call and no validation error happened
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });
});

describe("GuestRoute - External Redirect", () => {
    let replaceMock;
    const externalUrl =
        "http://course.eduscrum.local:5174/callback?redirect=/dashboard";
    const routeWithRedirect = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(externalUrl)}`;

    beforeEach(() => {
        replaceMock = vi.fn((url) => console.log("replace called with:", url));
        Object.defineProperty(window, "location", {
            value: { ...window.location, replace: replaceMock },
            writable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("should redirect to external url when redirect param exists", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: routeWithRedirect,
        });

        await waitFor(() => {
            // Assert redirected to external url
            expect(replaceMock).toHaveBeenCalledWith(externalUrl);
            expect(replaceMock).toHaveBeenCalledTimes(1);
        });

        // Assert API call and no validation error happened
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should redirect to setup account with redirect param preserved when first_time_setup is true", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } }, // first_time_setup: true
            route: routeWithRedirect,
        });

        await waitFor(() => {
            // Assert redirected to setup account page
            expect(screen.getByText(/setup account/i)).toBeInTheDocument();
        });

        // Should NOT do external redirect - setup account takes priority
        expect(replaceMock).not.toHaveBeenCalled();
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });
});
