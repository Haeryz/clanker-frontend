"use client";

import { useMemo } from "react";
import {
  CompassIcon,
  HistoryIcon,
  KeyboardIcon,
  MessageSquareIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  SettingsIcon,
  SparklesIcon,
  Wand2Icon,
  SearchIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { formatRelativeTime, getConversationSectionLabel } from "@/lib/utils/date";
import { useChatStore } from "@/lib/store/use-chat-store";
import type { Conversation } from "@/lib/types/chat";

type ConversationSection = {
  label: string;
  conversations: Conversation[];
};

export function ChatSidebar() {
  const conversations = useChatStore((state) => state.conversations);
  const startNewConversation = useChatStore(
    (state) => state.startNewConversation
  );
  const selectConversation = useChatStore((state) => state.selectConversation);
  const selectedConversationId = useChatStore(
    (state) => state.selectedConversationId
  );
  const searchTerm = useChatStore((state) => state.searchTerm);
  const updateSearchTerm = useChatStore((state) => state.updateSearchTerm);
  const togglePin = useChatStore((state) => state.togglePin);

  const { pinned, sections } = useMemo(() => {
    const sorted = [...conversations].sort((a, b) =>
      new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    );

    const filtered = searchTerm
      ? sorted.filter((conversation) =>
          [conversation.title, conversation.preview].some((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : sorted;

    const pinnedConversations = filtered.filter((conversation) => conversation.pinned);
    const remaining = filtered.filter((conversation) => !conversation.pinned);

    const groups = new Map<string, Conversation[]>();

    for (const conversation of remaining) {
      const label = getConversationSectionLabel(
        new Date(conversation.lastActivityAt)
      );
      const bucket = groups.get(label) ?? [];
      bucket.push(conversation);
      groups.set(label, bucket);
    }

    const preferredOrder = [
      "Today",
      "Yesterday",
      "Previous 7 Days",
      "Previous 30 Days",
    ];

    const orderedSections: ConversationSection[] = [];

    for (const label of preferredOrder) {
      if (groups.has(label)) {
        orderedSections.push({ label, conversations: groups.get(label)! });
        groups.delete(label);
      }
    }

    const remainingEntries = Array.from(groups.entries()).sort((a, b) =>
      new Date(b[1][0].lastActivityAt).getTime() -
      new Date(a[1][0].lastActivityAt).getTime()
    );

    for (const [label, items] of remainingEntries) {
      orderedSections.push({ label, conversations: items });
    }

    return {
      pinned: pinnedConversations,
      sections: orderedSections,
    };
  }, [conversations, searchTerm]);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground/90 transition-colors">
      <SidebarHeader className="gap-4 px-3 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-sidebar-foreground">
            <SparklesIcon className="size-5 text-emerald-400" />
            <span>ChatGPT</span>
          </div>
          <Badge
            variant="outline"
            className="border-sidebar-border bg-sidebar/80 text-[10px] font-normal uppercase tracking-widest text-sidebar-foreground/60"
          >
            Beta
          </Badge>
        </div>
        <Button
          size="lg"
          className="h-11 w-full justify-start gap-2 rounded-xl border border-sidebar-border bg-sidebar-primary/10 text-left text-sidebar-foreground transition hover:bg-sidebar-primary/20"
          onClick={startNewConversation}
        >
          <PlusIcon className="size-4" />
          <span>New chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-hidden">
        <div className="px-3 pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-sidebar-foreground/50" />
            <SidebarInput
              value={searchTerm}
              onChange={(event) => updateSearchTerm(event.target.value)}
              placeholder="Search conversations"
              className="h-10 rounded-xl border-sidebar-border bg-sidebar/80 pl-9 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4 px-1 pb-6">
            {pinned.length > 0 ? (
              <SidebarGroup className="px-1">
                <SidebarGroupLabel className="px-3 text-xs uppercase tracking-wide text-sidebar-foreground/50">
                  Pinned
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1.5">
                    {pinned.map((conversation) => (
                      <ConversationButton
                        key={conversation.id}
                        conversation={conversation}
                        isActive={selectedConversationId === conversation.id}
                        onSelect={selectConversation}
                        onTogglePin={togglePin}
                        showPin
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : null}

            {pinned.length > 0 && sections.length > 0 ? (
              <SidebarSeparator className="bg-sidebar-border/70" />
            ) : null}

            <SidebarGroup className="flex-1 px-1">
              <SidebarGroupLabel className="px-3 text-xs uppercase tracking-wide text-sidebar-foreground/50">
                Recents
              </SidebarGroupLabel>
              <SidebarGroupContent className="pb-4">
                <SidebarMenu className="gap-2">
                  {sections.length === 0 && pinned.length === 0 ? (
                    <SidebarMenuItem>
                      <div className="text-xs text-sidebar-foreground/55">
                        No conversations yet. Start a new chat to see it here.
                      </div>
                    </SidebarMenuItem>
                  ) : (
                    sections.map((section) => (
                      <div key={section.label} className="space-y-2">
                        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/45">
                          {section.label}
                        </p>
                        {section.conversations.map((conversation) => (
                          <ConversationButton
                            key={conversation.id}
                            conversation={conversation}
                            isActive={selectedConversationId === conversation.id}
                            onSelect={selectConversation}
                            onTogglePin={togglePin}
                          />
                        ))}
                      </div>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-5 pt-4">
        <SidebarMenu className="gap-1 text-sm">
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl bg-sidebar-primary/10 text-sidebar-foreground/80 transition hover:bg-sidebar-primary/20">
              <CompassIcon className="size-4" />
              <span>Explore GPTs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl bg-transparent text-sidebar-foreground/70 transition hover:bg-sidebar/70">
              <Wand2Icon className="size-4" />
              <span>Create custom GPT</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl bg-transparent text-sidebar-foreground/70 transition hover:bg-sidebar/70">
              <HistoryIcon className="size-4" />
              <span>Updates &amp; FAQ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl bg-transparent text-sidebar-foreground/70 transition hover:bg-sidebar/70">
              <KeyboardIcon className="size-4" />
              <span>Keyboard shortcuts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl bg-transparent text-sidebar-foreground/70 transition hover:bg-sidebar/70">
              <SettingsIcon className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}

type ConversationButtonProps = {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conversationId: string) => void;
  onTogglePin: (conversationId: string) => void;
  showPin?: boolean;
};

function ConversationButton({
  conversation,
  isActive,
  onSelect,
  onTogglePin,
  showPin = false,
}: ConversationButtonProps) {
  const lastActivity = useMemo(
    () => formatRelativeTime(new Date(conversation.lastActivityAt)),
    [conversation.lastActivityAt]
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={cn(
          "group flex w-full flex-col items-start gap-1 rounded-xl border border-transparent bg-sidebar/60 px-3 py-2.5 text-left text-sidebar-foreground/80 transition group-has-data-[sidebar=menu-action]/menu-item:pr-12",
          "hover:border-sidebar-border hover:bg-sidebar/80",
          isActive && "border-sidebar-border bg-sidebar-primary/15 text-sidebar-foreground dark:border-white/15 dark:bg-white/10 dark:text-white"
        )}
        onClick={() => onSelect(conversation.id)}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-sidebar-foreground dark:text-white">
            <MessageSquareIcon className="size-4 shrink-0 text-lime-300/80" />
            <span className="truncate">{conversation.title}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 dark:text-white/55">
            {lastActivity}
          </span>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2 text-xs text-sidebar-foreground/70 dark:text-white/55">
          <p className="line-clamp-2 min-w-0 flex-1 pr-1 leading-5">{conversation.preview}</p>
        </div>
      </SidebarMenuButton>
      {showPin ? (
        <SidebarMenuAction
          showOnHover={false}
          className="top-2.5 right-2.5 size-8 rounded-lg border border-sidebar-border bg-sidebar/70 text-sidebar-foreground/60 transition hover:bg-sidebar/90 dark:border-white/10 dark:bg-white/5 dark:text-white/55 dark:hover:border-white/20 dark:hover:bg-white/10"
          onClick={(event) => {
            event.stopPropagation();
            onTogglePin(conversation.id);
          }}
        >
          <PinOffIcon className="size-3.5" />
        </SidebarMenuAction>
      ) : (
        <SidebarMenuAction
          showOnHover
          className="size-7 rounded-lg border border-sidebar-border bg-transparent text-sidebar-foreground/40 opacity-0 transition group-hover/menu-item:opacity-100 dark:border-white/10 dark:text-white/40"
          onClick={(event) => {
            event.stopPropagation();
            onTogglePin(conversation.id);
          }}
        >
          <PinIcon className="size-3.5" />
        </SidebarMenuAction>
      )}
    </SidebarMenuItem>
  );
}
