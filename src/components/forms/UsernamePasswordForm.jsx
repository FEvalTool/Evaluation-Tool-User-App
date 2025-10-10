import { Button, Form, Input, message } from "antd";

const UsernamePasswordForm = ({ onSubmit }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
            console.log("error", error);
            console.log("error.response", error.response);
            console.log("error.response.data", error.response.data);
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
            <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UsernamePasswordForm;
