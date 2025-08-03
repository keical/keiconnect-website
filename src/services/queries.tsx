import { useQuery } from "@tanstack/react-query";
import { getLoginHistory, getUser } from "@/services/api";

// User API

export function useGetUser(token: string) {
    return useQuery({
        queryKey: ['user', token],
        queryFn: () => getUser(token),
        retry: 1
    });
}

export function useGetLoginHistory(token: string) {
    return useQuery({
        queryKey: ['login-history', token],
        queryFn: () => getLoginHistory(token),
        retry: 1
    });
}