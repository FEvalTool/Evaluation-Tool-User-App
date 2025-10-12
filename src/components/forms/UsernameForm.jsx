import { Form, Input, Typography } from "antd";
import BaseForm from "./BaseForm";

const { Text } = Typography;

const UsernameForm = ({ onSubmit }) => {
    return (
        <BaseForm onSubmit={onSubmit}>
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
        </BaseForm>
    );
};

export default UsernameForm;
