"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CopyIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconButton } from "@/components/common/icon-button";
import { Toggle } from "@/components/ui/toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types/chat";
import { formatRelativeTime } from "@/lib/utils/date";

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const isAssistant = message.role === "assistant";
  const formattedTime = formatRelativeTime(new Date(message.createdAt));
  const [showReasoning, setShowReasoning] = useState(
    message.status === "thinking"
  );

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 py-6 transition md:gap-4 md:px-6 md:py-8",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant ? (
        <Avatar className="mt-1 size-10 border border-border bg-background/70 text-foreground md:size-11 dark:border-white/10 dark:bg-white/5 dark:text-white">
          <AvatarFallback>
            <SparklesIcon className="size-5" />
          </AvatarFallback>
        </Avatar>
      ) : null}

      <div
        className={cn(
          "max-w-3xl flex-1 space-y-3 rounded-2xl px-4 py-4 text-sm leading-7 transition-all md:px-5",
          isAssistant
            ? "glass-panel border border-transparent text-foreground/90 shadow-none"
            : "ml-auto glass-inline border border-transparent text-primary-foreground bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_35%,transparent)_0%,color-mix(in_srgb,var(--primary)_18%,transparent)_100%)]"
        )}
      >
        {isAssistant && message.reasoning?.length ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground dark:text-white/50">
            <span className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50 dark:bg-emerald-300/40" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500 dark:bg-emerald-300" />
              </span>
              Thinking
            </span>
            <Toggle
              pressed={showReasoning}
              onPressedChange={setShowReasoning}
              className="rounded-full border border-border bg-transparent px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground data-[state=on]:border-emerald-400/60 data-[state=on]:bg-emerald-400/20 data-[state=on]:text-emerald-700 dark:border-white/20 dark:text-white/60 dark:data-[state=on]:bg-emerald-400/20 dark:data-[state=on]:text-emerald-200"
            >
              {showReasoning ? "Hide" : "Show"}
            </Toggle>
          </div>
        ) : null}

        {isAssistant && showReasoning && message.reasoning?.length ? (
          <div className="glass-inline rounded-xl border border-transparent p-3 text-xs text-muted-foreground">
            <ul className="space-y-2">
              {message.reasoning.map((step, index) => (
                <li key={`${message.id}-reason-${index}`} className="flex gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground/70 dark:text-white/50">
                    {index + 1}.
                  </span>
                  <span className="flex-1 leading-5">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <header className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-white/40">
          <span>{isAssistant ? "ChatGPT" : "You"}</span>
          <span className="flex items-center gap-2">
            {isAssistant && message.status === "thinking" ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-200">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 dark:bg-emerald-300/50" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                </span>
                Responding
              </span>
            ) : null}
            <span>{formattedTime}</span>
          </span>
        </header>
        {isAssistant && message.status === "thinking" && message.content.length === 0 ? (
          <div className="space-y-3 text-sm text-muted-foreground dark:text-white/75">
            <Skeleton className="h-4 w-3/4 bg-muted/60 dark:bg-white/10" />
            <Skeleton className="h-4 w-2/3 bg-muted/40 dark:bg-white/8" />
            <Skeleton className="h-4 w-1/2 bg-muted/30 dark:bg-white/6" />
          </div>
        ) : (
          <div className="markdown text-sm leading-7 text-foreground dark:text-white/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}
        {isAssistant && message.status === "thinking" && message.content.length > 0 ? (
          <p className="text-xs italic text-muted-foreground dark:text-white/50">
            Streaming response…
          </p>
        ) : null}
        <footer className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
          {isAssistant ? (
            <>
              <IconButton size="icon" className="size-8 border border-transparent text-foreground/50 dark:text-white/50">
                <ThumbsUpIcon className="size-3.5" />
              </IconButton>
              <IconButton size="icon" className="size-8 border border-transparent text-foreground/50 dark:text-white/50">
                <ThumbsDownIcon className="size-3.5" />
              </IconButton>
            </>
          ) : null}
          <IconButton size="icon" className="size-8 border border-transparent text-foreground/50 dark:text-white/50">
            <CopyIcon className="size-3.5" />
          </IconButton>
        </footer>
      </div>

      {!isAssistant ? (
        <Avatar className="mt-1 size-10 border border-emerald-200 bg-emerald-100 text-emerald-700 md:size-11 dark:border-emerald-500/20 dark:bg-emerald-500/20 dark:text-white">
          <AvatarFallback>
            <UserIcon className="size-5" />
          </AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
