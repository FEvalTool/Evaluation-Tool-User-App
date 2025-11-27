import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Flex, Steps, Typography } from "antd";

import UsernameForm from "../components/forms/UsernameForm";
import SecurityQuestionForm from "../components/forms/SecurityQuestionsForm";
import UpdatePasswordForm from "../components/forms/UpdatePasswordForm";
import SecurityAlert from "../components/SecurityAlert";
import accountService from "../services/accountService";
import authService from "../services/authService";
import { withFormSubmit } from "../utils/apiHelpers";
import { showMessage } from "../slices/messageSlice";
import { ANSWER_KEY_PREFIX, ROUTES } from "../constants";

const { Link, Title } = Typography;

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [current, setCurrent] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exp, setExp] = useState(0);
    const dispatch = useDispatch();

    const onSubmitUsernameForm = async (values) => {
        try {
            let response = await withFormSubmit(
                () => accountService.getUserSecurityQuestions(values),
                setLoading,
                dispatch,
                showMessage
            );
            setQuestions(response.data.questions);
            setUsername(values["username"]);
            setCurrent(1);
        } catch (error) {
            console.debug(error); // NOSONAR intentionally ignoring the error
        }
    };

    const onSubmitSecurityAnswersForm = async (values) => {
        try {
            // Preprocess payloads to send back to backend
            let question_ids = Object.keys(values).map((key) =>
                Number(key.replace(ANSWER_KEY_PREFIX, ""))
            );
            let answers = Object.values(values);
            let payloads = {
                questions: question_ids,
                answers: answers,
                username: username,
            };
            let response = await withFormSubmit(
                () => authService.genSecurityQAVerificationToken(payloads),
                setLoading,
                dispatch,
                showMessage
            );
            setExp(response.data.exp);
            setCurrent(2);
        } catch (error) {
            console.debug(error); // NOSONAR intentionally ignoring the error
        }
    };

    const onSubmitSetPasswordForm = async (values) => {
        try {
            await withFormSubmit(
                async () => {
                    const res1 = await accountService.setPassword(values);
                    const res2 = await authService.deleteScopeToken();
                    return { res1, res2 };
                },
                setLoading,
                dispatch,
                showMessage
            );
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.debug(error); // NOSONAR intentionally ignoring the error
        }
    };
    const steps = [
        {
            title: "Enter Username",
            content: (
                <UsernameForm
                    onSubmit={onSubmitUsernameForm}
                    disabled={loading}
                />
            ),
        },
        {
            title: "Security Questions",
            content: (
                <SecurityQuestionForm
                    onSubmit={onSubmitSecurityAnswersForm}
                    questions={questions}
                    disabled={loading}
                />
            ),
        },
        {
            title: "Change password",
            content: (
                <>
                    <SecurityAlert exp={exp} />
                    <UpdatePasswordForm
                        onSubmit={onSubmitSetPasswordForm}
                        disabled={loading}
                    />
                </>
            ),
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <Flex justify="space-between" align="center">
                <Title level={3} style={{ margin: "0px" }}>
                    Forgot Password
                </Title>
                <Link href={ROUTES.LOGIN} disabled={loading}>
                    Back to Login
                </Link>{" "}
            </Flex>
            <Steps
                progressDot
                size="small"
                type="navigation"
                current={current}
                items={items}
            />
            {steps[current].content}
        </>
    );
};

export default ForgotPasswordPage;
