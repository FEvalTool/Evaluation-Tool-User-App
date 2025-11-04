import request from "./request";

const API_URL = "/auth";

export const login = (body) => {
    return request.post(`${API_URL}/login/`, body, {
        withCredentials: true,
    });
};

export const genSecurityQAVerificationToken = (body) => {
    return request.post(`${API_URL}/token/qa/`, body);
};

export const verifyToken = () => {
    return request.post(
        `${API_URL}/token/verify/`,
        {},
        {
            withCredentials: true,
        }
    );
};

export const refreshToken = () => {
    return request.post(
        `${API_URL}/token/refresh/`,
        {},
        {
            withCredentials: true,
        }
    );
};

const authServices = {
    login,
};

export default authServices;
