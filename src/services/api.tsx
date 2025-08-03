import axios from "@/services/axios";
import type { ChangeEmailResponse, ChangePasswordResponse, ForgotPasswordResponse, GetUserResponse, LoginHistoryResponse, RemoveImageResponse, ResendVerificationResponse, UpdateProfileResponse, UserLoginResponse, UserLogoutResponse, UserSignupResponse } from "@/types/api/user";

// User API

export const signup = async (name: string, email: string, password: string, gRecaptchaResponse: string) => {
    return await axios.post<UserSignupResponse>("/user/signup", { name, email, password, gRecaptchaResponse});
};

export const resendVerification = async (email: string, gRecaptchaResponse: string) => {
    return await axios.post<ResendVerificationResponse>("/user/resend-verification", { email, gRecaptchaResponse });
}

export const forgotPassword = async (email: string, gRecaptchaResponse: string) => {
    return await axios.post<ForgotPasswordResponse>("/user/forgot-password", { email, gRecaptchaResponse });
}

export const login = async (email: string, password: string, gRecaptchaResponse: string) => {
    return await axios.post<UserLoginResponse>("/user/login", { email, password, gRecaptchaResponse});
};

export const logout = async (refreshToken: string) => {
    return await axios.delete<UserLogoutResponse>("/user/logout", { data: { refreshToken } });
}

export const getUser = async (accessToken: string) => {
    return await axios.get<GetUserResponse>("/user/details", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export const updateProfile = async (accessToken: string, name: string, image?: File | null) => {
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
        formData.append("image", image);
    }
    return await axios.put<UpdateProfileResponse>("/user/update-profile", formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export const removeImage = async (accessToken: string) => {
    return await axios.delete<RemoveImageResponse>("/user/remove-profile-image", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export const changePassword = async (accessToken: string, currentPassword: string, newPassword: string) => {
    return await axios.put<ChangePasswordResponse>("/user/change-password", { currentPassword, newPassword }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export const changeEmail = async (accessToken: string, password: string, newEmail: string) => {
    return await axios.put<ChangeEmailResponse>("/user/change-email", { password, newEmail }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export const getLoginHistory = async (accessToken: string) => {
    return await axios.get<LoginHistoryResponse>("/user/login-history", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}