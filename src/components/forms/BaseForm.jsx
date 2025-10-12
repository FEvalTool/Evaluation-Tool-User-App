import { Form, Button, message } from "antd";

const BaseForm = ({ children, onSubmit }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
            messageApi.open({
                type: "error",
                content: error?.response?.data?.message || "An error occurred",
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
            {children}
            <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default BaseForm;
