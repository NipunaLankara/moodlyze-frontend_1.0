import API from "../../../config/axiosinstance";
import type {
    RegisterRequest,
    LoginRequest,
    OtpVerifyRequest, ForgotPasswordRequest, ResetPasswordRequest,
} from "../types/auth.types";

export const registerUser = (data: RegisterRequest) =>
    API.post("/auth/sign-up", data);

export const verifyOtp = (data: OtpVerifyRequest) =>
    API.post("/auth/verify-otp", data);

export const loginUser = (data: LoginRequest) =>
    API.post("/auth/sign-in", data);

export const forgotPassword = (data: ForgotPasswordRequest) =>
    API.post("/auth/forgot-password", data);

export const resetPassword = (data: ResetPasswordRequest) =>
    API.post("/auth/reset-password", data);


export const toggle2FA = (status: boolean) =>
    API.put(`/auth/2fa/enable-disable/0?status=${status}`);

export const verify2FA = (data: OtpVerifyRequest) =>
    API.post("/auth/verify-2fa", data);