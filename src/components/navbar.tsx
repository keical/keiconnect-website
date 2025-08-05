import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsAuthorized } from "@/services/auth-checker";
import { logout, getShortName, getRouteName } from "@/helpers/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { SlidersVertical, LogOut, User } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userData } = useIsAuthorized();
    const { VITE_APP_SITENAME } = import.meta.env;

    if(isAuthenticated && location.pathname.startsWith('/dashboard')) {
        return (
            <nav className="flex justify-between items-center py-3 px-7 sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
                <div className="flex justify-center">
                    <SidebarTrigger />
                    <h1 className="text-lg text-primary font-bold ml-4">{getRouteName(location.pathname)}</h1>
                </div>
                <div className="flex justify-center items-center">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-9 w-9 hover:cursor-pointer ml-5">
                                <AvatarImage className="object-cover" src={userData?.image} alt={getShortName(userData?.name || "")} />
                                <AvatarFallback>{getShortName(userData?.name || "")}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userData?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                    {userData?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:cursor-pointer" asChild>
                                <Link to="/dashboard">
                                    <SlidersVertical className="w-4 h-4 mr-3"/>
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:cursor-pointer" asChild>
                                <Link to="/dashboard/profile">
                                    <User className="w-4 h-4 mr-3"/>
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => logout(navigate)}>
                                <LogOut className="w-4 h-4 mr-3"/>
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        )
    }

    if (isAuthenticated) {
        return (
            <nav className="flex justify-between items-center py-5 px-16">
                <h1 className="text-3xl font-bold">{VITE_APP_SITENAME}</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Button asChild>
                            <Link to="/dashboard" className="">Dashboard</Link>
                        </Button>
                    </li>
                </ul>
            </nav>
        )
    }

    return (
        <nav className="flex justify-between items-center py-5 px-16">
            <h1 className="text-2xl font-bold">{VITE_APP_SITENAME}</h1>
            <ul className="flex space-x-4">
                <li>
                    <Button asChild variant="outline">
                        <Link to="/signup" className="">Signup</Link>
                    </Button>
                </li>
                <li>
                    <Button asChild>
                        <Link to="/login" className="">Login</Link>
                    </Button>
                </li>
            </ul>
        </nav>
    )
}