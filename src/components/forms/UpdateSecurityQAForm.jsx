import { useState, useEffect } from "react";
import { Form, Col, Row, Input, Select } from "antd";

import securityQuestionService from "../../services/securityQuestionService";
import BaseForm from "./BaseForm";
import { QUESTION_KEY_PREFIX, ANSWER_KEY_PREFIX } from "../../constants";

const UpdateSecurityQAForm = ({ onSubmit }) => {
    const NUMBER_OF_QUESTIONS = 3;
    const [selectedQuestions, setSelectedQuestions] = useState(
        new Array(NUMBER_OF_QUESTIONS).fill(null)
    );
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await securityQuestionService.getSecurityQuestions(
                {
                    status: "Official",
                }
            );
            // Convert fetch data to correct format
            const questionOptions = response.data.questions.map((question) => ({
                value: question.id,
                label: question.content,
            }));
            console.log("options", questionOptions);
            setQuestions(questionOptions);
        };
        fetchQuestions();
    }, []);

    const handleSelectChange = (value, index) => {
        setSelectedQuestions((prev) => {
            const newValues = [...prev];
            newValues[index] = value;
            return newValues;
        });
    };

    const getOptions = (index) => {
        const chosen = selectedQuestions.filter(
            (v, i) => v !== null && i !== index
        );
        return questions.filter((q) => !chosen.includes(q.value));
    };

    return (
        <BaseForm onSubmit={onSubmit}>
            {Array.from({ length: NUMBER_OF_QUESTIONS }, (_, idx) => (
                <Row justify="space-between">
                    <Col span={11}>
                        <Form.Item
                            label={`Question ${idx + 1}`}
                            name={`${QUESTION_KEY_PREFIX}${idx}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please select security question!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a question"
                                options={getOptions(idx)}
                                onChange={(value) =>
                                    handleSelectChange(value, idx)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item
                            label={`Answer ${idx + 1}`}
                            name={`${ANSWER_KEY_PREFIX}${idx}`}
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your security answer!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            ))}
        </BaseForm>
    );
};

export default UpdateSecurityQAForm;
