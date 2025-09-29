import { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Input, Typography, Statistic, Button, message } from "antd";

import { login } from "../services/authServices";

const { Title, Link } = Typography;

const LoginPage = () => {
    const [formDisabled, setFormDisabled] = useState(false);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setFormDisabled(true);
            await login(values);
            navigate("/test-main");
        } catch (error) {
            setFormDisabled(false);
            messageApi.open({
                type: "error",
                content: error.response.data.message,
            });
        }
    };
    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            disabled={formDisabled}
        >
            {contextHolder}
            <Form.Item>
                <Title level={3} style={{ margin: "0px" }}>
                    Login
                </Title>
            </Form.Item>
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Please input your username!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your password!",
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Link href="/forgot-password">Forgot Password?</Link>
            </Form.Item>
            <Form.Item style={{ float: "right" }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={formDisabled}
                >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};
export default LoginPage;
