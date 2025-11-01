import { Typography } from "antd";
const { Title, Paragraph } = Typography;

const TestTwoPage = () => {
    return (
        <>
            <Title
                level={3}
                style={{
                    textAlign: "center",
                }}
            >
                Testing page
            </Title>
            <Paragraph>This is Test two page</Paragraph>
        </>
    );
};

export default TestTwoPage;
