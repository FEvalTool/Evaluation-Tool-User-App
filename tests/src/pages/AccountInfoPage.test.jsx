import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";

import { renderWithProviders } from "../../mocks/mockStoreWrapper";
import { accountData } from "../../mocks/data/account";
import { responseQueue } from "../../mocks/mockServer";
import { REQUEST_KEYS } from "../../helpers/requestHelpers";
import { requestCallTracker } from "../../mocks/mockServer";
import { ROUTES } from "../../../src/constants";
import AccountInfoPage from "../../../src/pages/AccountInfoPage";
import MessageWrapper from "../../../src/components/MessageWrapper";

function AppRouter() {
    return (
        <MessageWrapper>
            <Routes>
                <Route
                    path={ROUTES.ACCOUNT_INFO}
                    element={<AccountInfoPage />}
                />
            </Routes>
        </MessageWrapper>
    );
}

const file = new File(["(binary data)"], "avatar.png", {
    type: "image/png",
});

const largeFile = new File(
    [new Uint8Array(2 * 1024 * 1024 + 1)],
    "avatar.pdf",
    {
        type: "image/pngf",
    },
);

describe("Account Info Page", () => {
    it("should render Account Info page correctly - full data case", async () => {
        const { container } = renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });

        await waitFor(() => {
            // Assert API call
            expect(requestCallTracker.get(REQUEST_KEYS.GET_ACCOUNT_INFO)).toBe(
                1,
            );

            // Assert user info label
            const usernameLabel = screen.getByText(/^username$/i);
            const nameLabel = screen.getByText(/^name$/i);
            const phoneNumberLabel = screen.getByText(/^phone number$/i);
            const birthdayLabel = screen.getByText(/^birthday$/i);
            const identityNumberLabel = screen.getByText(/^identity number$/i);
            const roleLabel = screen.getByText(/^role$/i);

            expect(usernameLabel).toBeInTheDocument();
            expect(nameLabel).toBeInTheDocument();
            expect(phoneNumberLabel).toBeInTheDocument();
            expect(birthdayLabel).toBeInTheDocument();
            expect(identityNumberLabel).toBeInTheDocument();
            expect(roleLabel).toBeInTheDocument();

            // Assert user info value
            const usernameValue = screen.getByText(/^activeUser$/i);
            const nameValue = screen.getByText(/^Active User$/i);
            const phoneNumberValue = screen.getByText(/^0332244666$/i);
            const birthdayValue = screen.getByText(/^2000-04-11$/i);
            const identityNumberValue = screen.getByText(/^001100023344$/i);
            const roleValue = screen.getByText(/^user$/i);

            expect(usernameValue).toBeInTheDocument();
            expect(nameValue).toBeInTheDocument();
            expect(phoneNumberValue).toBeInTheDocument();
            expect(birthdayValue).toBeInTheDocument();
            expect(identityNumberValue).toBeInTheDocument();
            expect(roleValue).toBeInTheDocument();

            // Assert avatar image content
            const avatarContainer = container.querySelector(".ant-avatar");
            const avatar = within(avatarContainer);
            const avatarImage = avatar.getByAltText("avatar");

            expect(avatarImage).toBeInTheDocument();
            expect(avatarImage).toHaveAttribute(
                "src",
                "https://avatars.githubusercontent.com/u/avatar",
            );

            // Assert buttons
            const uploadButton = screen.getByRole("button", {
                name: /upload avatar/i,
            });
            const deleteButton = screen.getByRole("button", {
                name: /delete avatar/i,
            });
            expect(uploadButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();
        });
    });

    it("should render Account Info page correctly - error when fetch user info case", async () => {
        responseQueue.add(REQUEST_KEYS.GET_ACCOUNT_INFO, 500, {
            message: "Unexpected error when fetch user info",
            code: "error",
        });

        renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });

        await waitFor(() => {
            // Assert API call
            expect(requestCallTracker.get(REQUEST_KEYS.GET_ACCOUNT_INFO)).toBe(
                1,
            );

            // Assert user info label not in page
            const usernameLabel = screen.queryByText(/^username$/i);
            const nameLabel = screen.queryByText(/^name$/i);
            const phoneNumberLabel = screen.queryByText(/^phone number$/i);
            const birthdayLabel = screen.queryByText(/^birthday$/i);
            const identityNumberLabel =
                screen.queryByText(/^identity number$/i);
            const roleLabel = screen.queryByText(/^role$/i);

            expect(usernameLabel).not.toBeInTheDocument();
            expect(nameLabel).not.toBeInTheDocument();
            expect(phoneNumberLabel).not.toBeInTheDocument();
            expect(birthdayLabel).not.toBeInTheDocument();
            expect(identityNumberLabel).not.toBeInTheDocument();
            expect(roleLabel).not.toBeInTheDocument();
        });
    });

    it("should update avatar when upload avatar api run successfully", async () => {
        const user = userEvent.setup();
        const { store, container } = renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });

        const uploadButton = await screen.findByRole("button", {
            name: /upload avatar/i,
        });
        const uploadInput = uploadButton
            .closest(".ant-upload")
            .querySelector('input[type="file"]');

        await user.upload(uploadInput, file);

        await waitFor(() => {
            // Assert API call
            expect(
                requestCallTracker.get(REQUEST_KEYS.UPLOAD_ACCOUNT_AVATAR),
            ).toBe(1);

            // Assert redux avatar state not change
            expect(store.getState().avatar.url).toBe(
                "https://avatars.githubusercontent.com/u/new_avatar",
            );

            // Assert image update
            const avatarContainer = container.querySelector(".ant-avatar");
            const avatar = within(avatarContainer);
            const avatarImage = avatar.getByAltText("avatar");
            expect(avatarImage).toHaveAttribute(
                "src",
                "https://avatars.githubusercontent.com/u/new_avatar",
            );
        });
    });

    it("should not update avatar when upload avatar api run fail", async () => {
        responseQueue.add(REQUEST_KEYS.UPLOAD_ACCOUNT_AVATAR, 500, {
            message: "Unexpected error when upload avatar",
            code: "error",
        });

        const user = userEvent.setup();
        const { store, container } = renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });

        const uploadButton = await screen.findByRole("button", {
            name: /upload avatar/i,
        });
        const uploadInput = uploadButton
            .closest(".ant-upload")
            .querySelector('input[type="file"]');

        await user.upload(uploadInput, file);

        await waitFor(() => {
            // Assert API call
            expect(
                requestCallTracker.get(REQUEST_KEYS.UPLOAD_ACCOUNT_AVATAR),
            ).toBe(1);

            // Assert image not update
            const avatarContainer = container.querySelector(".ant-avatar");
            const avatar = within(avatarContainer);
            const avatarImage = avatar.getByAltText("avatar");
            expect(avatarImage).toHaveAttribute(
                "src",
                "https://avatars.githubusercontent.com/u/avatar",
            );

            // Assert redux avatar state not change
            expect(store.getState().avatar.url).toBe(
                "https://avatars.githubusercontent.com/u/avatar",
            );

            // Assert error notification displayed
            expect(
                screen.getByText(/unexpected error when upload avatar/i),
            ).toBeInTheDocument();
        });
    });

    it("should not update avatar when file invalid", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });

        const uploadButton = await screen.findByRole("button", {
            name: /upload avatar/i,
        });
        const uploadInput = uploadButton
            .closest(".ant-upload")
            .querySelector('input[type="file"]');

        await user.upload(uploadInput, largeFile);

        await waitFor(() => {
            // Assert API call
            expect(
                requestCallTracker.get(REQUEST_KEYS.UPLOAD_ACCOUNT_AVATAR),
            ).toBe(0);

            // Assert image not update
            const avatarContainer = container.querySelector(".ant-avatar");
            const avatar = within(avatarContainer);
            const avatarImage = avatar.getByAltText("avatar");
            expect(avatarImage).toHaveAttribute(
                "src",
                "https://avatars.githubusercontent.com/u/avatar",
            );

            // Assert error notification displayed
            expect(
                screen.getByText(/Image must smaller than 2MB/i),
            ).toBeInTheDocument();
        });
    });

    it("should delete avatar when delete avatar api run successfully", async () => {
        const { store, container } = renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });
        const user = userEvent.setup();
        const button = await screen.findByRole("button", {
            name: /delete avatar/i,
        });
        await user.click(button);

        await waitFor(() => {
            // Assert API call
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_ACCOUNT_AVATAR),
            ).toBe(1);

            // Assert image is deleted (display default avatar)
            const avatarContainer = container.querySelector(".ant-avatar");
            expect(
                within(avatarContainer).queryByAltText("avatar"),
            ).not.toBeInTheDocument();
            expect(
                within(avatarContainer).getByText(accountData[1].username),
            ).toBeInTheDocument();

            // Assert redux avatar state is set to null
            expect(store.getState().avatar.url).toBe(null);
        });
    });

    it("should not delete avatar when delete avatar api run fail", async () => {
        responseQueue.add(REQUEST_KEYS.DELETE_ACCOUNT_AVATAR, 500, {
            message: "Unexpected error when delete avatar",
            code: "error",
        });

        const { store, container } = renderWithProviders(<AppRouter />, {
            preloadedState: {
                auth: { user: accountData[1] },
                avatar: {
                    url: "https://avatars.githubusercontent.com/u/avatar",
                },
            },
            route: ROUTES.ACCOUNT_INFO,
        });
        const user = userEvent.setup();
        const button = await screen.findByRole("button", {
            name: /delete avatar/i,
        });
        await user.click(button);

        await waitFor(() => {
            // Assert API call
            expect(
                requestCallTracker.get(REQUEST_KEYS.DELETE_ACCOUNT_AVATAR),
            ).toBe(1);

            // Assert image is deleted
            const avatarContainer = container.querySelector(".ant-avatar");
            const avatar = within(avatarContainer);
            const avatarImage = avatar.getByAltText("avatar");
            expect(avatarImage).toHaveAttribute(
                "src",
                "https://avatars.githubusercontent.com/u/avatar",
            );

            // Assert redux avatar state is set to null
            expect(store.getState().avatar.url).not.toBe(null);
        });
    });
});
