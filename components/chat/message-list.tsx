"use client";

import { useEffect, useMemo, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChatStore } from "@/lib/store/use-chat-store";
import type { ChatMessage } from "@/lib/types/chat";

import { MessageItem } from "./message-item";

export function MessageList() {
  const conversation = useChatStore((state) => {
    const activeId = state.selectedConversationId;
    return (
      state.conversations.find((item) => item.id === activeId) ?? null
    );
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const lastMessage = conversation?.messages.at(-1) ?? null;

  useEffect(() => {
    if (!bottomRef.current || !conversation) return;
    bottomRef.current.scrollIntoView({
      behavior: lastMessage ? "smooth" : "auto",
      block: "end",
    });
  }, [conversation, lastMessage]);

  const timeline = useMemo(() => {
    if (!conversation) {
      return [] as Array<{ type: "message"; payload: ChatMessage } | { type: "separator"; label: string }>;
    }

    const ordered = [...conversation.messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const items: Array<
      { type: "message"; payload: ChatMessage } | { type: "separator"; label: string }
    > = [];

    let lastLabel: string | null = null;

    for (const message of ordered) {
      const currentLabel = formatDayLabel(new Date(message.createdAt));

      if (currentLabel !== lastLabel) {
        items.push({ type: "separator", label: currentLabel });
        lastLabel = currentLabel;
      }

      items.push({ type: "message", payload: message });
    }

    return items;
  }, [conversation]);

  if (!conversation || conversation.messages.length === 0) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_18%_28%,color-mix(in_srgb,var(--primary)_24%,transparent)_0%,transparent_58%),radial-gradient(circle_at_80%_12%,color-mix(in_srgb,var(--accent)_24%,transparent)_0%,transparent_55%),linear-gradient(160deg,color-mix(in_srgb,var(--background)_96%,transparent)_0%,color-mix(in_srgb,var(--background)_82%,transparent)_100%)]" />
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-75 [background:radial-gradient(circle_at_15%_35%,color-mix(in_srgb,var(--primary)_30%,transparent)_0%,transparent_58%),radial-gradient(circle_at_85%_10%,color-mix(in_srgb,var(--accent)_28%,transparent)_0%,transparent_60%),linear-gradient(140deg,color-mix(in_srgb,var(--background)_92%,transparent)_0%,color-mix(in_srgb,var(--background)_75%,transparent)_100%)]" />
      <ScrollArea className="h-full">
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-28 pt-28 md:gap-8 md:px-6 md:pb-32 md:pt-32">
          {timeline.map((entry, index) => {
            if (entry.type === "separator") {
              return <DayDivider key={`${entry.label}-${index}`} label={entry.label} />;
            }

            return <MessageItem key={entry.payload.id} message={entry.payload} />;
          })}
          <div ref={bottomRef} className="h-px w-full" />
        </div>
      </ScrollArea>
    </div>
  );
}

function formatDayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 text-[11px] uppercase tracking-[0.3em] text-muted-foreground md:gap-4 md:px-6">
      <Separator className="flex-1 bg-border" />
      <span>{label}</span>
      <Separator className="flex-1 bg-border" />
    </div>
  );
}

