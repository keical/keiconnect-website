import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, /*SidebarSeparator,*/ useSidebar } from "@/components/ui/sidebar";
import { isActiveSidebarItem, logout } from "@/helpers/utils";
import type { SidebarItem } from "@/types/sidebar";
import { CircleCheckBig, LogOut, ShieldCheck, SlidersVertical, User} from "lucide-react";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useSidebar();
  const { VITE_APP_SITENAME } = import.meta.env;

  const manageItems: SidebarItem[] = [
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: CircleCheckBig,
    },
  ];

  const settingsItems: SidebarItem[] = [
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src="/src/assets/kingston_svg.svg"
                    alt="kingston"
                    className="size-8.5 rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">KEIConnect</span>
                  <span className="">Kingston Educational Institute</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Home</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Dashboard">
                <SidebarMenuButton asChild isActive={isActiveSidebarItem("/dashboard", location.pathname)}>
                  <Link to="/dashboard">
                    <SlidersVertical />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActiveSidebarItem(item.url, location.pathname, item.starts_with ? item.starts_with : false)}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActiveSidebarItem(item.url, location.pathname)}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem key="Log Out">
            <SidebarMenuButton variant="outline" className={open ? 'justify-center' : ''} onClick={() => logout(navigate)}>
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}