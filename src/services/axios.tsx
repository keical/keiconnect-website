import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api/axios";

const { VITE_APP_API_URL } = import.meta.env;

const API = axios.create({
    baseURL: VITE_APP_API_URL,
});

export function isAxiosError(error: any): error is AxiosError<ApiErrorResponse> {
    return error != null && error.response !== undefined;
}

export default API;