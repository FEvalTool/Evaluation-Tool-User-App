import axios from "axios";

console.log("LISTEN TO BACKEND:", import.meta.env.VITE_BACKEND_BASE_URL);
const request = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    timeout: 0, // Need to have timeout config depend on environment (development, production)
});

export default request;
