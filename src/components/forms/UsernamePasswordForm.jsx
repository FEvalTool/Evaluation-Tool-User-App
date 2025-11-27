import PropTypes from "prop-types";
import { Form, Input } from "antd";

import BaseForm from "./BaseForm";

const UsernamePasswordForm = ({ onSubmit, disabled }) => {
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

UsernamePasswordForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

UsernamePasswordForm.defaultProps = {
    disabled: false,
};

export default UsernamePasswordForm;
