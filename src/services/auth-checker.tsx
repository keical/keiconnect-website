import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/services/localstorage";
import { useGetUser } from "@/services/queries";
import type { User } from "@/types/api/user";

const defaultUser: User = {
    name: '',
    email: '',
    image: '',
};

export const useIsAuthorized = () => {
    const [authState, setAuthState] = useState<{
        isAuthenticating: boolean,
        isAuthenticated: boolean,
        userData?: User,
    }>({
        isAuthenticating: true,
        isAuthenticated: false,
        userData: defaultUser,
    });

    const accessToken = getFromLocalStorage('accessToken');
    const { data, isError, isSuccess } = useGetUser(accessToken || '');

    useEffect(() => {
        if (!accessToken) {
            setAuthState({ isAuthenticating: false, isAuthenticated: false });
        } else if (isError) {
            setAuthState({ isAuthenticating: false, isAuthenticated: false });
        } else if (isSuccess) {
            setAuthState({ isAuthenticating: false, isAuthenticated: true, userData: data.data.data });
        }
    }, [data, isError, isSuccess, accessToken]);

    return authState;
}
