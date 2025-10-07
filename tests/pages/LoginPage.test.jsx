import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../../src/pages/LoginPage";

describe("LoginPage", () => {
    it("should render Login page", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        const heading = screen.getByRole("heading");
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent("Login");
    });
});
