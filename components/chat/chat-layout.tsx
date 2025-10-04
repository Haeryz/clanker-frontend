"use client";

import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";

export function ChatLayout() {
  return (
    <div className="flex h-svh flex-col bg-transparent text-foreground transition-colors">
      <ChatHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MessageList />
        <ChatComposer />
      </div>
    </div>
  );
}
