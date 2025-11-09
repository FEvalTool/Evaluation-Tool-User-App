import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;

const MainLayout = () => {
    const { user } = useSelector((state) => state.auth);
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
            <Paragraph>
                id: {user.id} - username: {user.username}
            </Paragraph>
            <Outlet />
        </>
    );
};

export default MainLayout;
