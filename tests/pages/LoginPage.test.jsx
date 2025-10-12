import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import LoginPage from "../../src/pages/LoginPage";

describe("LoginPage", () => {
    it("should render Login page correctly", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

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
        expect(forgotLink).toHaveAttribute("href", "/forgot-password");
    });

    it("should route to main page when Login successful", async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(usernameInput, "testuser");
        await user.type(passwordInput, "testpassword");
        await user.click(submitButton);

        await waitFor(() => {
            const homeHeading = screen.getByRole(
                "heading",
                "This is a message from Backend (for development purposes)"
            );
            expect(homeHeading).toBeInTheDocument();
        });
    });

    it("should display error notification when Login fail", async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const user = userEvent.setup();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(usernameInput, "testuser");
        await user.type(passwordInput, "testpassword1");
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/invalid username or password/i)
            ).toBeInTheDocument();
        });
    });

    it("should route to forgot password page when click forgot password link", async () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

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
