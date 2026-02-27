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
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;

// import BASE_URL from "./ApiConfig";
// import axios, {type AxiosInstance} from "axios";
//
// const API: AxiosInstance = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });
//
// /**
//  * Request interceptor
//  * Automatically attaches JWT token
//  */
// API.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// /**
//  * Response interceptor (optional but recommended)
//  */
// API.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expired / invalid
//             localStorage.removeItem("token");
//             localStorage.removeItem("email");
//             localStorage.removeItem("role");
//
//             // Optional: redirect to login
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// );
//
// export default API;
