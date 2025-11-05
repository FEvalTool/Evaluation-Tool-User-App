import { Form, Input } from "antd";
import BaseForm from "./BaseForm";
import { ANSWER_KEY_PREFIX } from "../../constants";

const SecurityQuestionForm = ({ questions, onSubmit }) => {
    return (
        <BaseForm onSubmit={onSubmit}>
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

export default SecurityQuestionForm;
