import { Button, Form, Input, Typography, message } from "antd";

const { Text } = Typography;

const UsernameForm = ({ onSubmit }) => {
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
            <Form.Item>
                <Text italic>
                    Enter your registered username to reset you password.
                </Text>
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
            <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UsernameForm;
