import { useState } from "react";
import { Layout, Menu } from "antd";
import PropTypes from "prop-types";
const { Sider } = Layout;

const MenuContainer = ({ items, handleMenuClick, current }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Sider
            width="25%"
            collapsible={true}
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
            <Menu
                style={{ height: "100%" }}
                mode="inline"
                onClick={handleMenuClick}
                selectedKeys={[current]}
                items={items}
            />
        </Sider>
    );
};

MenuContainer.propTypes = {
    items: PropTypes.arrayOf(
        // Defined most used properties according to
        // Ant Design Menu item structure
        PropTypes.shape({
            key: PropTypes.string,
            label: PropTypes.node.isRequired,
            disabled: PropTypes.bool,
            style: PropTypes.object,
            icon: PropTypes.node,
            children: PropTypes.array, // For nested menu items
            type: PropTypes.oneOf(["group", "divider"]),
        }),
    ).isRequired,
    handleMenuClick: PropTypes.func.isRequired,
    current: PropTypes.string.isRequired,
};

export default MenuContainer;
