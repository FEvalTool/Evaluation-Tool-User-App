import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../../src/layouts/MainLayout";
import authService from "../../src//services/authService";
import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import { ROUTES } from "../../src/constants";

vi.mock("../../src/services/authService");

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

describe("GuestRoute", () => {
    test("should logout everything", async () => {
        localStorage.setItem("user", accountData[0]);
        authService.verifyToken.mockResolvedValueOnce({});

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            expect(screen.getByText("Login")).toBeInTheDocument();
            expect(localStorage.getItem("user")).toBe(null);
        });
    });
});
