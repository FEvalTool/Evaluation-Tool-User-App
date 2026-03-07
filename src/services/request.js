import axios from "axios";
import { clearAuth } from "../slices/authSlice";

console.log("LISTEN TO BACKEND:", import.meta.env.VITE_BACKEND_BASE_URL);
const request = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    timeout: 0, // Need to have timeout config depend on environment (development, production)
});

let isRefreshing = false;
let failedQueue = [];

let _dispatch = null;
export const injectDispatch = (dispatch) => {
    _dispatch = dispatch;
};

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(),
    );
    failedQueue = [];
};

request.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest._skipInterceptor) {
            return Promise.reject(error);
        }

        if (error?.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => request(originalRequest))
                    .catch(Promise.reject);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await request.post(
                    `/auth/token/refresh/`,
                    {},
                    { withCredentials: true, _skipInterceptor: true },
                );
                processQueue(null);
                return request(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                // Use injected dispatch
                if (_dispatch) _dispatch(clearAuth());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default request;
