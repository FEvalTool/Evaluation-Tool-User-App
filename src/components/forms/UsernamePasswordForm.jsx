import { Form, Input } from "antd";
import BaseForm from "./BaseForm";

const UsernamePasswordForm = ({ onSubmit, disabled = false }) => {
    return (
        <BaseForm onSubmit={onSubmit} disabled={disabled}>
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    { required: true, message: "Please input your username!" },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: "Please input your password!" },
                ]}
            >
                <Input.Password />
            </Form.Item>
        </BaseForm>
    );
};

export default UsernamePasswordForm;
