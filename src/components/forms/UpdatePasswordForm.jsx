import { Form, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import BaseForm from "./BaseForm";
import {
    PASSWORD_PATTERN,
    PASSWORD_PATTERN_TOOLTIP,
} from "../../constants/passwordPatterns";

const UpdatePasswordForm = ({ onSubmit }) => {
    return (
        <BaseForm onSubmit={onSubmit}>
            <Form.Item
                label="New password"
                name="password"
                rules={[
                    ...PASSWORD_PATTERN,
                    { required: true, message: "Please input your password!" },
                ]}
                tooltip={{
                    title: PASSWORD_PATTERN_TOOLTIP,
                    icon: <InfoCircleOutlined />,
                }}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="Confirm Password"
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
            >
                <Input.Password />
            </Form.Item>
        </BaseForm>
    );
};

export default UpdatePasswordForm;
