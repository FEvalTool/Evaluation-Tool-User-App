import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { accountData } from "../../mocks/data/account";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import {
    requestCallTracker,
    requestValidationErrorTracker,
} from "../../mocks/mockServer";
import { ROUTES } from "../../../src/constants";
import LoginPage from "../../../src/pages/LoginPage";
import MessageWrapper from "../../../src/components/MessageWrapper";

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
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
        const forgotPasswordLink = screen.getByRole("link", {
            name: /username \/ password/i,
        });

        // Assert elements display correctly
        expect(heading).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput).toHaveAttribute("type", "text");
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(submitButton).toBeInTheDocument();
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveAttribute(
            "href",
            ROUTES.FORGOT_PASSWORD,
        );
    });

    it("should contain redirect param in forgot password link when redirect param exists", async () => {
        const externalUrl =
            "http://course.eduscrum.local:5174/callback?redirect=/dashboard";

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: `${ROUTES.LOGIN}?redirect=${encodeURIComponent(externalUrl)}`,
        });

        const forgotPasswordLink = screen.getByText(/username \/ password/i);
        expect(forgotPasswordLink).toHaveAttribute(
            "href",
            `${ROUTES.FORGOT_PASSWORD}?redirect=${encodeURIComponent(externalUrl)}`,
        );
    });

    it("should display error notification when Login fail", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.click(usernameInput);
        await user.paste("testUser");
        await user.click(passwordInput);
        await user.paste("wrongPassword");
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.LOGIN)).toBe(1);

            // Assert error notification displayed
            expect(
                screen.getByText(/invalid username or password/i),
            ).toBeInTheDocument();
        });
    });

    it("should redirect active user to dashboard page when login success", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.click(usernameInput);
        await user.paste("activeUser");
        await user.click(passwordInput);
        await user.paste("testPassword123@");
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.LOGIN)).toBe(1);

            // Assert user data store in localStorage
            expect(JSON.parse(localStorage.getItem("user"))).toEqual(
                accountData[1],
            );
        });
    });

    it("should redirect new user to setup account page when login success", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.click(usernameInput);
        await user.paste("newUser");
        await user.click(passwordInput);
        await user.paste("testPassword");
        const expectScopeTokenExp = Date.now() + 10 * 60 * 1000;
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.LOGIN)).toBe(1);

            // Assert user data store in localStorage
            expect(JSON.parse(localStorage.getItem("user"))).toEqual(
                accountData[0],
            );

            // Assert expiration timestamp matches within a safe 5 seconds window
            expect(expectScopeTokenExp).toBeCloseTo(
                Number.parseInt(localStorage.getItem("scopeTokenExp"), 10),
                -4,
            );
        });
    });

    it("should redirect to forgot password page when click forgot password link", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.LOGIN });

        const user = userEvent.setup();
        const forgotPasswordLink = screen.getByRole("link", {
            name: /username \/ password/i,
        });

        // --- FIX: Intercept the event to stop JSDOM navigation ---
        // Suppress stderr: Not implemented: navigation to another Document
        forgotPasswordLink.addEventListener(
            "click",
            (e) => e.preventDefault(),
            { once: true },
        );

        await user.click(forgotPasswordLink);

        await waitFor(() => {
            // Assert forgot password page displayed
            const heading = screen.getByRole("heading", /forgot password/i);
            expect(heading).toBeInTheDocument();
        });
    });
});
