"use client";

import { PropsWithChildren } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { ChatSidebar } from "./chat-sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="offcanvas"
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
        <SidebarFloatingTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function SidebarFloatingTrigger() {
  const { state } = useSidebar();

  if (state !== "collapsed") {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-3 top-4 z-20 flex md:left-6 md:top-6">
      <SidebarTrigger className="pointer-events-auto glass-chip h-10 w-10 rounded-2xl text-foreground/70 hover:border-primary/40 hover:text-primary md:h-11 md:w-11" />
    </div>
  );
}
