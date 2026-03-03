export interface UserProfileRequest {
    name: string;
    email: string;
    address: string;
    contactNumber: string;
}

export interface UserProfileUpdateRequest {
    name: string;
    email: string;
    address: string;
    contactNumber: string;
}

export interface EmailChangeOtpRequest {
    email: string;
    otp: string;
}
