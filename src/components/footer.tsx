import { useIsAuthorized } from "@/services/auth-checker";
import { useLocation } from "react-router-dom";

export default function Footer() {
    const location = useLocation();
    const { isAuthenticated } = useIsAuthorized();
    const { VITE_APP_SITENAME } = import.meta.env;

    if(isAuthenticated && location.pathname.startsWith('/dashboard')) {
      return (
        <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 px-7 bg-sidebar border-t border-border">
          <div className="">
            <p className="text-muted-foreground text-sm">
              {VITE_APP_SITENAME} &copy; {new Date().getFullYear()} - All Rights Reserved
            </p>
          </div>
          <div className="">
            <p className="text-muted-foreground text-sm">
              Proudly made with &hearts; in India
            </p>
          </div>
        </footer>
      );
    }

    return (
        <footer className="flex justify-center items-center p-4">
            <p className="text-gray-500 text-sm">
                {VITE_APP_SITENAME} &copy; {new Date().getFullYear()} - All Rights Reserved
            </p>
        </footer>
    );
}