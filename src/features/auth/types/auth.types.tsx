export interface RegisterRequest {
    name: string;
    email: string;
    address: string;
    contactNumber: string;
    password: string;
    userRole: string;
}

export interface OtpVerifyRequest {
    email: string;
    otp: string;
}

export interface LoginRequest {
    userEmail: string;
    password: string;
}
