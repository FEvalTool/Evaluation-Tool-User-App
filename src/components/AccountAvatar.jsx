import PropTypes from "prop-types";
import { Avatar } from "antd";
import { stringToColour } from "../utils/colorGenerator";

export const AccountAvatar = ({ avatarSrc, username, size, gap }) => {
    return avatarSrc ? (
        <Avatar size={size} shape="circle" alt="avatar" src={avatarSrc} />
    ) : (
        <Avatar
            style={{
                backgroundColor: stringToColour(username),
                verticalAlign: "middle",
                fontSize: "120px",
            }}
            gap={gap}
            size={size}
        >
            {username}
        </Avatar>
    );
};

AccountAvatar.propTypes = {
    avatarSrc: PropTypes.string,
    username: PropTypes.string,
    size: PropTypes.number,
    gap: PropTypes.number,
};

AccountAvatar.defaultProps = {
    avatarSrc: null,
    username: "N/A",
    size: 32,
    gap: 4,
};
