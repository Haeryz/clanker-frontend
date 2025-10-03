"use client";

import { PropsWithChildren } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

import { ChatSidebar } from "./chat-sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
        <SidebarContent className="bg-sidebar">
          <ChatSidebar />
        </SidebarContent>
        <SidebarRail className="bg-transparent" />
      </Sidebar>
      <SidebarInset className="bg-background transition-colors">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
