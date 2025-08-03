export interface User {
    name: string;
    email: string;
    image: string;
}

export interface UserSignupRequest {
    name: string;
    email: string;
    password: string;
    gRecaptchaResponse: string;
}

export interface UserSignupResponse {
    message: string;
}

export interface ResendVerificationRequest {
    email: string;
    gRecaptchaResponse: string;
}

export interface ResendVerificationResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
    gRecaptchaResponse: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
    gRecaptchaResponse: string;
}

export interface UserLoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}

export interface UserLogoutRequest {
    refreshToken: string;
}

export interface UserLogoutResponse {
    message: string;
}

export interface GetUserResponse {
    message: string;
    data: User;
}

export interface UpdateProfileRequest {
    name: string;
    image?: File | null;
}

export interface UpdateProfileResponse {
    message: string;
}

export interface RemoveImageResponse {
    message: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}

export interface ChangeEmailRequest {
    password: string;
    newEmail: string;
}

export interface ChangeEmailResponse {
    message: string;
}

export interface LoginHistoryResponse {
    message: string;
    data: Array<{
        id: number;
        ip: string;
        platform: string;
        browser: string;
        timestamp: string;
    }> | null;
}