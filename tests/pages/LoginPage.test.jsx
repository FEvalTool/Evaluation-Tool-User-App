import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";

import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import { ROUTES } from "../../src/constants";
import LoginPage from "../../src/pages/LoginPage";
import SetupAccountPage from "../../src/pages/SetupAccountPage";
import TestPage from "../../src/pages/TestPage";
import MainLayout from "../../src/layouts/MainLayout";
import MessageWrapper from "../../src/components/MessageWrapper";

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route element={<MainLayout />}>
                    <Route path={ROUTES.TEST_MAIN} element={<TestPage />} />
                    <Route
                        path={ROUTES.SETUP_ACCOUNT}
                        element={<SetupAccountPage />}
                    />
                </Route>
            </Routes>
        </MessageWrapper>
    );
}

describe("LoginPage navigation flow", () => {
    it("should render Login page correctly", () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const heading = screen.getByRole("heading", { name: /login/i });
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const forgotLink = screen.getByRole("link", {
            name: /username \/ password/i,
        });

        expect(heading).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput).toHaveAttribute("type", "text");
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(submitButton).toBeInTheDocument();
        expect(forgotLink).toBeInTheDocument();
        expect(forgotLink).toHaveAttribute("href", ROUTES.FORGOT_PASSWORD);
    });

    it("should display error notification when Login fail", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(usernameInput, "testUser");
        await user.type(passwordInput, "wrongPassword");
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/invalid username or password/i)
            ).toBeInTheDocument();
        });
    });

    it("should redirect to dashboard page if not first-time user", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(usernameInput, "testUser");
        await user.type(passwordInput, "testPassword123@");
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Testing page/i)).toBeInTheDocument();
            expect(screen.getByText(/testUser/i)).toBeInTheDocument();
            expect(JSON.parse(localStorage.getItem("user"))).toEqual(
                accountData[1]
            );
        });
    });

    it("should redirect to setup account page if first-time user", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(usernameInput, "newTestUser");
        await user.type(passwordInput, "testPassword");
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Welcome to setup account page/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/newTestUser/i)).toBeInTheDocument();
            expect(JSON.parse(localStorage.getItem("user"))).toEqual(
                accountData[0]
            );
        });
    });

    it("should redirect to forgot password page when click forgot password link", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const forgotLink = screen.getByRole("link", {
            name: /username \/ password/i,
        });

        await user.click(forgotLink);

        await waitFor(() => {
            const heading = screen.getByRole("heading", /forgot password/i);
            expect(heading).toBeInTheDocument();
        });
    });
});
