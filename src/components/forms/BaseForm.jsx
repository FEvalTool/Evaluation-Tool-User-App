import PropTypes from "prop-types";
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

BaseForm.propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

BaseForm.defaultProps = {
    disabled: false,
};

export default BaseForm;
