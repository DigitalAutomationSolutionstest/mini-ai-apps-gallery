
import React from "react";
import { Home, Layout, BookOpen, FileText, DollarSign, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";

// Navigation items for the sidebar
const navigationItems = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "Mini Apps Gallery",
    icon: Layout,
    url: "/gallery",
  },
  {
    title: "Generatore PDF",
    icon: FileText,
    url: "/dashboard/pdf",
  },
  {
    title: "Generatore Immagini",
    icon: Layout,
    url: "/dashboard/image",
  },
  {
    title: "Piani di abbonamento",
    icon: DollarSign,
    url: "/#pricing", // ancora verso la sezione prezzi della landing
  },
  {
    title: "Richiedi Preventivo",
    icon: MessageSquare,
    url: "/quote",
  },
  {
    title: "Documentazione",
    icon: BookOpen,
    url: "/docs",
  },
];

export function SidebarNav() {
  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="flex h-14 items-center border-b border-border/40 px-4">
        <SidebarTrigger />
        <span className="ml-2 text-lg font-semibold">Mini AI Hub</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigazione</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

