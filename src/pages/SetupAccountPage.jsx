import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import accountService from "../services/accountService";
import { ROUTES } from "../constants";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const SetupAccountPage = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState("welcome");

    const onSubmitUpdatePasswordForm = async (values) => {
        let payloads = {
            ...values,
            token: verificationToken,
        };
        await accountService.setPassword(payloads);
        navigate(ROUTES.LOGIN);
    };

    const onSubmitUpdateSecurityQAForm = async (values) => {};

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
                <UpdatePasswordForm onSubmit={onSubmitUpdatePasswordForm} />
            ),
        },
        securityQuestions: {
            title: "Setup Security Question",
            component: (
                <UpdateSecurityQAForm onSubmit={onSubmitUpdateSecurityQAForm} />
            ),
        },
    };

    const menuItems = [
        {
            key: "progress",
            icon: <Progress type="circle" percent={60} size={50} />,
            disabled: true,
            style: {
                pointerEvents: "none",
                marginBottom: "10px",
            }, // Not displaying disable pointer in the whole menu item
            label: (
                <Button
                    disabled={true}
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
                <Badge status="success" dot={true}>
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
                <Badge status="success" dot={true}>
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
                    {/* <Flex style={{ padding: "24px" }} vertical={true}>
                        <Title level={3}>{components[current]["title"]}</Title>
                        {components[current]["component"]}
                    </Flex> */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default SetupAccountPage;
