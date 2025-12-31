import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    notification,
    Badge,
    Button,
    ConfigProvider,
    Flex,
    Layout,
    Progress,
    Space,
    Typography,
} from "antd";

import { PasswordIcon, SecurityQuestionIcon } from "../components/CustomIcon";
import MenuContainer from "../components/MenuContainer";
import UpdatePasswordForm from "../components/forms/UpdatePasswordForm";
import UpdateSecurityQAForm from "../components/forms/UpdateSecurityQAForm";
import SecurityAlert from "../components/SecurityAlert";
import {
    setupPasswordFirstTime,
    setupSecurityQAFirstTime,
    logout,
} from "../slices/authSlice";
import { ROUTES, QUESTION_KEY_PREFIX, ANSWER_KEY_PREFIX } from "../constants";
import SuccessResult from "../components/SuccessResult";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const SetupAccountPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, scopeExp } = useSelector((state) => state.auth);

    const [current, setCurrent] = useState("welcome");
    const [loadingCompleteButton, setLoadingCompleteButton] = useState(false);

    const stayOnPageRef = useRef(false);
    const notificationKeyRef = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        // 1. If there is an existing notification, destroy it immediately
        if (notificationKeyRef.current) {
            api.destroy(notificationKeyRef.current);
        }

        // 2. Reset our flag
        stayOnPageRef.current = false;
        setLoadingCompleteButton(true);

        // 3. Create a truly unique key for THIS specific notification instance
        const key = `open${Date.now()}`;
        notificationKeyRef.current = key;

        const notificationBtn = (
            <Space>
                <Button
                    onClick={() => {
                        stayOnPageRef.current = true;
                        api.destroy(key);
                        setLoadingCompleteButton(false);
                        notificationKeyRef.current = null;
                    }}
                >
                    Stay on page
                </Button>
                <Button type="primary" onClick={handleRedirectLogin}>
                    Login now
                </Button>
            </Space>
        );
        api.open({
            title: "Setup Complete!",
            description:
                "You've finished the required steps. We'll redirect you to the login page shortly, but feel free to stay if you want to complete any remaining optional information.",
            btn: notificationBtn,
            key,
            onClose: () => {
                // ONLY redirect if:
                // - The user didn't click "Stay on page"
                // - AND this specific notification is still the "active" one
                if (
                    !stayOnPageRef.current &&
                    notificationKeyRef.current === key
                ) {
                    handleRedirectLogin();
                }
            },
            closeIcon: false,
            duration: 5,
            showProgress: true,
            pauseOnHover: false,
        });
    };
    const handleRedirectLogin = async () => {
        const resultAction = await dispatch(logout({ first_time_setup: true }));
        if (logout.fulfilled.match(resultAction)) {
            navigate(ROUTES.LOGIN, { replace: true });
        }
        setLoadingCompleteButton(false);
    };

    const onSubmitSetPasswordForm = async (values) => {
        await dispatch(setupPasswordFirstTime(values));
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
        await dispatch(setupSecurityQAFirstTime(payload));
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
            component:
                !user["first_time_setup"] ||
                user["is_password_setup"] === true ? (
                    <SuccessResult
                        title="Complete Setup Password"
                        subTitle="You can move to unfinished sections and complete the setup"
                    />
                ) : (
                    <UpdatePasswordForm
                        disabled={loading || loadingCompleteButton}
                        onSubmit={onSubmitSetPasswordForm}
                        shouldWarn={false}
                    />
                ),
        },
        securityQuestions: {
            title: "Setup Security Question",
            component:
                !user["first_time_setup"] ||
                user["is_security_qa_setup"] === true ? (
                    <SuccessResult
                        title="Complete Setup Security Question"
                        subTitle="You can move to unfinished sections and complete the setup"
                    />
                ) : (
                    <UpdateSecurityQAForm
                        disabled={loading || loadingCompleteButton}
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
                    disabled={process !== 100 || loadingCompleteButton}
                    loading={loadingCompleteButton}
                    onClick={openNotification}
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
            disabled: loadingCompleteButton,
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
            disabled: loadingCompleteButton,
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
            {contextHolder}
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
                    <SecurityAlert exp={scopeExp} />
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
