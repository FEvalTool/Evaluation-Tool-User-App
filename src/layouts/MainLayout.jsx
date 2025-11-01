import { Outlet } from "react-router-dom";
import { Typography } from "antd";
const { Title } = Typography;

const MainLayout = () => {
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
            <Outlet />
        </>
    );
};

export default MainLayout;
