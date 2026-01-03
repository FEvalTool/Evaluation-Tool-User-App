import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import { server } from "../mocks/server";
import { setupSecurityQA } from "../helpers/setupAccountFlows";
import { ROUTES } from "../../src/constants";
import MessageWrapper from "../../src/components/MessageWrapper";
import LoginPage from "../../src/pages/LoginPage";
import SetupAccountPage from "../../src/pages/SetupAccountPage";

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route
                    path={ROUTES.SETUP_ACCOUNT}
                    element={<SetupAccountPage />}
                />
            </Routes>
        </MessageWrapper>
    );
}

// Setup fake time
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
    userEvent.setup({
        advanceTimers: vi.advanceTimersByTime.bind(vi),
    });

// Mock get user setup api function
const mockSetupStatus = (data) => {
    server.use(
        http.get("account/setup_status", () => {
            return HttpResponse.json({ user: data });
        })
    );
};

describe("SetupAccountPage - integration test flow", () => {
    it("should render Setup Account Page correctly", async () => {
        let currentTime = Date.now() + 10 * 60 * 1000;
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[0], scopeExp: currentTime },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });

        // Welcome page check
        expect(
            screen.getByText(/Welcome to setup account page/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/To get started, choose a setup option/i)
        ).toBeInTheDocument();

        // Status section check
        const progressText = screen.getByText(/0%/);
        expect(progressText).toBeInTheDocument();
        const completeButton = screen.getByRole("button", {
            name: /complete setup/i,
        });
        expect(completeButton).toBeInTheDocument();
        expect(completeButton).toBeDisabled();

        // Menu items check
        const passwordMenu = screen.getByText(/Setup Password/i);
        const securityQuestionsMenu = screen.getByText(
            /Setup Security Questions/i
        );
        expect(passwordMenu).toBeInTheDocument();
        expect(securityQuestionsMenu).toBeInTheDocument();

        // All menu items not selected check
        const passwordMenuItem = passwordMenu.closest(".ant-menu-item");
        const securityMenuItem =
            securityQuestionsMenu.closest(".ant-menu-item");
        expect(passwordMenuItem).not.toHaveClass("ant-menu-item-selected");
        expect(securityMenuItem).not.toHaveClass("ant-menu-item-selected");

        // Menu items status check
        const passwordBadgeDot =
            passwordMenuItem.querySelector(".ant-badge-dot");
        const securityBadgeDot =
            securityMenuItem.querySelector(".ant-badge-dot");
        expect(passwordBadgeDot).toBeInTheDocument();
        expect(securityBadgeDot).toBeInTheDocument();
        expect(passwordBadgeDot).toHaveClass("ant-badge-status-error");
        expect(securityBadgeDot).toHaveClass("ant-badge-status-error");

        // Warning alert check
        const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
        expect(timeElement.textContent).toMatch(/10:00/);
    });
});

describe("SetupAccountPage - Password setup flow", () => {
    it("should render Setup password form correctly", async () => {
        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        const passwordMenuItem = screen
            .getByText(/Setup Password/i)
            .closest(".ant-menu-item");
        await user.click(passwordMenuItem);

        await waitFor(() => {
            const passwordInput = screen.getByLabelText(/new password/i);
            const confirmPasswordInput =
                screen.getByLabelText(/confirm password/i);
            const submitButton = screen.getByRole("button", {
                name: /submit/i,
            });
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute("type", "password");
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toHaveAttribute("type", "password");
            expect(submitButton).toBeInTheDocument();
        });
    });
});

describe("SetupAccountPage - Security Question Answer setup flow", () => {
    it("should render Setup security question answer form correctly", async () => {
        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        const securityMenuItem = screen
            .getByText(/Setup Security Questions/i)
            .closest(".ant-menu-item");
        await user.click(securityMenuItem);

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Question ${i}`)).toBeInTheDocument();
                expect(screen.getByText(`Answer ${i}`)).toBeInTheDocument();
            }

            const answerInputs = screen.getAllByRole("textbox");
            expect(answerInputs).toHaveLength(3);

            const placeholders = screen.getAllByText("Select a question");
            expect(placeholders).toHaveLength(3);

            const submitButton = screen.getByRole("button", {
                name: /submit/i,
            });
            expect(submitButton).toBeInTheDocument();
        });
    });

    it("should render success result when submit success", async () => {
        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Mock user status API response after submit
        mockSetupStatus({
            first_time_setup: true,
            is_password_setup: false,
            is_security_qa_setup: true,
        });

        const securityMenuItem = screen
            .getByText(/Setup Security Questions/i)
            .closest(".ant-menu-item");
        await user.click(securityMenuItem);

        // Setup security qa
        await setupSecurityQA(user);
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/Complete Setup Security Question/i)
            ).toBeInTheDocument();
            // Status check
            const securityBadgeDot =
                securityMenuItem.querySelector(".ant-badge-dot");
            expect(securityBadgeDot).toHaveClass("ant-badge-status-success");
            const progressText = screen.getByText(/50%/);
            expect(progressText).toBeInTheDocument();
        });
    });

    it("should render error notification when submit failed", async () => {
        let currentTime = Date.now() + 10 * 60 * 1000;
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[0], scopeExp: currentTime },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Mock set security questions API failed
        // (we will test the case when user update
        // after 10-minute security session pass)
        server.use(
            http.post("account/security_questions", ({ request }) => {
                return HttpResponse.json(
                    {
                        message: "Token 'scope' not found",
                    },
                    { status: 400 }
                );
            })
        );

        const securityMenuItem = screen
            .getByText(/Setup Security Questions/i)
            .closest(".ant-menu-item");
        await user.click(securityMenuItem);

        // Setup security qa
        await setupSecurityQA(user);
        // 10-minute security session passes
        vi.advanceTimersByTime(10 * 60 * 1000);
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
            expect(timeElement.textContent).toMatch(/00:00/);
            expect(
                screen.getByText(/Token 'scope' not found/i)
            ).toBeInTheDocument();
            // Status check
            const securityBadgeDot =
                securityMenuItem.querySelector(".ant-badge-dot");
            expect(securityBadgeDot).toHaveClass("ant-badge-status-error");
            const progressText = screen.getByText(/0%/);
            expect(progressText).toBeInTheDocument();
        });
    });
});
