import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useIsAuthorized } from "@/services/auth-checker";
import { Loader2 } from "lucide-react";
import { Head } from "@unhead/react";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated, userData } = useIsAuthorized();
    const { VITE_APP_SITENAME } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    if (isAuthenticating) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-16">
                <Loader2 className="h-10 w-10 animate-spin"/>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen p-7">
            <Head>
                <title>Dashboard - {VITE_APP_SITENAME}</title>
            </Head>
            <h1 className="text-3xl font-bold mb-2">Hi, {userData?.name}</h1>
            <p className="text-sm font-semibold">Welcome to {VITE_APP_SITENAME} Dashboard</p>
        </main>
    );
}