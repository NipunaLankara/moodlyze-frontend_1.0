import API from "../../../config/axiosinstance";
import type {
    UserProfileUpdateRequest,
    EmailChangeOtpRequest
} from "../types/user.types.ts";

/**
 * Fetch logged-in user profile
 * X-User-Id comes from API Gateway (JWT)
 */
export const getUserProfile = () =>
    API.get("/user/get-user-by-id");

/**
 * Update profile (email change triggers OTP backend-side)
 */
export const updateUserProfile = (data: UserProfileUpdateRequest) =>
    API.put("/user/update-profile", data);

/**
 * Verify email change OTP
 */
export const verifyEmailChangeOtp = (data: EmailChangeOtpRequest) =>
    API.post("/auth/email-change/verify", data);
