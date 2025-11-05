import request from "./request";

const API_URL = "/auth";

const login = (body) => {
    return request.post(`${API_URL}/login/`, body, {
        withCredentials: true,
    });
};

const genSecurityQAVerificationToken = (body) => {
    return request.post(`${API_URL}/token/qa/`, body);
};

const verifyToken = () => {
    return request.post(
        `${API_URL}/token/verify/`,
        {},
        {
            withCredentials: true,
        }
    );
};

const refreshToken = () => {
    return request.post(
        `${API_URL}/token/refresh/`,
        {},
        {
            withCredentials: true,
        }
    );
};

const authService = {
    login,
    genSecurityQAVerificationToken,
    verifyToken,
    refreshToken,
};

export default authService;
