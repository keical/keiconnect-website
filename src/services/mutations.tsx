import type { ChangeEmailRequest, ChangePasswordRequest, ForgotPasswordRequest, ResendVerificationRequest, UpdateProfileRequest, UserLoginRequest, UserSignupRequest } from "@/types/api/user";
import { useMutation } from "@tanstack/react-query";
import { changeEmail, changePassword, forgotPassword, login, logout, removeImage, resendVerification, signup, updateProfile } from "@/services/api";
import { getFromLocalStorage } from "@/services/localstorage";

// User API

export function useSignup() {
    return useMutation({
        mutationFn: (data: UserSignupRequest) => signup(data.name, data.email, data.password, data.gRecaptchaResponse),
    });
}

export function useResendVerification() {
    return useMutation({
        mutationFn: (data: ResendVerificationRequest) => resendVerification(data.email, data.gRecaptchaResponse),
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data.email, data.gRecaptchaResponse),
    });
}

export function useLogin() {
    return useMutation({
        mutationFn: (data: UserLoginRequest) => login(data.email, data.password, data.gRecaptchaResponse),
    });
}

export function useLogout() {
    return useMutation({
        mutationFn: () => {
            const refreshToken = getFromLocalStorage('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token found');
            }
            return logout(refreshToken);
        },
    });
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => {
            const accessToken = getFromLocalStorage('accessToken');
            if (!accessToken) {
                throw new Error('Unauthorized');
            }
            return updateProfile(accessToken, data.name, data.image);
        },
    });
}

export function useRemoveImage() {
    return useMutation({
        mutationFn: () => {
            const accessToken = getFromLocalStorage('accessToken');
            if (!accessToken) {
                throw new Error('Unauthorized');
            }
            return removeImage(accessToken);
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => {
            const accessToken = getFromLocalStorage('accessToken');
            if (!accessToken) {
                throw new Error('Unauthorized');
            }
            return changePassword(accessToken, data.currentPassword, data.newPassword);
        },
    });
}

export function useChangeEmail() {
    return useMutation({
        mutationFn: (data: ChangeEmailRequest) => {
            const accessToken = getFromLocalStorage('accessToken');
            if (!accessToken) {
                throw new Error('Unauthorized');
            }
            return changeEmail(accessToken, data.password, data.newEmail);
        },
    });
}