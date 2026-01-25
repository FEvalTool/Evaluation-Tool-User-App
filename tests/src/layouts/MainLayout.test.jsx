import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { accountData } from "../../mocks/data/account";
import { requestCallTracker, responseQueue } from "../../mocks/mockServer";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import { ROUTES } from "../../../src/constants";
import MainLayout from "../../../src/layouts/MainLayout";
import MessageWrapper from "../../../src/components/MessageWrapper";

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route
                        path={ROUTES.TEST_MAIN}
                        element={<div>Dashboard</div>}
                    />
                </Route>
                <Route path={ROUTES.LOGIN} element={<div>Login</div>} />
            </Routes>
        </MessageWrapper>
    );
}

describe("MainLayout", () => {
    it("should logout everything - new user", async () => {
        localStorage.setItem("user", accountData[0]);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN),
            ).toBe(1);
            expect(screen.getByText("Login")).toBeInTheDocument();
            expect(localStorage.getItem("user")).toBe(null);
        });
    });

    it("should logout everything - active user", async () => {
        localStorage.setItem("user", accountData[1]);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            expect(requestCallTracker.get(REQUEST_KEYS.LOGOUT)).toBe(1);
            expect(screen.getByText("Login")).toBeInTheDocument();
            expect(localStorage.getItem("user")).toBe(null);
        });
    });

    it("should display error when logout failed", async () => {
        localStorage.setItem("user", accountData[1]);
        responseQueue.add(REQUEST_KEYS.LOGOUT, 500, {
            message: "Unexpected error when logout",
            code: "error",
        });

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            expect(requestCallTracker.get(REQUEST_KEYS.LOGOUT)).toBe(1);
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
            expect(localStorage.getItem("user")).not.toBe(null);
        });
        await waitFor(() => {
            expect(
                screen.getByText(/Unexpected error when logout/i),
            ).toBeInTheDocument();
        });
    });
});
