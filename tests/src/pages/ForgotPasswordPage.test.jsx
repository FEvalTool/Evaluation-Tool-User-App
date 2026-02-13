import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { vi } from "vitest";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../../mocks/data/account";
import {
    requestCallTracker,
    requestValidationErrorTracker,
    responseQueue,
} from "../../mocks/mockServer";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import {
    goDirectlyToSecurityQuestionsStep,
    goDirectlyToChangePasswordStep,
} from "../../helpers/forgotPasswordFlows";
import { ROUTES } from "../../../src/constants";
import ForgotPasswordPage from "../../../src/pages/ForgotPasswordPage";
import LoginPage from "../../../src/pages/LoginPage";
import MessageWrapper from "../../../src/components/MessageWrapper";

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route
                    path={ROUTES.FORGOT_PASSWORD}
                    element={<ForgotPasswordPage />}
                />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Routes>
        </MessageWrapper>
    );
}

describe("ForgotPasswordPage Step 1 and 2", () => {
    it("should render Forgot Password page correctly", () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const heading = screen.getByRole("heading", {
            name: /forgot password/i,
        });
        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const backToLoginLink = screen.getByRole("link", {
            name: /back to login/i,
        });
        const firstStep = screen.getByText(/enter username/i);
        const secondStep = screen.getByText(/security questions/i);
        const thirdStep = screen.getByText(/change password/i);

        // Assert elements display correctly
        expect(heading).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput).toHaveAttribute("type", "text");
        expect(submitButton).toBeInTheDocument();
        expect(backToLoginLink).toBeInTheDocument();
        expect(backToLoginLink).toHaveAttribute("href", ROUTES.LOGIN);

        // Assert all steps text exists
        expect(firstStep).toBeInTheDocument();
        expect(secondStep).toBeInTheDocument();
        expect(thirdStep).toBeInTheDocument();

        // Assert that only first step is active
        const stepElement = firstStep.closest(".ant-steps-item");
        expect(stepElement).toHaveClass("ant-steps-item-active");
    });

    it("should contain redirect param in login link when redirect param exists", async () => {
        const externalUrl =
            "http://course.eduscrum.local:5174/callback?redirect=/dashboard";

        renderWithProviders(<AppRouter />, {
            route: `${ROUTES.FORGOT_PASSWORD}?redirect=${encodeURIComponent(externalUrl)}`,
        });

        const backToLoginLink = screen.getByRole("link", {
            name: /back to login/i,
        });
        expect(backToLoginLink).toHaveAttribute(
            "href",
            `${ROUTES.LOGIN}?redirect=${encodeURIComponent(externalUrl)}`,
        );
    });

    it("should go back to Login page when press Back To Login link", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const user = userEvent.setup();
        const backToLoginLink = screen.getByRole("link", {
            name: /back to login/i,
        });

        // Suppress stderr: Not implemented: navigation to another Document
        backToLoginLink.addEventListener("click", (e) => e.preventDefault(), {
            once: true,
        });

        await user.click(backToLoginLink);

        await waitFor(() => {
            // Assert that we are now in Login page
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
        });
    });

    it("should display error notification when Forgot Password - step 1 (Enter username) fail", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const firstStep = screen.getByText(/enter username/i);

        const user = userEvent.setup();
        await user.click(usernameInput);
        await user.paste("unknownuser");
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_USER_SECURITY_QA),
            ).toBe(1);

            // Assert error notification show up with correct message
            expect(
                screen.getByText(/user does not exist/i),
            ).toBeInTheDocument();

            // Assert that step does not change when error happened
            const stepElement = firstStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should go to next step (Security Questions) and render correctly when Forgot Password - step 1 (Enter username) success", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const secondStep = screen.getByText(/security questions/i);

        const user = userEvent.setup();
        await user.click(usernameInput);
        await user.paste("testuser");
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_USER_SECURITY_QA),
            ).toBe(1);

            // Assert that username input disappear
            expect(usernameInput).not.toBeInTheDocument();
            const questionInputs = screen.getAllByRole("textbox");
            expect(questionInputs.length).toBe(3);

            // Assert the label contain question
            securityQuestionsResponse.forEach((question) => {
                screen.getByLabelText(question.content);
            });

            // Assert that next step is active happened
            const stepElement = secondStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should display error notification when Forgot Password - step 2 (Security questions) fail", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const secondStep = screen.getByText(/security questions/i);
        const user = userEvent.setup();
        await goDirectlyToSecurityQuestionsStep(user);

        const submitButton = screen.getByRole("button", { name: /submit/i });
        for (const question of securityQuestionsResponse) {
            const questionInput = screen.getByLabelText(question.content);
            await user.click(questionInput);
            await user.paste("error");
        }
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(
                requestCallTracker.get(REQUEST_KEYS.GEN_SECURITY_TOKEN_QA),
            ).toBe(1);

            // Assert error notification displayed with correct message
            expect(
                screen.getByText(/security qa validation failed/i),
            ).toBeInTheDocument();

            // Assert that step does not change when error happened
            const stepElement = secondStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });
});

describe("ForgotPasswordPage Step 3 - Set password", () => {
    // Following this to use useFakeTimers
    // https://github.com/testing-library/user-event/issues/1115#issuecomment-1565730917
    beforeEach(() => {
        vi.useFakeTimers({});
        globalThis.jest = {
            advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
        };
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const getUserEventInstance = () =>
        // Wrap act around advanceTimers and everything related to useFakeTimer to avoid warnings
        // Reference: https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
        userEvent.setup({
            advanceTimers: async (ms) => {
                await act(async () => {
                    await vi.advanceTimersByTimeAsync(ms);
                });
            },
        });

    it("should go to next step (Change password) and render correctly when Forgot Password - step 2 (Security questions) success", async () => {
        renderWithProviders(<AppRouter />, {
            route: ROUTES.FORGOT_PASSWORD,
        });

        const thirdStep = screen.getByText(/change password/i);
        const user = getUserEventInstance();
        await goDirectlyToSecurityQuestionsStep(user);

        const submitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        for (const index of securityQuestionsResponse.keys()) {
            const questionInput = screen.getByLabelText(
                securityQuestionsResponse[index].content,
            );
            await user.click(questionInput);
            await user.paste(securityAnswers[index]);
        }
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(
                requestCallTracker.get(REQUEST_KEYS.GEN_SECURITY_TOKEN_QA),
            ).toBe(1);

            // Assert that time countdown element show up with correct initial time
            const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
            expect(timeElement.textContent).toMatch(/10:00/);

            // Assert that password and confirm password inputs show up
            const passwordInput = screen.getByLabelText(/new password/i);
            const confirmPasswordInput =
                screen.getByLabelText(/confirm password/i);
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute("type", "password");
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toHaveAttribute("type", "password");

            // Assert that next step is active happened
            const stepElement = thirdStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should display error notification when Forgot Password - step 3 (Change password) fail", async () => {
        // Override handler to simulate API failure
        // (we will test the case when user update new password
        // after 10-minute security session pass)
        responseQueue.add(REQUEST_KEYS.SET_PASSWORD, 401, {
            message: "Token 'scope' not found",
        });

        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const thirdStep = screen.getByText(/change password/i);
        const user = getUserEventInstance();
        await goDirectlyToChangePasswordStep(user);

        const passwordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await user.click(passwordInput);
        await user.paste("newPASSWORD123@");
        await user.click(confirmPasswordInput);
        await user.paste("newPASSWORD123@");
        // 10-minute security session passes
        act(() => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.SET_PASSWORD)).toBe(1);

            // Assert time countdown element show up with 00:00
            const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
            expect(timeElement.textContent).toMatch(/00:00/);

            // Assert error notification displayed with correct message
            expect(
                screen.getByText(/Token 'scope' not found/i),
            ).toBeInTheDocument();

            // Assert that step does not change when error happened
            const stepElement = thirdStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should go back to Login page when complete update password", async () => {
        renderWithProviders(<AppRouter />, { route: ROUTES.FORGOT_PASSWORD });

        const user = getUserEventInstance();
        await goDirectlyToChangePasswordStep(user);

        const passwordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await user.click(passwordInput);
        await user.paste("newPASSWORD123@");
        await user.click(confirmPasswordInput);
        await user.paste("newPASSWORD123@");
        await user.click(submitButton);

        await waitFor(() => {
            // Assert API call and no validation error happened
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.SET_PASSWORD)).toBe(1);
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN),
            ).toBe(1);

            // Assert that we are now in Login page
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
        });
    });
});
