import React from "react";
import { ThemeProvider } from "@/helpers/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={100}>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}
