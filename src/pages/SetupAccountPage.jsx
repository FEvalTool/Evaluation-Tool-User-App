import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Badge,
    Button,
    ConfigProvider,
    Flex,
    Layout,
    Progress,
    Typography,
} from "antd";

import { PasswordIcon, SecurityQuestionIcon } from "../components/CustomIcon";
import MenuContainer from "../components/MenuContainer";
import UpdatePasswordForm from "../components/forms/UpdatePasswordForm";
import UpdateSecurityQAForm from "../components/forms/UpdateSecurityQAForm";
import {
    setupPasswordFirstTime,
    setupSecurityQAFirstTime,
} from "../slices/authSlice";
import authService from "../services/authService";
import { ROUTES, QUESTION_KEY_PREFIX, ANSWER_KEY_PREFIX } from "../constants";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const SetupAccountPage = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState("welcome");
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    const onSubmitSetPasswordForm = async (values) => {
        const resultAction = await dispatch(setupPasswordFirstTime(values));
        if (setupPasswordFirstTime.fulfilled.match(resultAction)) {
        }
    };

    const onSubmitSetSecurityQAForm = async (values) => {
        // Sort values by keys (answer-1, answer-2, ..., question-1, question-2)
        const sortedKeys = Object.keys(values).sort();
        // Get questions and answers group
        const payload = sortedKeys.reduce(
            (acc, key) => {
                const value = values[key];

                if (key.startsWith(QUESTION_KEY_PREFIX)) {
                    acc.questions.push(value);
                } else if (key.startsWith(ANSWER_KEY_PREFIX)) {
                    acc.answers.push(value);
                }

                return acc;
            },
            { questions: [], answers: [] }
        );
        const resultAction = await dispatch(setupSecurityQAFirstTime(payload));
        if (setupSecurityQAFirstTime.fulfilled.match(resultAction)) {
        }
    };

    const handleCompleteSetup = async (e) => {
        await authService.deleteScopeToken();
        navigate(ROUTES.SETUP_ACCOUNT, { replace: true });
    };

    const handleMenuClick = (e) => {
        setCurrent(e.key);
    };

    const components = {
        welcome: {
            title: "Welcome",
            component: (
                <>
                    <Paragraph>
                        To get started, choose a setup option from the menu —
                        you can begin by setting your password, security
                        questions, or profile.
                    </Paragraph>
                    <Paragraph>
                        Once all steps are done, your account will be ready to
                        use!
                    </Paragraph>
                </>
            ),
        },
        password: {
            title: "Setup Password",
            component: (
                <UpdatePasswordForm
                    disabled={loading}
                    onSubmit={onSubmitSetPasswordForm}
                    shouldWarn={false}
                />
            ),
        },
        securityQuestions: {
            title: "Setup Security Question",
            component: (
                <UpdateSecurityQAForm
                    disabled={loading}
                    onSubmit={onSubmitSetSecurityQAForm}
                    shouldWarn={false}
                />
            ),
        },
    };

    const process = user["first_time_setup"]
        ? ((Number(user["is_password_setup"]) +
              Number(user["is_security_qa_setup"])) /
              2) *
          100
        : 100;

    const menuItems = [
        {
            key: "progress",
            icon: <Progress type="circle" percent={process} size={50} />,
            disabled: true,
            style: {
                pointerEvents: "none",
                marginBottom: "10px",
            }, // Not displaying disable pointer in the whole menu item
            label: (
                <Button
                    disabled={!(process === 100)}
                    onClick={handleCompleteSetup}
                    type="primary"
                    style={{
                        border: "None",
                        pointerEvents: "auto", // Except this one
                    }}
                >
                    Complete setup
                </Button>
            ),
        },
        {
            type: "divider",
        },
        {
            key: "password",
            icon: (
                <Badge
                    status={
                        !user["first_time_setup"] ||
                        user["is_password_setup"] === true
                            ? "success"
                            : "error"
                    }
                    dot={true}
                >
                    <PasswordIcon fill="rgba(255,255,255,0.65)" />
                </Badge>
            ),
            label: (
                <>
                    Setup Password <Text type="warning">*</Text>
                </>
            ),
        },
        {
            key: "securityQuestions",
            icon: (
                <Badge
                    status={
                        !user["first_time_setup"] ||
                        user["is_security_qa_setup"] === true
                            ? "success"
                            : "error"
                    }
                    dot={true}
                >
                    <SecurityQuestionIcon fill="rgba(255,255,255,0.65)" />
                </Badge>
            ),
            label: (
                <>
                    Setup Security Questions <Text type="warning">*</Text>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ width: "100vw", height: "100vh" }}>
            <ConfigProvider
                theme={{
                    token: {
                        // For disabled button
                        colorBgContainerDisabled: "rgba(255, 255, 255, 0.12)",
                        colorTextDisabled: "rgba(255, 255, 255, 0.45)",
                    },
                    components: {
                        Progress: {
                            circleTextColor: "rgb(255, 255, 255)",
                        },
                    },
                }}
            >
                <MenuContainer
                    collapsible={false}
                    items={menuItems}
                    handleMenuClick={handleMenuClick}
                    current={current}
                />
            </ConfigProvider>
            <Layout>
                <Content>
                    <Flex vertical={true} style={{ padding: "20px" }}>
                        <Title level={3} style={{ marginTop: "0px" }}>
                            {components[current]["title"]}
                        </Title>
                        {components[current]["component"]}
                    </Flex>
                </Content>
            </Layout>
        </Layout>
    );
};

export default SetupAccountPage;
