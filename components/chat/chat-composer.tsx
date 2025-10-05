"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  ImageIcon,
  MicIcon,
  PaperclipIcon,
  PlusIcon,
  SendIcon,
} from "lucide-react";
import { nanoid } from "nanoid";

import { IconButton } from "@/components/common/icon-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/lib/store/use-chat-store";
import { cn } from "@/lib/utils";
import { simulateAssistantResponse } from "@/lib/utils/assistant-simulator";

const SUGGESTIONS = [
  "Plan deep-work blocks for my week",
  "Summarize the latest product feedback",
  "Draft a friendly release note update",
];

type ChatComposerProps = {
  floating?: boolean;
};

export function ChatComposer({ floating = false }: ChatComposerProps) {
  const selectedConversationId = useChatStore(
    (state) => state.selectedConversationId
  );
  const appendMessage = useChatStore((state) => state.appendMessage);
  const startNewConversation = useChatStore((state) => state.startNewConversation);

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = inputValue.trim().length > 0;

  const handleAutoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage();
  };

  const submitMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    let conversationId = selectedConversationId;
    if (!conversationId) {
      const conversation = startNewConversation();
      conversationId = conversation.id;
    }

    const timestamp = new Date().toISOString();
    appendMessage(conversationId, {
      id: `msg-${nanoid(8)}`,
      role: "user",
      content: trimmed,
      createdAt: timestamp,
      status: "ready",
    });

    setInputValue("");
    handleAutoResize();

    simulateAssistantResponse(conversationId!, trimmed);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(handleAutoResize, 0);
  };

  useEffect(() => {
    handleAutoResize();
  }, [inputValue]);

  return (
    <TooltipProvider delayDuration={120}>
      <div
        className={cn(
          "relative border-t border-transparent px-4 pb-6 pt-4 transition-all duration-500 md:px-6",
          floating && "border-none pb-0 pt-0 md:px-0"
        )}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-3xl space-y-4 transition-all duration-500",
            floating && "max-w-2xl"
          )}
        >
          <SuggestionRow onSelect={handleSuggestion} />
          <form
            onSubmit={handleSubmit}
            className={cn(
              "glass-form space-y-3 rounded-[1.75rem] p-4 transition-all duration-500 md:p-6",
              floating &&
                "shadow-xl shadow-emerald-500/15 backdrop-blur-lg md:p-7"
            )}
          >
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onInput={handleAutoResize}
              onKeyDown={handleKeyDown}
              placeholder="Ask ChatGPT to help with ideas, code, or writing…"
              rows={1}
              className="min-h-[56px] resize-none border-none bg-transparent px-1 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Separator className="bg-border/60" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ComposerIconButton icon={PlusIcon} label="Insert" />
                <ComposerIconButton icon={PaperclipIcon} label="Add file" />
                <ComposerIconButton icon={ImageIcon} label="Image" />
              </div>
              <div className="flex items-center gap-2">
                <ComposerIconButton icon={MicIcon} label="Voice" />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!canSend}
                  className="rounded-xl bg-primary/80 px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary disabled:bg-primary/40 disabled:text-primary-foreground/70"
                >
                  <SendIcon className="mr-2 size-4" />
                  Send
                </Button>
              </div>
            </div>
          </form>
          <p
            className={cn(
              "text-center text-xs text-muted-foreground transition-opacity duration-500",
              floating && "text-xs/relaxed text-muted-foreground/80"
            )}
          >
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}

function SuggestionRow({
  onSelect,
}: {
  onSelect: (suggestion: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="glass-chip rounded-2xl px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:text-primary"
        >
          {suggestion}
        </button>
      ))}
      <Badge
        variant="outline"
        className="glass-chip hidden rounded-2xl border-transparent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:inline-flex"
      >
        Suggestions
      </Badge>
    </div>
  );
}

function ComposerIconButton({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton className="glass-chip size-10 rounded-xl text-foreground/70 hover:border-primary/40 hover:text-primary">
          <Icon className="size-4" />
        </IconButton>
      </TooltipTrigger>
      <TooltipContent side="top" className="glass-chip border-transparent px-3 py-1.5 text-foreground/80">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

