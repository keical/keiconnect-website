import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
    title: string;
    url: string;
    icon: LucideIcon;
    starts_with?: boolean | null;
}