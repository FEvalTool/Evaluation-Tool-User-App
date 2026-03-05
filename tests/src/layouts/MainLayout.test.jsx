import { vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { accountData } from "../../mocks/data/account";
import { requestCallTracker, responseQueue } from "../../mocks/mockServer";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import { ROUTES } from "../../../src/constants";
import MainLayout from "../../../src/layouts/MainLayout";
import MessageWrapper from "../../../src/components/MessageWrapper";
import { AppLogo } from "../../../src/components/CustomIcon";

vi.mock("../../../src/components/CustomIcon", () => ({
    AppLogo: vi.fn(() => null),
}));

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route
                        path={ROUTES.TEST_MAIN}
                        element={<div>Dashboard</div>}
                    />
                </Route>
                <Route path={ROUTES.LOGIN} element={<div>Login</div>} />
            </Routes>
        </MessageWrapper>
    );
}

describe("MainLayout", () => {
    let reloadMock;

    beforeEach(() => {
        vi.clearAllMocks();
        reloadMock = vi.fn();
        Object.defineProperty(window, "location", {
            value: { ...window.location, reload: reloadMock },
            writable: true,
        });
    });

    it("should render layout correctly", async () => {
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_AVATAR, 200, {
            message: "Successfully retreive account avatar",
            data: "https://example.com/avatar.png",
        });
        const { container } = renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() => {
            // Assert rendering correct logo
            expect(AppLogo).toHaveBeenCalled();
            // Assert rendering correct avatar
            const avatarContainer = container.querySelector(".ant-avatar");
            const avatar = within(avatarContainer);
            const avatarImage = avatar.getByAltText("avatar");
            expect(avatarImage).toBeInTheDocument();
            expect(avatarImage).toHaveAttribute(
                "src",
                "https://example.com/avatar.png",
            );
            // Assert display correct user
            expect(
                screen.getByText(accountData[0].username),
            ).toBeInTheDocument();
            // Assert rendering logout button
            const logoutButton = screen.getByRole("button", {
                name: /logout/i,
            });
            expect(logoutButton).toBeInTheDocument();
        });
    });

    it("should render default avatar when fetch avatar api run failed", async () => {
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_AVATAR, 500, {
            message: "Unexpected error when fetch user avatar",
            code: "error",
        });
        const { container } = renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        await waitFor(() => {
            // Assert rendering default avatar
            const avatarContainer = container.querySelector(".ant-avatar");
            expect(
                within(avatarContainer).queryByAltText("avatar"),
            ).not.toBeInTheDocument();
            expect(
                within(avatarContainer).getByText(accountData[0].username),
            ).toBeInTheDocument();
        });
    });

    it("should logout everything when user click logout button - new user case", async () => {
        localStorage.setItem("user", accountData[0]);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[0] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            // Assert logout request called
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_SCOPE_TOKEN),
            ).toBe(1);

            // Assert local storage cleared
            expect(localStorage.getItem("user")).toBe(null);

            // Assert page reload called
            expect(reloadMock).toHaveBeenCalledTimes(1);
        });
    });

    it("should logout everything when user click logout button - active user case", async () => {
        localStorage.setItem("user", accountData[1]);

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            // Assert logout request called
            expect(requestCallTracker.get(REQUEST_KEYS.LOGOUT)).toBe(1);

            // Assert local storage cleared
            expect(localStorage.getItem("user")).toBe(null);

            // Assert page reload called
            expect(reloadMock).toHaveBeenCalledTimes(1);
        });
    });

    it("should display error when logout failed", async () => {
        localStorage.setItem("user", accountData[1]);
        responseQueue.add(REQUEST_KEYS.LOGOUT, 500, {
            message: "Unexpected error when logout",
            code: "error",
        });

        renderWithProviders(<AppRouter />, {
            preloadedState: { auth: { user: accountData[1] } },
            route: ROUTES.TEST_MAIN,
        });

        const user = userEvent.setup();
        const logoutButton = screen.getByRole("button", { name: /logout/i });
        await user.click(logoutButton);

        await waitFor(() => {
            // Assert logout request called
            expect(requestCallTracker.get(REQUEST_KEYS.LOGOUT)).toBe(1);

            // Assert local storage not cleared
            expect(localStorage.getItem("user")).not.toBe(null);

            // Assert page reload not called
            expect(reloadMock).not.toHaveBeenCalled();
        });
        await waitFor(() => {
            // Assert error message displayed
            expect(
                screen.getByText(/Unexpected error when logout/i),
            ).toBeInTheDocument();
        });
    });
});
