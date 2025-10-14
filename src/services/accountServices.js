import request from "./request";

const API_URL = "/account";

export const getUserSecurityQuestions = (params) => {
    return request.get(`${API_URL}/security_questions`, { params });
};

export const setPassword = (body) => {
    return request.post(`${API_URL}/password/`, body);
};
