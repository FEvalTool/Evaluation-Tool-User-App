import { useState, useEffect } from "react";
import { Flex, Descriptions, Avatar } from "antd";

import accountService from "../services/accountService";
import { stringToColour } from "../utils/colorGenerator";

const AccountInfoPage = () => {
    const [username, setUsername] = useState("N/A");
    const [userInfo, setUserInfo] = useState([]);
    const [avatar, setAvatar] = useState(null);
    useEffect(() => {
        console.log("AccountInfoPage useEffect");
        const getAccountInfo = async () => {
            try {
                const userResponse = await accountService.getUserInfo();
                const avatarResponse = await accountService.getUserAvatar();

                const userData = userResponse.data.data;
                setUsername(userData.username || "N/A");
                const extractFields = [
                    { key: "username", label: "Username" },
                    { key: "name", label: "Name" },
                    { key: "phone_number", label: "Phone number" },
                    { key: "dob", label: "Birthday" },
                    { key: "identity_number", label: "Identity number" },
                    { key: "global_role", label: "Role" },
                ];
                const result = extractFields.map((field) => ({
                    key: field.key,
                    label: field.label,
                    children: userData[field.key] || "N/A",
                }));
                setUserInfo(result);

                const avatarData = avatarResponse.data.data;
                if (avatarData != null) {
                    setAvatar(avatarData);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getAccountInfo();
    }, []);

    return (
        <Flex vertical={true} align="center" gap="large">
            {!avatar ? (
                <Avatar size={200} shape="circle" alt="avatar" src={avatar} />
            ) : (
                <Avatar
                    style={{
                        backgroundColor: stringToColour(username),
                        verticalAlign: "middle",
                        fontSize: "120px",
                    }}
                    gap={30}
                    size={200}
                >
                    {username}
                </Avatar>
            )}
            <Descriptions title="User Info" items={userInfo} />
        </Flex>
    );
};

export default AccountInfoPage;
