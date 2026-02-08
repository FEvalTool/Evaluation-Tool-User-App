import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Flex, Layout, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import { AppLogo } from "../components/CustomIcon";
import { logout } from "../slices/authSlice";
import { ROUTES } from "../constants";

const { Header } = Layout;
const { Text, Title } = Typography;

const MainLayout = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const payload = {
            first_time_setup: user ? user["first_time_setup"] : false,
        };
        const resultAction = await dispatch(logout(payload)); // NOSONAR
        if (logout.fulfilled.match(resultAction)) {
            navigate(ROUTES.LOGIN);
        }
    };

    return (
        <Layout style={{ width: "100vw", height: "100vh" }}>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.25)",
                    zIndex: 10,
                }}
            >
                <Flex align="center" gap={5}>
                    <AppLogo fill="#7C3AED" size={50} />
                    <Title level={3}>User Management Application</Title>
                </Flex>
                <Flex gap={10}>
                    <Button
                        shape="circle"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        aria-label="logout"
                    />
                    <Flex gap={5} align="center">
                        <Avatar
                            style={{ backgroundColor: "#87d068" }}
                            icon={<UserOutlined />}
                        />
                        <Text>{user ? user.username : ""}</Text>
                    </Flex>
                </Flex>
            </Header>
            <Outlet />
        </Layout>
    );
};

export default MainLayout;
