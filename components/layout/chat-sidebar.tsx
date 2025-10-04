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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRelativeTime } from "@/hooks/use-relative-time";
import { getConversationSectionLabel } from "@/lib/utils/date";
import { useChatStore } from "@/lib/store/use-chat-store";
import type { Conversation } from "@/lib/types/chat";

type ConversationSection = {
  label: string;
  conversations: Conversation[];
};

const sidebarFooterButtonClasses =
  "group rounded-2xl h-auto min-h-[3.25rem] items-center justify-start gap-3 px-3 py-3 pr-4 [&>span:last-child]:max-w-full [&>span:last-child]:whitespace-normal [&>span:last-child]:break-words [&>span:last-child]:leading-tight";
const sidebarFooterLabelClasses =
  "flex-1 whitespace-normal break-words text-left leading-tight group-data-[collapsible=icon]:hidden";

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
    <div className="flex h-full flex-col bg-transparent text-sidebar-foreground transition-colors">
      <SidebarHeader className="gap-4 px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-sidebar-foreground/90">
            <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <SparklesIcon className="size-4" />
            </span>
            <span className="tracking-[0.16em] text-xs uppercase text-sidebar-foreground/70">
              Clanker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="glass-chip border-transparent px-3 py-1 text-[10px] font-normal uppercase tracking-widest text-sidebar-foreground/65"
            >
              Beta
            </Badge>
            <SidebarTrigger className="glass-chip size-10 rounded-2xl text-sidebar-foreground/65 transition hover:border-primary/40 hover:text-primary" />
          </div>
        </div>
        <Button
          size="lg"
          variant="ghost"
          className="glass-subtle h-11 w-full justify-start gap-2 rounded-2xl text-left text-sidebar-foreground/85 transition hover:border-primary/40 hover:text-primary hover:shadow-lg"
          onClick={startNewConversation}
        >
          <PlusIcon className="size-4" />
          <span>New chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-hidden">
        <div className="px-5 pb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-sidebar-foreground/50" />
            <SidebarInput
              value={searchTerm}
              onChange={(event) => updateSearchTerm(event.target.value)}
              placeholder="Search conversations"
              className="glass-inline h-10 rounded-2xl border-0 bg-transparent pl-9 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus-visible:border-primary/40"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4 px-3 pb-6">
            {pinned.length > 0 ? (
              <SidebarGroup className="px-1">
                <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-[0.2em] text-sidebar-foreground/50">
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
              <SidebarSeparator className="bg-white/20 dark:bg-white/10" />
            ) : null}

            <SidebarGroup className="flex-1 px-1">
              <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-[0.2em] text-sidebar-foreground/45">
                Recents
              </SidebarGroupLabel>
              <SidebarGroupContent className="pb-4">
                <SidebarMenu className="gap-2">
                  {sections.length === 0 && pinned.length === 0 ? (
                    <SidebarMenuItem>
                      <div className="glass-inline rounded-xl px-3 py-2 text-xs text-sidebar-foreground/65">
                        No conversations yet. Start a new chat to see it here.
                      </div>
                    </SidebarMenuItem>
                  ) : (
                    sections.map((section) => (
                      <div key={section.label} className="space-y-2">
                        <p className="px-4 text-[10px] font-medium uppercase tracking-[0.26em] text-sidebar-foreground/40">
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

      <SidebarFooter className="px-5 pb-6 pt-4">
        <SidebarMenu className="gap-1.5 text-sm">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "glass-inline text-sidebar-foreground/80 transition hover:border-primary/40 hover:text-primary",
                sidebarFooterButtonClasses
              )}
            >
              <CompassIcon className="size-4 shrink-0" />
              <span className={sidebarFooterLabelClasses}>Explore GPTs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "bg-transparent text-sidebar-foreground/70 transition hover:text-primary",
                sidebarFooterButtonClasses
              )}
            >
              <Wand2Icon className="size-4 shrink-0" />
              <span className={sidebarFooterLabelClasses}>Create custom GPT</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "bg-transparent text-sidebar-foreground/70 transition hover:text-primary",
                sidebarFooterButtonClasses
              )}
            >
              <HistoryIcon className="size-4 shrink-0" />
              <span className={sidebarFooterLabelClasses}>Updates &amp; FAQ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "bg-transparent text-sidebar-foreground/70 transition hover:text-primary",
                sidebarFooterButtonClasses
              )}
            >
              <KeyboardIcon className="size-4 shrink-0" />
              <span className={sidebarFooterLabelClasses}>Keyboard shortcuts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "bg-transparent text-sidebar-foreground/70 transition hover:text-primary",
                sidebarFooterButtonClasses
              )}
            >
              <SettingsIcon className="size-4 shrink-0" />
              <span className={sidebarFooterLabelClasses}>Settings</span>
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
  const { relative: lastActivity, absolute: lastActivityAbsolute } = useRelativeTime(
    conversation.lastActivityAt
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={cn(
          "group glass-inline flex h-auto min-h-[4rem] w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sidebar-foreground/85 transition group-has-data-[sidebar=menu-action]/menu-item:pr-14",
          "hover:border-primary/30 hover:text-primary",
          isActive && "border-primary/50 text-primary"
        )}
        onClick={() => onSelect(conversation.id)}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary dark:bg-primary/20">
          <MessageSquareIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 items-start gap-3">
            <span className="block min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-sidebar-foreground line-clamp-1 dark:text-white">
              {conversation.title}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <p className="min-w-0 flex-1 text-xs leading-5 text-sidebar-foreground/70 line-clamp-2 dark:text-white/60">
              {conversation.preview}
            </p>
            <time
              dateTime={conversation.lastActivityAt}
              title={lastActivityAbsolute}
              className="shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-sidebar-foreground/55 dark:text-white/60"
            >
              {lastActivity}
            </time>
          </div>
        </div>
      </SidebarMenuButton>
      {showPin ? (
        <SidebarMenuAction
          showOnHover={false}
          className="right-2.5 size-8 rounded-lg glass-chip text-sidebar-foreground/60 transition hover:border-primary/35 hover:text-primary !top-3.5"
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
          className="glass-chip size-7 rounded-lg border border-transparent text-sidebar-foreground/45 opacity-0 transition group-hover/menu-item:opacity-100 hover:border-primary/35 hover:text-primary !top-3.5"
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
