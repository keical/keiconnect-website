import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, /*SidebarSeparator,*/ useSidebar } from "@/components/ui/sidebar";
import { isActiveSidebarItem, logout } from "@/helpers/utils";
import type { SidebarItem } from "@/types/sidebar";
import { CircleCheckBig, LogOut, ShieldCheck, SlidersVertical, User } from "lucide-react";
 
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
        <span className="text-center text-xl font-bold my-2">{open ? VITE_APP_SITENAME : VITE_APP_SITENAME?.substring(0, 1)}</span>
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