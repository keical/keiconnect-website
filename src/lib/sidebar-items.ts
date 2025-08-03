import type { SidebarItem } from "@/types/sidebar";
import { SlidersVertical, ShieldCheck, User, CircleCheckBig } from "lucide-react";

export const AllSidebarItems: SidebarItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: SlidersVertical,
    },
    {
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: CircleCheckBig,
    },
    {
        title: "Security",
        url: "/dashboard/security",
        icon: ShieldCheck,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
    },
];