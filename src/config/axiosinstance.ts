import BASE_URL from "./ApiConfig";
import axios, { type AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

/**
 * Request interceptor
 * Automatically attaches JWT token
 */
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor
 */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const token = localStorage.getItem("token");

            // Only redirect if user was already logged in
            if (token) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default API;

