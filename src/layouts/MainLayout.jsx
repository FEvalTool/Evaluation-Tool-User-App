import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Flex, Layout, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import { LogoIcon } from "../components/CustomIcon";
import { logout } from "../slices/authSlice";
import { ROUTES } from "../constants";

const { Header } = Layout;
const { Text } = Typography;

const MainLayout = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(
            logout({
                first_time_setup: user ? user["first_time_setup"] : false,
            })
        );
        navigate(ROUTES.LOGIN);
    };

    return (
        <>
            <Layout style={{ width: "100vw", height: "100vh" }}>
                <Header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <LogoIcon size={64} />
                    <Flex gap={10}>
                        <Button
                            shape="circle"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        />
                        <Flex gap={5} align="center">
                            <Avatar
                                style={{ backgroundColor: "#87d068" }}
                                icon={<UserOutlined />}
                            />
                            <Text style={{ color: "white" }}>
                                {user ? user.username : ""}
                            </Text>
                        </Flex>
                    </Flex>
                </Header>
                <Outlet />
            </Layout>
        </>
    );
};

export default MainLayout;
