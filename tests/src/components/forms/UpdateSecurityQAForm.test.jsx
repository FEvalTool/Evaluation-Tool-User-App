import { screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";

import UpdateSecurityQAForm from "../../../../src/components/forms/UpdateSecurityQAForm";
import { REQUEST_KEYS } from "../../../helpers/requestHelpers";
import { requestCallTracker } from "../../../mocks/mockServer";

const renderForm = () => {
    render(<UpdateSecurityQAForm onSubmit={vi.fn()} />);
};

describe("UpdateSecurityQAForm", async () => {
    it("should removes selected question from other dropdowns", async () => {
        renderForm();
        await waitFor(() =>
            // Check that questions are fetched
            expect(
                requestCallTracker.get(REQUEST_KEYS.GET_SECURITY_QUESTIONS),
            ).toBe(1),
        );
        const user = userEvent.setup();
        const questionInputList = screen.getAllByRole("combobox");

        // Open first dropdown and select a question
        await user.click(questionInputList[0]);
        const options = await screen.findAllByRole("option");
        expect(options).toHaveLength(3);

        // Select option from the dropdown
        const option = await screen.findByRole("option", {
            name: "Where did your parent first met?",
        });
        await user.click(option);

        // Open second dropdown and check options
        await user.click(questionInputList[1]);
        const newOptions = await screen.findAllByRole("option");
        expect(newOptions).toHaveLength(2);
        expect(
            screen.queryByRole("option", {
                name: "Where did your parent first met?",
            }),
        ).not.toBeInTheDocument();
    });
});
