"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  MoreVerticalIcon,
  NotebookPenIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";

import { IconButton } from "@/components/common/icon-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { useChatStore } from "@/lib/store/use-chat-store";
import { formatRelativeTime } from "@/lib/utils/date";

export function ChatHeader() {
  const conversation = useChatStore((state) => {
    const activeId = state.selectedConversationId;
    return (
      state.conversations.find((item) => item.id === activeId) ?? null
    );
  });
  const updateConversationTitle = useChatStore(
    (state) => state.updateConversationTitle
  );

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(
    conversation?.title ?? "Untitled conversation"
  );

  const lastAssistantMessage = useMemo(() => {
    if (!conversation) return null;

    return [...conversation.messages]
      .reverse()
      .find((message) => message.role === "assistant") ?? null;
  }, [conversation]);

  useEffect(() => {
    setDraftTitle(conversation?.title ?? "Untitled conversation");
    setIsEditing(false);
  }, [conversation?.id, conversation?.title]);

  const handleTitleSubmit = () => {
    if (!conversation) return;

    const trimmed = draftTitle.trim();
    if (!trimmed || trimmed === conversation.title) {
      setDraftTitle(conversation.title);
      setIsEditing(false);
      return;
    }

    updateConversationTitle(conversation.id, trimmed);
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur transition-colors supports-[backdrop-filter]:bg-background/60 md:px-8 dark:border-white/10 dark:bg-[#0D1014]/80 dark:supports-[backdrop-filter]:bg-[#0D1014]/60">
      <div className="flex flex-1 items-center gap-3 md:gap-6">
        <SidebarTrigger className="rounded-xl border border-border bg-background/40 text-foreground/70 hover:bg-background/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10" />
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-100">
              GPT-4.1
            </Badge>
            <Badge
              variant="outline"
              className="hidden rounded-full border-border bg-transparent px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground md:inline-flex dark:border-white/20 dark:text-white/50"
            >
              Synced
            </Badge>
          </div>

          {conversation ? (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                {isEditing ? (
                  <input
                    className="min-w-[220px] rounded-xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground outline-none focus-visible:border-emerald-400/60 dark:border-white/15 dark:bg-white/5 dark:text-white"
                    autoFocus
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleTitleSubmit();
                      }
                      if (event.key === "Escape") {
                        setDraftTitle(conversation.title);
                        setIsEditing(false);
                      }
                    }}
                  />
                ) : (
                  <button
                    className="text-left text-xl font-semibold tracking-tight text-foreground transition hover:text-emerald-600 dark:hover:text-emerald-200"
                    onClick={() => setIsEditing(true)}
                  >
                    {conversation.title}
                  </button>
                )}
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Updated {formatRelativeTime(new Date(conversation.lastActivityAt))}
                </span>
              </div>
              {lastAssistantMessage ? (
                <p className="max-w-2xl text-xs text-muted-foreground line-clamp-1">
                  {lastAssistantMessage.content}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-lg font-semibold tracking-tight text-muted-foreground">
              Start a new conversation
            </p>
          )}
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Button
          variant="ghost"
          className="rounded-xl border border-border bg-background/60 px-4 text-sm font-medium text-foreground/80 transition hover:bg-background/80 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
        >
          <NotebookPenIcon className="mr-2 size-4" />
          Notes
        </Button>
        <IconButton className="rounded-xl border border-border bg-background/60 text-foreground/70 hover:bg-background/80 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10">
          <Share2Icon className="size-4" />
        </IconButton>
        <IconButton className="rounded-xl border border-border bg-background/60 text-foreground/70 hover:bg-background/80 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10">
          <DownloadIcon className="size-4" />
        </IconButton>
        <IconButton className="rounded-xl border border-border bg-background/60 text-foreground/70 hover:bg-background/80 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10">
          <StarIcon className="size-4" />
        </IconButton>
        <IconButton className="rounded-xl border border-border bg-background/60 text-foreground/70 hover:bg-background/80 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10">
          <MoreVerticalIcon className="size-4" />
        </IconButton>
        <div className="mx-1 h-9 w-px bg-white/10" />
        <ModeToggle />
        <Avatar className="size-10 border border-border bg-background/60 text-foreground dark:border-white/10 dark:bg-white/10 dark:text-white">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
