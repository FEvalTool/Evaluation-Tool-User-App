import { Button, Form, Input, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import {
    PASSWORD_PATTERN,
    PASSWORD_PATTERN_TOOLTIP,
} from "../../constants/passwordPatterns";

const UpdatePasswordForm = ({ onSubmit }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
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
        >
            {contextHolder}
            <Form.Item
                label="New password"
                name="password"
                rules={[
                    ...PASSWORD_PATTERN,
                    {
                        required: true,
                        message: "Please input your password!",
                    },
                ]}
                tooltip={{
                    title: PASSWORD_PATTERN_TOOLTIP,
                    icon: <InfoCircleOutlined />,
                }}
                validateDebounce={2000}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="Confirm new Password"
                name="confirm"
                dependencies={["password"]}
                rules={[
                    {
                        required: true,
                        message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error(
                                    "The new password that you entered do not match!"
                                )
                            );
                        },
                    }),
                ]}
                validateDebounce={2000}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdatePasswordForm;
