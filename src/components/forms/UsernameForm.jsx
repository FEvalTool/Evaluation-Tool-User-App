import PropTypes from "prop-types";
import { Form, Input, Typography } from "antd";

import BaseForm from "./BaseForm";

const { Text } = Typography;

const UsernameForm = ({ onSubmit, disabled }) => {
    return (
        <BaseForm onSubmit={onSubmit} disabled={disabled}>
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

UsernameForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

UsernameForm.defaultProps = {
    disabled: false,
};

export default UsernameForm;
