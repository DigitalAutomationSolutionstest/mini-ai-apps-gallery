
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isLandingPage = window.location.pathname === '/';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-background via-background to-accent/5">
        {isLandingPage ? <Navbar /> : <Topbar />}
        <div className="flex flex-1">
          {!isLandingPage && <SidebarNav />}
          <main className={cn(
            "flex-1",
            !isLandingPage && "p-4",
            isLandingPage && "scroll-smooth snap-y snap-mandatory"
          )}>
            {!isLandingPage ? (
              <div className="glass-panel min-h-full p-6 rounded-xl">
                {children}
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
