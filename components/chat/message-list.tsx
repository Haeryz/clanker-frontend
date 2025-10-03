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

  if (!conversation) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100 to-white transition-colors dark:from-[#070709] dark:via-[#0a0c10] dark:to-[#0b0d12]">
        <div className="rounded-3xl border border-border bg-white px-10 py-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground dark:text-white">
            How can I help you today?
          </h1>
          <p className="mt-3 max-w-md text-balance text-sm text-muted-foreground">
            Start a new chat or pick up where you left off. ChatGPT can help you ideate, plan and build at record speed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-gradient-to-b from-white via-slate-100 to-slate-100 transition-colors dark:from-[#070709] dark:via-[#0b0d11] dark:to-[#0d1016]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/10 to-transparent dark:from-black/60" />
      <ScrollArea className="h-full">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-28 pt-24 md:gap-8 md:px-6 md:pb-32 md:pt-28">
          <ConversationIntro />
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
      <Separator className="flex-1 bg-border dark:bg-white/5" />
      <span>{label}</span>
      <Separator className="flex-1 bg-border dark:bg-white/5" />
    </div>
  );
}

function ConversationIntro() {
  return (
    <div className="mx-4 mb-10 space-y-4 rounded-3xl border border-border bg-white/90 p-5 text-foreground shadow-[0_30px_120px_rgba(10,10,14,0.12)] backdrop-blur md:mx-6 md:mb-12 md:p-6 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[0_40px_120px_rgba(10,10,14,0.45)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600/80 dark:text-emerald-300/70">
            Conversation context
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Working with your AI copilot
          </h2>
        </div>
        <span className="inline-flex w-fit items-center justify-center rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
          Live
        </span>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground dark:text-white/65">
        This conversation syncs across devices. Smart reminders, references and inline search keep everything at your fingertips while ChatGPT drafts, critiques, and iterates alongside you.
      </p>
    </div>
  );
}

