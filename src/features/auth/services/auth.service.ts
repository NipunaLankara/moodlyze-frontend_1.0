import API from "../../../config/axiosinstance";
import type {
    RegisterRequest,
    LoginRequest,
    OtpVerifyRequest,
} from "../types/auth.types";

export const registerUser = (data: RegisterRequest) =>
    API.post("/auth/sign-up", data);

export const verifyOtp = (data: OtpVerifyRequest) =>
    API.post("/auth/verify-otp", data);

export const loginUser = (data: LoginRequest) =>
    API.post("/auth/sign-in", data);
