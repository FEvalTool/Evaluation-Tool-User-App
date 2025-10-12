import { screen, waitFor } from "@testing-library/react";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../mocks/data/account";

export const goDirectlyToSecurityQuestionsStep = async (user) => {
    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {});
};

export const goDirectlyToChangePasswordStep = async (user) => {
    await goDirectlyToSecurityQuestionsStep(user);

    for (const index of securityQuestionsResponse.keys()) {
        const questionInput = screen.getByLabelText(
            securityQuestionsResponse[index].content
        );
        await user.type(questionInput, securityAnswers[index]);
    }
    await user.click(screen.getByRole("button", { name: /submit/i }));
};
