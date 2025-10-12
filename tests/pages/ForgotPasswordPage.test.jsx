import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import ForgotPasswordPage from "../../src/pages/ForgotPasswordPage";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../mocks/data/account";

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
            const submitButton = screen.getByRole("button", {
                name: /submit/i,
            });
            const questionInputs = screen.getAllByRole("textbox");
            expect(submitButton).toBeInTheDocument();
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

        const usernameInput = screen.getByLabelText(/username/i);
        const usernameSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        const secondStep = screen.getByText(/security questions/i);

        const user = userEvent.setup();
        await user.type(usernameInput, "testuser");
        await user.click(usernameSubmitButton);

        // Wait for step 1 to complete
        await waitFor(() => {});

        const securityQuestionSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        for (const question of securityQuestionsResponse) {
            const questionInput = screen.getByLabelText(question.content);
            await user.type(questionInput, "error");
        }
        await user.click(securityQuestionSubmitButton);

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

        const usernameInput = screen.getByLabelText(/username/i);
        const usernameSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        const thirdStep = screen.getByText(/change password/i);

        const user = userEvent.setup();
        await user.type(usernameInput, "testuser");
        await user.click(usernameSubmitButton);

        // Wait for step 1 to complete
        await waitFor(() => {});

        const securityQuestionSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        for (const index of securityQuestionsResponse.keys()) {
            const questionInput = screen.getByLabelText(
                securityQuestionsResponse[index].content
            );
            await user.type(questionInput, securityAnswers[index]);
        }
        await user.click(securityQuestionSubmitButton);

        await waitFor(() => {
            const submitButton = screen.getByRole("button", {
                name: /submit/i,
            });
            const passwordInput = screen.getByLabelText(/new password/i);
            const confirmPasswordInput =
                screen.getByLabelText(/confirm password/i);
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute("type", "password");
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toHaveAttribute("type", "password");
            expect(submitButton).toBeInTheDocument();
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

        const usernameInput = screen.getByLabelText(/username/i);
        const usernameSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });

        const user = userEvent.setup();
        await user.type(usernameInput, "testuser");
        await user.click(usernameSubmitButton);

        // Wait for step 1 to complete
        await waitFor(() => {});

        const securityQuestionSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        for (const index of securityQuestionsResponse.keys()) {
            const questionInput = screen.getByLabelText(
                securityQuestionsResponse[index].content
            );
            await user.type(questionInput, securityAnswers[index]);
        }
        await user.click(securityQuestionSubmitButton);

        // Wait for step 2 to complete
        await waitFor(() => {});

        const passwordInput = screen.getByLabelText(/new password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const updatePasswordSubmitButton = screen.getByRole("button", {
            name: /submit/i,
        });
        await user.type(passwordInput, "newPASSWORD123@");
        await user.type(confirmPasswordInput, "newPASSWORD123@");
        await user.click(updatePasswordSubmitButton);

        await waitFor(() => {
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
        });
    });
});
