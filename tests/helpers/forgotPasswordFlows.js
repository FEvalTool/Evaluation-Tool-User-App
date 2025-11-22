import { screen, waitFor } from "@testing-library/react";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../mocks/data/account";

export const goDirectlyToSecurityQuestionsStep = async (user) => {
    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
        // Wait for step 2 - Security questions step to actual load
        securityQuestionsResponse.forEach((question) => {
            screen.getByLabelText(question.content);
        });
    });
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
    await waitFor(() => {
        // Wait for step 3 - Update password to actual load
        screen.getByLabelText(/new password/i);
    });
};
