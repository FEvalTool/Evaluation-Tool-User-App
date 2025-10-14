import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";

import ForgotPasswordPage from "../../src/pages/ForgotPasswordPage";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../mocks/data/account";
import { server } from "../mocks/server";
import {
    goDirectlyToSecurityQuestionsStep,
    goDirectlyToChangePasswordStep,
} from "../helpers/forgotPasswordFlows";
import ROUTES from "../../src/constants/routes";

describe("ForgotPasswordPage", () => {
    it("should render Forgot Password page correctly", () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

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

        expect(heading).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput).toHaveAttribute("type", "text");
        expect(submitButton).toBeInTheDocument();
        expect(backToLoginLink).toBeInTheDocument();
        expect(backToLoginLink).toHaveAttribute("href", ROUTES.LOGIN);
        // Verify all steps text exists
        expect(firstStep).toBeInTheDocument();
        expect(secondStep).toBeInTheDocument();
        expect(thirdStep).toBeInTheDocument();
        // Verify that only first step is active
        const stepElement = firstStep.closest(".ant-steps-item");
        expect(stepElement).toHaveClass("ant-steps-item-active");
    });

    it("should go back to Login page when press Back To Login link", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const backToLoginLink = screen.getByRole("link", {
            name: /back to login/i,
        });
        const user = userEvent.setup();
        await user.click(backToLoginLink);

        await waitFor(() => {
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
        });
    });

    it("should display error notification when Forgot Password - step 1 (Enter username) fail", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const firstStep = screen.getByText(/enter username/i);

        const user = userEvent.setup();
        await user.type(usernameInput, "testuser1");
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/user does not exist/i)
            ).toBeInTheDocument();
            // Verify that step does not change when error happened
            const stepElement = firstStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should go to next step (Security Questions) and render correctly when Forgot Password - step 1 (Enter username) success", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        const secondStep = screen.getByText(/security questions/i);

        const user = userEvent.setup();
        await user.type(usernameInput, "testuser");
        await user.click(submitButton);

        await waitFor(() => {
            // Verify that username input disappear
            expect(usernameInput).not.toBeInTheDocument();
            const questionInputs = screen.getAllByRole("textbox");
            expect(questionInputs.length).toBe(3);
            // Verify the label contain question
            securityQuestionsResponse.forEach((question) => {
                screen.getByLabelText(question.content);
            });
            // Verify that next step is active happened
            const stepElement = secondStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should display error notification when Forgot Password - step 2 (Security questions) fail", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const secondStep = screen.getByText(/security questions/i);
        const user = userEvent.setup();
        await goDirectlyToSecurityQuestionsStep(user);

        const submitButton = screen.getByRole("button", { name: /submit/i });
        for (const question of securityQuestionsResponse) {
            const questionInput = screen.getByLabelText(question.content);
            await user.type(questionInput, "error");
        }
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/security qa validation failed/i)
            ).toBeInTheDocument();
            const stepElement = secondStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should go to next step (Change password) and render correctly when Forgot Password - step 2 (Security questions) success", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const thirdStep = screen.getByText(/change password/i);
        const user = userEvent.setup();
        await goDirectlyToSecurityQuestionsStep(user);

        const submitButton = screen.getByRole("button", { name: /submit/i });
        for (const index of securityQuestionsResponse.keys()) {
            const questionInput = screen.getByLabelText(
                securityQuestionsResponse[index].content
            );
            await user.type(questionInput, securityAnswers[index]);
        }
        await user.click(submitButton);

        await waitFor(() => {
            const passwordInput = screen.getByLabelText(/new password/i);
            const confirmPasswordInput =
                screen.getByLabelText(/confirm password/i);
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute("type", "password");
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toHaveAttribute("type", "password");
            const stepElement = thirdStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should display error notification when Forgot Password - step 3 (Change password) fail", async () => {
        // Override handler to simulate API failure
        server.use(
            http.post("account/password", ({ request }) => {
                return HttpResponse.json(
                    {
                        message: "Internal server error",
                    },
                    { status: 500 }
                );
            })
        );

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const thirdStep = screen.getByText(/change password/i);
        const user = userEvent.setup();
        await goDirectlyToChangePasswordStep(user);

        const passwordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await user.type(passwordInput, "newPASSWORD123@");
        await user.type(confirmPasswordInput, "newPASSWORD123@");
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/internal server error/i)
            ).toBeInTheDocument();
            const stepElement = thirdStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should display confirm password error when user input confirm password different from new password", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const thirdStep = screen.getByText(/change password/i);
        const user = userEvent.setup();
        await goDirectlyToChangePasswordStep(user);

        const passwordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await user.type(passwordInput, "newPASSWORD123@");
        await user.type(confirmPasswordInput, "newPASSWORD123@1");
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /the new password that you entered do not match/i
                )
            ).toBeInTheDocument();
            const stepElement = thirdStep.closest(".ant-steps-item");
            expect(stepElement).toHaveClass("ant-steps-item-active");
        });
    });

    it("should go back to Login page when complete update password", async () => {
        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const user = userEvent.setup();
        await goDirectlyToChangePasswordStep(user);

        const passwordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await user.type(passwordInput, "newPASSWORD123@");
        await user.type(confirmPasswordInput, "newPASSWORD123@");
        await user.click(submitButton);

        await waitFor(() => {
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
        });
    });
});
