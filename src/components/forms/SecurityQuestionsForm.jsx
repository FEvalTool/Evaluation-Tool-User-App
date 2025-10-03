import { Button, Form, Input, message } from "antd";

import { ANSWER_KEY_PREFIX } from "../../constants/prefixes";

const SecurityQuestionForm = ({ questions, onSubmit }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
            messageApi.open({
                type: "error",
                content: error.response.data.message,
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
            <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SecurityQuestionForm;
