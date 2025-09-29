import axios from "axios";

console.log("LISTEN TO BACKEND:", import.meta.env.VITE_BACKEND_BASE_URL);
const request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  timeout: 10000,
})

export default request;