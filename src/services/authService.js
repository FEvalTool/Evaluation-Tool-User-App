import request from "./request";

const API_URL = "/auth";

const login = (body) => {
    return request.post(`${API_URL}/login/`, body, {
        withCredentials: true,
    });
};

const genSecurityQAVerificationToken = (body) => {
    return request.post(`${API_URL}/token/qa/`, body, {
        withCredentials: true,
    });
};

const verifyToken = (tokenType) => {
    return request.post(
        `${API_URL}/token/verify/`,
        { token_type: tokenType },
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

const deleteScopeToken = () => {
    return request.post(
        `${API_URL}/token/scope/delete/`,
        {},
        {
            withCredentials: true,
        }
    );
};

const deleteScopeTokenBeacon = () => {
    const url = `${
        import.meta.env.VITE_BACKEND_BASE_URL
    }${API_URL}/token/scope/delete/`;
    navigator.sendBeacon(url);
};

const logout = () => {
    return request.post(
        `${API_URL}/logout/`,
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
    deleteScopeToken,
    deleteScopeTokenBeacon,
    logout,
};

export default authService;
