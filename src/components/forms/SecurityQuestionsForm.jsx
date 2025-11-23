import PropTypes from "prop-types";
import { Form, Input } from "antd";

import BaseForm from "./BaseForm";
import { ANSWER_KEY_PREFIX } from "../../constants";

const SecurityQuestionForm = ({ questions, onSubmit, disabled }) => {
    return (
        <BaseForm onSubmit={onSubmit} disabled={disabled}>
            {questions.map((question) => (
                <Form.Item
                    label={question.content}
                    name={`${ANSWER_KEY_PREFIX}${question.id}`}
                    rules={[
                        {
                            required: true,
                            message: "Please input your security answer!",
                        },
                    ]}
                >
                    <Input placeholder="Please enter your security answer" />
                </Form.Item>
            ))}
        </BaseForm>
    );
};

SecurityQuestionForm.propTypes = {
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            content: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

SecurityQuestionForm.defaultProps = {
    disabled: false,
};

export default SecurityQuestionForm;
