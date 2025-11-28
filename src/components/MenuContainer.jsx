import { useState } from "react";
import { ConfigProvider, Layout, Menu } from "antd";
const { Sider } = Layout;

const MenuContainer = ({ collapsible, items, handleMenuClick, current }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        iconSize: 20,
                        itemHeight: 60,
                    },
                },
            }}
        >
            <Sider
                width="25%"
                collapsible={collapsible}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Menu
                    style={{ height: "100%" }}
                    theme="dark"
                    mode="inline"
                    onClick={handleMenuClick}
                    selectedKeys={[current]}
                    items={items}
                />
            </Sider>
        </ConfigProvider>
    );
};

export default MenuContainer;
