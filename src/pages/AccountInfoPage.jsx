import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Button,
    Divider,
    Flex,
    Descriptions,
    Avatar,
    Upload,
    Skeleton,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

import accountService from "../services/accountService";
import { showMessage } from "../slices/messageSlice";
import { stringToColour } from "../utils/colorGenerator";

const AccountInfoPage = () => {
    const [loading, setLoading] = useState(true);
    const [isUpload, setIsUpload] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [username, setUsername] = useState("N/A");
    const [userInfo, setUserInfo] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const getAccountInfo = async () => {
            try {
                const userResponse = await accountService.getUserInfo();
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

                const avatarResponse = await accountService.getUserAvatar();
                const avatarData = avatarResponse.data.data;
                if (avatarData != null) {
                    setAvatar(avatarData);
                }
            } catch (error) {
                const apiError = error.response?.data;
                dispatch(
                    showMessage({
                        type: "error",
                        message: apiError?.message || "Something went wrong",
                        code: apiError?.code,
                        error: apiError?.error,
                    }),
                );
            } finally {
                setLoading(false);
            }
        };

        getAccountInfo();
    }, [dispatch]);

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
            // Show local preview immediately — this take time to load data
            const localPreview = URL.createObjectURL(file);
            setAvatar(localPreview);
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

        if (file.status === "uploading") {
            setIsUpload(true);
        }

        if (file.status === "done") {
            const avatarData = file.response.data;
            setAvatar(avatarData);
            setIsUpload(false);
            dispatch(
                showMessage({
                    type: "success",
                    message: "Successfully upload avatar",
                }),
            );
        }

        if (file.status === "error") {
            const error = file.error;
            setIsUpload(false);
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

    const handleDeleteAvatar = async () => {
        try {
            setIsDelete(true);
            await accountService.deleteUserAvatar();
            setAvatar(null);
            setIsDelete(false);
        } catch (error) {
            setIsDelete(false);
            const apiError = error.response?.data;
            dispatch(
                showMessage({
                    type: "error",
                    message: apiError?.message || "Something went wrong",
                    code: apiError?.code,
                    error: apiError?.error,
                }),
            );
        }
    };

    return loading ? (
        <Flex vertical={true} align="center" gap="large">
            <Flex vertical={true} align="center" gap="middle">
                <Skeleton.Avatar active={true} size={200} />
                <Flex gap="small">
                    <Skeleton.Button active={true} />
                    <Skeleton.Button active={true} />
                </Flex>
            </Flex>
            <Divider size="small" />
            <Skeleton active={true} title={false} />
        </Flex>
    ) : (
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
                        <Button
                            icon={<UploadOutlined />}
                            disabled={isUpload || isDelete}
                            loading={isUpload}
                        >
                            Upload avatar
                        </Button>
                    </Upload>
                    <Button
                        variant="solid"
                        color="danger"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteAvatar}
                        disabled={isUpload || isDelete}
                        loading={isDelete}
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
