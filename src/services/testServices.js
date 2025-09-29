import request from "./request";

const API_URL = '/health/check';

export const testAPI = () => {
    return request.get(API_URL);
}