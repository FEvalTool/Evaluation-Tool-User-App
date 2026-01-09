import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";

import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import { server } from "../mocks/server";
import {
    requestCallTracker,
    REQUEST_KEYS,
    requestValidationErrorTracker,
} from "../helpers/requestHelpers";
import { verifyTokenSchema } from "../schemas/authSchema";
import GuestRoute from "../../src/middlewares/GuestRoute";
import { ROUTES } from "../../src/constants";
import { beforeEach } from "vitest";

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

const createResponseQueue = () => {
    const queues = new Map();

    return {
        add: (key, status, data = {}) => {
            if (!queues.has(key)) {
                queues.set(key, []);
            }
            queues.get(key).push({ status, data });
        },
        next: (key) => {
            const queue = queues.get(key);
            if (!queue || queue.length === 0) {
                throw new Error(`No queued response for ${key}`);
            }
            return queue.shift();
        },
        clear: () => {
            queues.clear();
        },
    };
};

const responseQueue = createResponseQueue();

describe("GuestRoute", () => {
    beforeEach(() => {
        responseQueue.clear();

        server.use(
            http.post("/auth/token/verify", async ({ request }) => {
                const body = await request.json();
                const validation = verifyTokenSchema.safeParse(body);

                if (!validation.success) {
                    requestValidationErrorTracker.record({
                        endpoint: REQUEST_KEYS.VERIFY_TOKEN,
                        issues: validation.error.issues,
                        payload: body,
                    });
                    return HttpResponse.json(
                        { message: "Invalid request payload" },
                        { status: 400 }
                    );
                }

                requestCallTracker.track(REQUEST_KEYS.VERIFY_TOKEN);
                const response = responseQueue.next(REQUEST_KEYS.VERIFY_TOKEN);
                return HttpResponse.json(response.data, {
                    status: response.status,
                });
            }),

            http.post("/auth/token/refresh", async () => {
                requestCallTracker.track(REQUEST_KEYS.REFRESH_TOKEN);
                const response = responseQueue.next(REQUEST_KEYS.REFRESH_TOKEN);
                return HttpResponse.json(response.data, {
                    status: response.status,
                });
            })
        );
    });
    test("should show protected page when token valid", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 200);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(
            () => {
                expect(screen.getByText("Dashboard")).toBeInTheDocument();
            },
            /**
             * NOTE: Extended timeout needed here (10000ms vs default 1000ms)
             *
             * This test simulates the full token refresh flow which requires waiting for:
             * - 3 sequential MSW mock API responses
             * - Multiple state updates in useAuthValidator hook
             * - React Router navigation component rendering
             *
             * Without the extended timeout, the test passes in normal runs but can fail
             * inconsistently when debugging due to timing differences in React's rendering cycle.
             */
            { timeout: 10000 }
        );

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
                expect(screen.getByText("Dashboard")).toBeInTheDocument();
            },
            // Add and increase timeout when debugging
            // to avoid false positive when running navigation
            // (Explain above)
            { timeout: 10000 }
        );
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(2);
        expect(requestCallTracker.get(REQUEST_KEYS.REFRESH_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });

    test("should redirect to current page (Outlet) when refresh token failed", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);
        responseQueue.add(REQUEST_KEYS.REFRESH_TOKEN, 401);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(() => {
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(screen.getByText("LoginPage")).toBeInTheDocument();
        });
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestCallTracker.get(REQUEST_KEYS.REFRESH_TOKEN)).toBe(1);
    });

    test("should redirect to current page (Outlet) when token failed and not refresh token", async () => {
        responseQueue.add(REQUEST_KEYS.VERIFY_TOKEN, 401);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.LOGIN,
        });

        await waitFor(() => {
            expect(screen.getByText("LoginPage")).toBeInTheDocument();
        });
        expect(requestCallTracker.get(REQUEST_KEYS.VERIFY_TOKEN)).toBe(1);
        expect(requestValidationErrorTracker.getAll()).toEqual([]);
    });
});
