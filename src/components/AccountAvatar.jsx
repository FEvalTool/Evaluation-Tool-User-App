import { Avatar } from "antd";
import { stringToColour } from "../utils/colorGenerator";

export const AccountAvatar = ({ avatarSrc, username, size }) => {
    return avatarSrc ? (
        <Avatar size={size} shape="circle" alt="avatar" src={avatarSrc} />
    ) : (
        <Avatar
            style={{
                backgroundColor: stringToColour(username),
                verticalAlign: "middle",
                fontSize: "120px",
            }}
            gap={30}
            size={size}
        >
            {username}
        </Avatar>
    );
};
