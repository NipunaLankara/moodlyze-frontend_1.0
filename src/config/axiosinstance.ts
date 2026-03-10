import BASE_URL from "./ApiConfig";
import axios, { type AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});


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


API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const token = localStorage.getItem("token");


            if (token) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default API;

