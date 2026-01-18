import { screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { requestCallTracker } from "../../../mocks/mockServer";
import { REQUEST_KEYS } from "../../../helpers/requestHelpers";
import accountService from "../../../../src/services/accountService";
import UpdatePasswordForm from "../../../../src/components/forms/UpdatePasswordForm";

const renderForm = () => {
    render(
        <UpdatePasswordForm
            onSubmit={async (values) => {
                const res1 = await accountService.setPassword(values);
            }}
        />
    );
};

describe("UpdatePasswordForm", async () => {
    it("should display confirm password error when user input confirm password different from new password", async () => {
        renderForm();
        const user = userEvent.setup();

        await user.click(screen.getByLabelText(/new password/i));
        await user.paste("newPASSWORD123@");
        await user.click(screen.getByLabelText(/confirm password/i));
        await user.paste("newPASSWORD123@1");
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(requestCallTracker.get(REQUEST_KEYS.SET_PASSWORD)).toBe(0);
            expect(
                screen.getByText(
                    /the new password that you entered do not match/i
                )
            ).toBeInTheDocument();
        });
    });

    it("should display required error when user submits without entering password", async () => {
        renderForm();
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(requestCallTracker.get(REQUEST_KEYS.SET_PASSWORD)).toBe(0);
            expect(
                screen.getByText(/please input your password/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/please confirm your password/i)
            ).toBeInTheDocument();
        });
    });
});
