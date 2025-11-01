import request from "./request";

const API_URL = "/account";

export const getUserSecurityQuestions = (params) => {
    return request.get(`${API_URL}/security_questions`, { params });
};

export const setPassword = (body, token) => {
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return request.post(`${API_URL}/password/`, body, {
        withCredentials: true,
        headers,
    });
};
