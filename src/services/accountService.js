import request from "./request";

const API_URL = "/account";

const getUserSecurityQuestions = (username) => {
    return request.get(`${API_URL}/security_questions/${username}`);
};

const getUserSetupStatus = () => {
    return request.get(`${API_URL}/setup_status`, { withCredentials: true });
};

const getUserInfo = () => {
    return request.get(`${API_URL}/info`, { withCredentials: true });
};

const getUserAvatar = () => {
    return request.get(`${API_URL}/avatar/get`, { withCredentials: true });
};

const uploadUserAvatar = (formData) => {
    const config = {
        headers: { "content-type": "multipart/form-data" },
        withCredentials: true,
    };
    return request.patch(`${API_URL}/avatar/upload/`, formData, config);
};

const deleteUserAvatar = () => {
    return request.delete(`${API_URL}/avatar/delete/`, {
        withCredentials: true,
    });
};

const setPassword = (body) => {
    return request.post(`${API_URL}/password/`, body, {
        withCredentials: true,
    });
};

const setSecurityQA = (body) => {
    return request.post(`${API_URL}/security_qa/`, body, {
        withCredentials: true,
    });
};

const accountService = {
    getUserSecurityQuestions,
    getUserSetupStatus,
    getUserInfo,
    getUserAvatar,
    uploadUserAvatar,
    deleteUserAvatar,
    setPassword,
    setSecurityQA,
};

export default accountService;
