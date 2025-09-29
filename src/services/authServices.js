import request from "./request";

const API_URL = "/auth/login/";

export const login = (body) => {
	return request.post(`${API_URL}`, body, { withCredentials: true });
};