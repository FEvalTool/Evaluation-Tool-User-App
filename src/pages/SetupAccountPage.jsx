import { useSelector } from "react-redux";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;

const SetupAccountPage = () => {
    const { user } = useSelector((state) => state.auth);
    return (
        <>
            <Title>Setup account page</Title>
            <Paragraph>
                id: {user.id} - username: {user.username}
            </Paragraph>
        </>
    );
};

export default SetupAccountPage;
