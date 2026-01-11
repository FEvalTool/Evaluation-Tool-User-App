import { screen } from "@testing-library/react";
import {
    securityQuestionsResponse,
    securityAnswers,
} from "../mocks/data/account";

export const setupSecurityQA = async (user) => {
    // Options selection references:
    // https://blog.octalabs.com/testing-insights-for-ant-design-components-in-react-a090f217b784
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

export const setupPassword = async (user) => {
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(passwordInput, "newPASSWORD123@");
    await user.type(confirmPasswordInput, "newPASSWORD123@");
};
