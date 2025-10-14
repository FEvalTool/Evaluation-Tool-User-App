import request from "./request";

const API_URL = "/auth";

export const login = (body) => {
	return request.post(`${API_URL}/login/`, body);
};

export const genSecurityQAVerificationToken = (body) => {
	return request.post(`${API_URL}/token/qa/`, body)
}