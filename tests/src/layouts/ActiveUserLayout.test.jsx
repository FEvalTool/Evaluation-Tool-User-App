import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../../../src/constants";
import ActiveUserLayout from "../../../src/layouts/ActiveUserLayout";

function AppRouter() {
    return (
        <Routes>
            <Route element={<ActiveUserLayout />}>
                <Route path={ROUTES.TEST_MAIN} element={<div>Dashboard</div>} />
                <Route
                    path={ROUTES.ACCOUNT_INFO}
                    element={<div>Account info</div>}
                />
            </Route>
        </Routes>
    );
}

describe("Active User Layout", () => {
    it("should render layout correctly", async () => {
        renderWithProviders(<AppRouter />, {
            route: ROUTES.TEST_MAIN,
        });

        // Assert menu display correct items
        const accountInfoMenu = screen.getByText(/user info/i);
        const testMenu = screen.getByText(/test/i);
        expect(accountInfoMenu).toBeInTheDocument();
        expect(testMenu).toBeInTheDocument();

        // Assert test menu item is selected
        const accountInfoMenuItem = accountInfoMenu.closest(".ant-menu-item");
        const testMenuItem = testMenu.closest(".ant-menu-item");
        expect(accountInfoMenuItem).not.toHaveClass("ant-menu-item-selected");
        expect(testMenuItem).toHaveClass("ant-menu-item-selected");

        // Assert the current page display is dashboard page
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    it("should change page when select different menu item", async () => {
        renderWithProviders(<AppRouter />, {
            route: ROUTES.TEST_MAIN,
        });
        const user = userEvent.setup();

        const accountInfoMenuItem = screen
            .getByText(/user info/i)
            .closest(".ant-menu-item");
        const testMenuItem = screen
            .getByText(/test/i)
            .closest(".ant-menu-item");
        await user.click(accountInfoMenuItem);

        // Assert user info menu item is selected
        expect(accountInfoMenuItem).toHaveClass("ant-menu-item-selected");
        expect(testMenuItem).not.toHaveClass("ant-menu-item-selected");

        // Assert page display is account info page
        expect(screen.getByText(/account info/i)).toBeInTheDocument();
    });
});
