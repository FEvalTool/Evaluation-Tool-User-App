import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Flex, Layout, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { AppLogo } from "../components/CustomIcon";
import { AccountAvatar } from "../components/AccountAvatar";
import { logout } from "../slices/authSlice";
import { fetchAvatar } from "../slices/avatarSlice";

const { Header } = Layout;
const { Text, Title } = Typography;

const MainLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const { url: avatarUrl } = useSelector((state) => state.avatar);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!avatarUrl) {
            dispatch(fetchAvatar());
        }
    });

    const handleLogout = async () => {
        const payload = {
            first_time_setup: user ? user["first_time_setup"] : false,
        };
        const resultAction = await dispatch(logout(payload)); // NOSONAR
        if (logout.fulfilled.match(resultAction)) {
            globalThis.location.reload();
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
                    <AppLogo fill="#7C3AED" size={45} />
                    <Title level={4} style={{ margin: 0 }}>
                        User Management System
                    </Title>
                </Flex>
                <Flex gap={10}>
                    <Button
                        shape="circle"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        aria-label="logout"
                    />
                    <Flex gap={5} align="center">
                        <AccountAvatar
                            avatarSrc={avatarUrl}
                            username={user.username}
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
