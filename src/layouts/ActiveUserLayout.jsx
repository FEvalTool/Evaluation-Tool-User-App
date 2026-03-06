import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Flex, Layout } from "antd";
import { UserOutlined, QuestionOutlined } from "@ant-design/icons";

import MenuContainer from "../components/MenuContainer";
import { ROUTES } from "../constants";

const { Content } = Layout;

const ActiveUserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: ROUTES.ACCOUNT_INFO,
            icon: <UserOutlined />,
            label: <>User info</>,
        },
        {
            key: ROUTES.TEST_MAIN,
            icon: <QuestionOutlined />,
            label: <>Test</>,
        },
    ];

    const handleMenuClick = (e) => {
        navigate(e.key);
    };

    return (
        <Layout style={{ width: "100vw", height: "100vh" }}>
            <MenuContainer
                collapsible={true}
                items={menuItems}
                handleMenuClick={handleMenuClick}
                current={location.pathname}
            />
            <Layout>
                <Content>
                    <Flex style={{ padding: "20px" }}>
                        <Outlet />
                    </Flex>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ActiveUserLayout;
