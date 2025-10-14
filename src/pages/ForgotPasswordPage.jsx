import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Steps, Typography } from "antd";

import UsernameForm from "../components/forms/UsernameForm";
import SecurityQuestionForm from "../components/forms/SecurityQuestionsForm";
import UpdatePasswordForm from "../components/forms/UpdatePasswordForm";
import {
    getUserSecurityQuestions,
    setPassword,
} from "../services/accountServices";
import { genSecurityQAVerificationToken } from "../services/authServices";
import { ANSWER_KEY_PREFIX } from "../constants/prefixes";
import ROUTES from "../constants/routes";

const { Link, Title } = Typography;

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [current, setCurrent] = useState(0);
    const [questions, setQuestions] = useState([]);

    const onSubmitUsernameForm = async (values) => {
        let response = await getUserSecurityQuestions(values);
        setQuestions(response.data.questions);
        setUsername(values["username"]);
        setCurrent(1);
    };

    const onSubmitSecurityAnswersForm = async (values) => {
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
        let response = await genSecurityQAVerificationToken(payloads);
        setVerificationToken(response.data.token);
        setCurrent(2);
    };

    const onSubmitSetPasswordForm = async (values) => {
        let payloads = {
            ...values,
            token: verificationToken,
        };
        await setPassword(payloads);
        navigate(ROUTES.LOGIN);
    };
    const steps = [
        {
            title: "Enter Username",
            content: <UsernameForm onSubmit={onSubmitUsernameForm} />,
        },
        {
            title: "Security Questions",
            content: (
                <SecurityQuestionForm
                    onSubmit={onSubmitSecurityAnswersForm}
                    questions={questions}
                />
            ),
        },
        {
            title: "Change password",
            content: <UpdatePasswordForm onSubmit={onSubmitSetPasswordForm} />,
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <Flex justify="space-between" align="center">
                <Title level={3} style={{ margin: "0px" }}>
                    Forgot Password
                </Title>
                <Link href={ROUTES.LOGIN}>Back to Login</Link>{" "}
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
