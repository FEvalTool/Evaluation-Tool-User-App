import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Divider, Flex, Descriptions, Avatar, Upload } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

import accountService from "../services/accountService";
import { showMessage } from "../slices/messageSlice";
import { stringToColour } from "../utils/colorGenerator";

const AccountInfoPage = () => {
    const [username, setUsername] = useState("N/A");
    const [userInfo, setUserInfo] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

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

    const beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            dispatch(
                showMessage({
                    type: "error",
                    message: "Image must smaller than 2MB",
                }),
            );
        }
        return isLt2M;
    };

    const uploadAvatar = async (options) => {
        const { onSuccess, onError, file } = options;

        const fmData = new FormData();
        fmData.append("image", file);
        try {
            const response = await accountService.uploadUserAvatar(fmData);
            onSuccess(response.data, file);
        } catch (error) {
            const apiError = error.response?.data;
            const wrappedError = new Error(
                apiError?.message || "Something went wrong when upload avatar",
            );

            wrappedError.code = apiError?.code;
            wrappedError.backend = apiError;
            onError(wrappedError);
        }
    };

    const handleUploadChange = (info) => {
        const { file } = info;

        if (file.status === "done") {
            const avatarData = file.response.data;
            setAvatar(avatarData);
            dispatch(
                showMessage({
                    type: "success",
                    message: "Successfully upload avatar",
                }),
            );
        }

        if (file.status === "error") {
            const error = file.error;

            dispatch(
                showMessage({
                    type: "error",
                    message:
                        error?.message ||
                        "Something went wrong when uploading avatar",
                    code: error?.code,
                    error: error?.backend?.error,
                }),
            );
        }
    };

    return (
        <Flex vertical={true} align="center" gap="large">
            <Flex vertical={true} align="center" gap="middle">
                {avatar ? (
                    <Avatar
                        size={200}
                        shape="circle"
                        alt="avatar"
                        src={avatar}
                    />
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
                <Flex gap="small">
                    <Upload
                        accept="image/*"
                        beforeUpload={beforeUpload}
                        customRequest={uploadAvatar}
                        onChange={handleUploadChange}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Upload avatar</Button>
                    </Upload>
                    <Button
                        variant="solid"
                        color="danger"
                        icon={<DeleteOutlined />}
                    >
                        Delete avatar
                    </Button>
                </Flex>
            </Flex>
            <Divider size="small" />
            <Descriptions title="User Info" items={userInfo} />
        </Flex>
    );
};

export default AccountInfoPage;
