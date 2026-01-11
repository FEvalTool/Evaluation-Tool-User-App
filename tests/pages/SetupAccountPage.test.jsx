import { screen, waitFor, act } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../mocks/mockStoreWrapper";
import { accountData } from "../mocks/data/account";
import {
    requestCallTracker,
    requestValidationErrorTracker,
    responseQueue,
} from "../mocks/mockServer";
import { setupPassword, setupSecurityQA } from "../helpers/setupAccountFlows";
import { REQUEST_KEYS } from "../helpers/requestHelpers";
import { ROUTES } from "../../src/constants";
import MessageWrapper from "../../src/components/MessageWrapper";
import LoginPage from "../../src/pages/LoginPage";
import SetupAccountPage from "../../src/pages/SetupAccountPage";
import { expect } from "vitest";

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
        advanceTimers: async (ms) => {
            await act(async () => {
                await vi.advanceTimersByTimeAsync(ms);
            });
        },
    });

describe("SetupAccountPage - integration test flow", () => {
    it("should render Setup Account Page correctly", async () => {
        let currentTime = Date.now() + 10 * 60 * 1000;
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[0], scopeExp: currentTime },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });

        await waitFor(() => {
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
            const securityQAMenu = screen.getByText(
                /Setup Security Questions/i
            );
            expect(passwordMenu).toBeInTheDocument();
            expect(securityQAMenu).toBeInTheDocument();

            // All menu items not selected check
            const passwordMenuItem = passwordMenu.closest(".ant-menu-item");
            const securityQAMenuItem = securityQAMenu.closest(".ant-menu-item");
            expect(passwordMenuItem).not.toHaveClass("ant-menu-item-selected");
            expect(securityQAMenuItem).not.toHaveClass(
                "ant-menu-item-selected"
            );

            // Menu items status check
            const passwordBadgeDot =
                passwordMenuItem.querySelector(".ant-badge-dot");
            const securityQABadgeDot =
                securityQAMenuItem.querySelector(".ant-badge-dot");
            expect(passwordBadgeDot).toBeInTheDocument();
            expect(securityQABadgeDot).toBeInTheDocument();
            expect(passwordBadgeDot).toHaveClass("ant-badge-status-error");
            expect(securityQABadgeDot).toHaveClass("ant-badge-status-error");

            // Warning alert check
            const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
            expect(timeElement.textContent).toMatch(/10:00/);
        });
    });

    it("should render Setup Account Page correctly after complete setup account", async () => {
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[0] },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Mock user status API response after submit setup password form
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS, 200, {
            user: {
                first_time_setup: true,
                is_password_setup: true,
                is_security_qa_setup: false,
            },
        });

        // Setup password
        await user.click(
            screen.getByText(/Setup Password/i).closest(".ant-menu-item")
        );
        await setupPassword(user);
        await user.click(screen.getByRole("button", { name: /submit/i }));
        // Make sure password setup complete
        await waitFor(() => {
            expect(
                screen.getByText(/Complete Setup Password/i)
            ).toBeInTheDocument();
        });

        // Mock user status API response after submit setup security qa form
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS, 200, {
            user: {},
        });

        // Setup security qa
        await user.click(
            screen
                .getByText(/Setup Security Questions/i)
                .closest(".ant-menu-item")
        );
        await setupSecurityQA(user);
        await user.click(screen.getByRole("button", { name: /submit/i }));
        // Make sure security questions setup complete
        await waitFor(() => {
            expect(
                screen.getByText(/Complete Setup Security Question/i)
            ).toBeInTheDocument();
        });

        await waitFor(() => {
            // Status section check
            const progress = document.querySelector(".ant-progress");
            expect(progress).toHaveClass("ant-progress-status-success");

            const completeButton = screen.getByRole("button", {
                name: /complete setup/i,
            });
            expect(completeButton).not.toBeDisabled();

            // Status menu item check
            const passwordMenuItem = screen
                .getByText(/Setup Password/i)
                .closest(".ant-menu-item");
            const securityQAMenuItem = screen
                .getByText(/Setup Security Questions/i)
                .closest(".ant-menu-item");
            const passwordBadgeDot =
                passwordMenuItem.querySelector(".ant-badge-dot");
            expect(passwordBadgeDot).toHaveClass("ant-badge-status-success");
            const securityQABadgeDot =
                securityQAMenuItem.querySelector(".ant-badge-dot");
            expect(securityQABadgeDot).toHaveClass("ant-badge-status-success");
            // Local storage check
            const userData = localStorage.getItem("user");
            expect(userData).not.toBeNull();
            const userDataObj = JSON.parse(userData);
            expect(userDataObj["first_time_setup"]).toBe(true);
            expect(userDataObj["is_password_setup"]).toBe(true);
            expect(userDataObj["is_security_qa_setup"]).toBe(true);
        });
    });

    it("should display 'complete notification' correctly when click 'Complete setup' button", async () => {
        // Pre-set user state as completed both setup password and security questions
        // to enable Complete setup button
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: {
                    user: {
                        ...accountData[0],
                        first_time_setup: true,
                        is_password_setup: true,
                        is_security_qa_setup: true,
                    },
                },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Press Complete setup button
        await user.click(
            screen.getByRole("button", {
                name: /complete setup/i,
            })
        );

        await waitFor(() => {
            // Complete notification check
            const notificationTitle = screen.getByText(
                /Setup Account Complete!/i
            );
            const notificationLoginButton = screen.getByRole("button", {
                name: /Login now/i,
            });
            const notificationCancelButton = screen.getByRole("button", {
                name: /Stay on page/i,
            });
            expect(notificationTitle).toBeInTheDocument();
            expect(notificationLoginButton).toBeInTheDocument();
            expect(notificationCancelButton).toBeInTheDocument();

            // Menu disabled check
            const completeButton = screen.getByRole("button", {
                name: /complete setup/i,
            });
            const passwordMenuItem = screen
                .getByText(/Setup Password/i)
                .closest(".ant-menu-item");
            const securityQAMenuItem = screen
                .getByText(/Setup Security Questions/i)
                .closest(".ant-menu-item");
            expect(completeButton).toBeDisabled();
            expect(passwordMenuItem).toHaveAttribute("aria-disabled", "true");
            expect(securityQAMenuItem).toHaveAttribute("aria-disabled", "true");
        });
    });

    it("should close 'complete notification' when click 'Stay on page' button", async () => {
        // Pre-set user state as completed both setup password and security questions
        // to enable Complete setup button
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: {
                    user: {
                        ...accountData[0],
                        first_time_setup: true,
                        is_password_setup: true,
                        is_security_qa_setup: true,
                    },
                },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Press Complete setup button
        await user.click(
            screen.getByRole("button", {
                name: /complete setup/i,
            })
        );

        // Press Stay on page Button
        await user.click(
            screen.getByRole("button", {
                name: /Stay on page/i,
            })
        );

        await waitFor(() => {
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN)
            ).toBe(0);
            // Menu disabled check
            const completeButton = screen.getByRole("button", {
                name: /complete setup/i,
            });
            const passwordMenuItem = screen
                .getByText(/Setup Password/i)
                .closest(".ant-menu-item");
            const securityQAMenuItem = screen
                .getByText(/Setup Security Questions/i)
                .closest(".ant-menu-item");
            expect(completeButton).not.toBeDisabled();
            expect(passwordMenuItem).not.toHaveAttribute(
                "aria-disabled",
                "true"
            );
            expect(securityQAMenuItem).not.toHaveAttribute(
                "aria-disabled",
                "true"
            );
        });
    });

    it("should go back to Login page when click 'Login now' button", async () => {
        // Pre-set user state as completed both setup password and security questions
        // to enable Complete setup button
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: {
                    user: {
                        ...accountData[0],
                        first_time_setup: true,
                        is_password_setup: true,
                        is_security_qa_setup: true,
                    },
                },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Press Complete setup button
        await user.click(
            screen.getByRole("button", {
                name: /complete setup/i,
            })
        );

        // Press Login now Button
        await user.click(
            screen.getByRole("button", {
                name: /Login now/i,
            })
        );

        await waitFor(() => {
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN)
            ).toBe(1);
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
            // Check if user data is remove in local storage
            expect(localStorage.getItem("user")).toBe(null);
            expect(localStorage.getItem("scopeExp")).toBe(null);
        });
    });

    it("should go back to Login page when user not do anything in 5 second", async () => {
        // Pre-set user state as completed both setup password and security questions
        // to enable Complete setup button
        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: {
                    user: {
                        ...accountData[0],
                        first_time_setup: true,
                        is_password_setup: true,
                        is_security_qa_setup: true,
                    },
                },
            },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Press Complete setup button
        await user.click(
            screen.getByRole("button", {
                name: /complete setup/i,
            })
        );

        // User not do anything in 5 seconds
        act(() => {
            vi.advanceTimersByTime(5 * 1000);
        });

        await waitFor(() => {
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN)
            ).toBe(1);
            const heading = screen.getByRole("heading", /login/i);
            expect(heading).toBeInTheDocument();
            // Check if user data is remove in local storage
            expect(localStorage.getItem("user")).toBe(null);
            expect(localStorage.getItem("scopeExp")).toBe(null);
        });
    });
});

describe("SetupAccountPage - Password setup flow", () => {
    it("should render Setup password form correctly", async () => {
        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        await user.click(
            screen.getByText(/Setup Password/i).closest(".ant-menu-item")
        );

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

    it("should render success result when submit success", async () => {
        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.SETUP_ACCOUNT,
        });
        const user = getUserEventInstance();

        // Mock user status API response after submit
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS, 200, {
            user: {
                first_time_setup: true,
                is_password_setup: true,
                is_security_qa_setup: false,
            },
        });

        const passwordMenuItem = screen
            .getByText(/Setup Password/i)
            .closest(".ant-menu-item");
        await user.click(passwordMenuItem);

        await setupPassword(user);
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.SET_PASSWORD)).toBe(1);
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS)
            ).toBe(1);
            expect(
                screen.getByText(/Complete Setup Password/i)
            ).toBeInTheDocument();
            // Status check
            const passwordBadgeDot =
                passwordMenuItem.querySelector(".ant-badge-dot");
            expect(passwordBadgeDot).toHaveClass("ant-badge-status-success");
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
        responseQueue.add(REQUEST_KEYS.SET_PASSWORD, 401, {
            message: "Token 'scope' not found",
        });

        const passwordMenuItem = screen
            .getByText(/Setup Password/i)
            .closest(".ant-menu-item");
        await user.click(passwordMenuItem);

        await setupPassword(user);
        // 10-minute security session passes
        act(() => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.SET_PASSWORD)).toBe(1);
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS)
            ).toBe(0);
            const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
            expect(timeElement.textContent).toMatch(/00:00/);
            expect(
                screen.getByText(/Token 'scope' not found/i)
            ).toBeInTheDocument();
            // Status check
            const passwordBadgeDot =
                passwordMenuItem.querySelector(".ant-badge-dot");
            expect(passwordBadgeDot).toHaveClass("ant-badge-status-error");
            const progressText = screen.getByText(/0%/);
            expect(progressText).toBeInTheDocument();
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

        await user.click(
            screen
                .getByText(/Setup Security Questions/i)
                .closest(".ant-menu-item")
        );

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
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS, 200, {
            user: {
                first_time_setup: true,
                is_password_setup: false,
                is_security_qa_setup: true,
            },
        });

        const securityQAMenuItem = screen
            .getByText(/Setup Security Questions/i)
            .closest(".ant-menu-item");
        await user.click(securityQAMenuItem);

        // Setup security qa
        await setupSecurityQA(user);
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.SET_SECURITY_QA)).toBe(
                1
            );
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS)
            ).toBe(1);
            expect(
                screen.getByText(/Complete Setup Security Question/i)
            ).toBeInTheDocument();
            // Status check
            const securityQABadgeDot =
                securityQAMenuItem.querySelector(".ant-badge-dot");
            expect(securityQABadgeDot).toHaveClass("ant-badge-status-success");
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
        responseQueue.add(REQUEST_KEYS.SET_SECURITY_QA, 401, {
            message: "Token 'scope' not found",
        });

        const securityQAMenuItem = screen
            .getByText(/Setup Security Questions/i)
            .closest(".ant-menu-item");
        await user.click(securityQAMenuItem);

        // Setup security qa
        await setupSecurityQA(user);
        // 10-minute security session passes
        act(() => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(requestValidationErrorTracker.getAll()).toEqual([]);
            expect(requestCallTracker.get(REQUEST_KEYS.SET_SECURITY_QA)).toBe(
                1
            );
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS)
            ).toBe(0);
            const timeElement = screen.getByText(/(\d{2}):(\d{2})/);
            expect(timeElement.textContent).toMatch(/00:00/);
            expect(
                screen.getByText(/Token 'scope' not found/i)
            ).toBeInTheDocument();
            // Status check
            const securityQABadgeDot =
                securityQAMenuItem.querySelector(".ant-badge-dot");
            expect(securityQABadgeDot).toHaveClass("ant-badge-status-error");
            const progressText = screen.getByText(/0%/);
            expect(progressText).toBeInTheDocument();
        });
    });
});
