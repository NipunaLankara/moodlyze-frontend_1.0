import BASE_URL from "./ApiConfig.ts";
import axios, {type AxiosInstance} from "axios";

const instance:AxiosInstance = axios.create({
    baseURL:BASE_URL
});



export default instance;
