"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store/use-chat-store";

import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";

export function ChatLayout() {
  const conversation = useChatStore((state) => {
    const activeId = state.selectedConversationId;
    return (
      state.conversations.find((item) => item.id === activeId) ?? null
    );
  });

  const shouldFloatComposer = !conversation || conversation.messages.length === 0;
  const shouldDimMessages = !!conversation && conversation.messages.length === 0;

  return (
    <div className="flex h-svh flex-col bg-transparent text-foreground transition-colors">
      <ChatHeader />
      <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
        <motion.div
          layout
          aria-hidden={shouldDimMessages}
          className={cn(
            "flex-1 min-h-0 overflow-hidden",
            shouldDimMessages && "pointer-events-none"
          )}
          animate={{ opacity: shouldDimMessages ? 0 : 1 }}
          initial={false}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <MessageList />
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "transform-gpu transition-[opacity,transform] duration-500 ease-out",
            shouldFloatComposer
              ? "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
              : "relative mt-auto flex w-full justify-center"
          )}
        >
          <motion.div
            layout
            className={cn(
              "pointer-events-auto w-full px-4 pb-6 pt-4 transition-transform duration-500 ease-out md:px-6",
              shouldFloatComposer
                ? "mx-auto max-w-2xl -translate-y-6 sm:-translate-y-10"
                : "mx-auto max-w-3xl"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatComposer floating={shouldFloatComposer} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
