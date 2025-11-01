import { useState, useEffect } from "react";
import { Typography } from "antd";

import { testAPI } from "../services/testServices";

const { Paragraph } = Typography;

const TestPage = () => {
    const [message, setMessage] = useState();

    useEffect(() => {
        const getBackendMessage = async () => {
            try {
                const response = await testAPI();
                setMessage(response.data.message);
            } catch (error) {
                console.log(error);
            }
        };

        getBackendMessage();
    }, []);

    return (
        <>
            <Paragraph>
                This is a message from Backend (for development purposes)
            </Paragraph>
            <Paragraph>{message || "Something went wrong"}</Paragraph>
        </>
    );
};

export default TestPage;
