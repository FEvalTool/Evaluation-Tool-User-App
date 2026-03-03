import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Flex, Descriptions, Upload, Skeleton } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

import accountService from "../services/accountService";
import { showMessage } from "../slices/messageSlice";
import { uploadAvatar, deleteAvatar } from "../slices/avatarSlice";
import { AccountAvatar } from "../components/AccountAvatar";

const AccountInfoPage = () => {
    const { url: avatarUrl } = useSelector((state) => state.avatar);
    const [loading, setLoading] = useState(true);
    const [isUpload, setIsUpload] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [username, setUsername] = useState("N/A");
    const [userInfo, setUserInfo] = useState([]);
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
            } catch (error) {
                const apiError = error.response?.data;
                dispatch(
                    showMessage({
                        type: "error",
                        message:
                            apiError?.message ||
                            "Something went wrong when fetching user info",
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

    const uploadAvatarRequest = async (options) => {
        const { onSuccess, onError, file } = options;

        try {
            const result = await dispatch(uploadAvatar(file)).unwrap();
            onSuccess(result, file);
        } catch (error) {
            onError(error);
        }
    };

    const handleUploadChange = (info) => {
        const { file } = info;

        if (file.status === "uploading") {
            setIsUpload(true);
        }

        if (file.status === "done") {
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
                    message: error.message,
                    code: error.code,
                    error: error.backend?.error,
                }),
            );
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            setIsDelete(true);
            await dispatch(deleteAvatar()).unwrap();
            dispatch(
                showMessage({
                    type: "success",
                    message: "Successfully delete avatar",
                }),
            );
            setIsDelete(false);
        } catch (error) {
            setIsDelete(false);
            dispatch(
                showMessage({
                    type: "error",
                    message: error.message,
                    code: error.code,
                    error: error.backend?.error,
                }),
            );
        }
    };

    return loading ? (
        <Flex
            vertical={true}
            align="center"
            gap="large"
            style={{ width: "100%" }}
        >
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
                <AccountAvatar
                    avatarSrc={avatarUrl}
                    username={username}
                    size={200}
                    gap={30}
                />
                <Flex gap="small">
                    <Upload
                        accept="image/*"
                        beforeUpload={beforeUpload}
                        customRequest={uploadAvatarRequest}
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
