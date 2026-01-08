import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../../src/layouts/MainLayout";
import { requestCallTracker, REQUEST_KEYS } from "../helpers/requestHelpers";
import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import { ROUTES } from "../../src/constants";

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path={ROUTES.TEST_MAIN} element={<div>Dashboard</div>} />
            </Route>
            <Route path={ROUTES.LOGIN} element={<div>Login</div>} />
        </Routes>
    );
}

describe("MainLayout", () => {
    it("should logout everything - first-time user", async () => {
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
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN)
            ).toBe(1);
            expect(screen.getByText("Login")).toBeInTheDocument();
            expect(localStorage.getItem("user")).toBe(null);
        });
    });

    it("should logout everything - not first-time user", async () => {
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
});
