import { Form, Button } from "antd";

const BaseForm = ({ children, onSubmit, disabled }) => {
    const [form] = Form.useForm();

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={onSubmit}
            autoComplete="off"
            disabled={disabled}
        >
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
