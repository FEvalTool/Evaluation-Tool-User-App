import { Typography } from "antd";
const { Title, Paragraph } = Typography;

const TestOnePage = () => {
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
            <Paragraph>This is Test one page</Paragraph>
        </>
    );
};

export default TestOnePage;
