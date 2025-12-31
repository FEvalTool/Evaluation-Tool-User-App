import request from "./request";

const API_URL = "/account";

const getUserSecurityQuestions = (params) => {
    return request.get(`${API_URL}/security_questions`, { params });
};

const getUserSetupStatus = () => {
    return request.get(`${API_URL}/setup_status`, { withCredentials: true });
};

const setPassword = (body) => {
    return request.post(`${API_URL}/password/`, body, {
        withCredentials: true,
    });
};

const setSecurityQA = (body) => {
    return request.post(`${API_URL}/security_questions/`, body, {
        withCredentials: true,
    });
};

const accountService = {
    getUserSecurityQuestions,
    getUserSetupStatus,
    setPassword,
    setSecurityQA
};

export default accountService;
