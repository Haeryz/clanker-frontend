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
      <Sidebar
        collapsible="icon"
        className="border-transparent bg-transparent px-2"
      >
        <SidebarContent className="bg-transparent pb-4 pt-6">
          <div className="glass-panel h-full overflow-hidden rounded-3xl">
            <ChatSidebar />
          </div>
        </SidebarContent>
  <SidebarRail className="bg-transparent" />
      </Sidebar>
      <SidebarInset className="relative bg-transparent px-2 pb-6 pt-2 transition-colors md:px-8">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
