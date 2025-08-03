import { removeFromLocalStorage } from "@/services/localstorage";
import type { SidebarItem } from "@/types/sidebar";
import type { NavigateFunction } from "react-router-dom";
import { AllSidebarItems } from "@/lib/sidebar-items";

export function logout(navigate: NavigateFunction): void {
  removeFromLocalStorage('accessToken');
  removeFromLocalStorage('refreshToken');
  navigate('/login');
}

export function isActiveSidebarItem(path: string, location: string, starts_with: boolean = false): boolean {
  if (starts_with) {
    return location.startsWith(path) ? true : false;
  }
  return path === location ? true : false;
}

export function getRouteName(location: string, routes: SidebarItem[] = AllSidebarItems): string {
  const route = routes.find(route => route.url === location);
  if (route) return route.title;
  const parts = location.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart ? lastPart.toUpperCase() : 'Dashboard';
}

export function getShortName(str: string): string {
  return str.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}

export function formatTimestamp(timestamp: string, show_timezone: boolean = false): string {
  const date = new Date(timestamp);
  const day = date.toDateString();
  const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  const timezone = Intl.DateTimeFormat('en', { timeZoneName: 'short' }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value;
  return show_timezone ? `${day} ${time} (${timezone})` : `${day} ${time}`;
}