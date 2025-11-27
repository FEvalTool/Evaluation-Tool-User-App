import request from "./request";

const API_URL = "/account";

const getUserSecurityQuestions = (params) => {
    return request.get(`${API_URL}/security_questions`, { params });
};

const setPassword = (body) => {
    return request.post(`${API_URL}/password/`, body, {
        withCredentials: true,
    });
};

const accountService = {
    getUserSecurityQuestions,
    setPassword,
};

export default accountService;
