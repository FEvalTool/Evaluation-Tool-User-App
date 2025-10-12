import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";

import { server } from "../mocks/server";
import TestPage from "../../src/pages/TestPage";

describe("TestPage", () => {
    it("should render Test page correctly when health check API run ok", async () => {
        server.use(
            http.get("/health/check", ({ request }) => {
                return HttpResponse.json(
                    {
                        message: "Hello world",
                    },
                    { status: 200 }
                );
            })
        );
        render(
            <MemoryRouter>
                <TestPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const heading = screen.getByRole("heading", {
                name: /testing page/i,
            });
            const paragraph = screen.getByText(/hello world/i);
            expect(heading).toBeInTheDocument();
            expect(paragraph).toBeInTheDocument();
        });
    });

    it("should render Test page correctly when health check API run failed", async () => {
        server.use(
            http.get("/health/check", ({ request }) => {
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
                <TestPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const paragraph = screen.getByText(/something went wrong/i);
            expect(paragraph).toBeInTheDocument();
        });
    });
});
