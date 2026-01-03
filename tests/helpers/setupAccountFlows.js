import { screen, waitFor } from "@testing-library/react";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../mocks/data/account";

export const setupSecurityQA = async (user) => {
    const questionInputList = screen.getAllByRole("combobox");

    // qa setup
    for (let i = 0; i < securityAnswers.length; i++) {
        await user.click(questionInputList[i]);
        const questionOptions = await screen.findAllByText(
            securityQuestionsResponse[i].content
        );
        await user.click(questionOptions[questionOptions.length - 1]);
        const answerInput = screen.getByLabelText(
            new RegExp(`Answer ${i + 1}`, "i")
        );
        await user.type(answerInput, securityAnswers[i]);
    }
};
