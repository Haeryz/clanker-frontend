"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";

import { sampleConversations } from "@/lib/data/sample-conversations";
import type { ChatMessage, Conversation } from "@/lib/types/chat";

type ChatStore = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  searchTerm: string;
  streamingMessageId: string | null;
  selectConversation: (conversationId: string) => void;
  startNewConversation: () => Conversation;
  updateConversationTitle: (conversationId: string, title: string) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    patch: Partial<Pick<ChatMessage, "content" | "status" | "createdAt" | "reasoning">>
  ) => void;
  updateSearchTerm: (term: string) => void;
  togglePin: (conversationId: string) => void;
  clearSearch: () => void;
  setStreamingMessage: (messageId: string | null) => void;
};

const initialConversations = sampleConversations.map((conversation) => ({
  ...conversation,
  messages: [...conversation.messages],
}));

export const useChatStore = create<ChatStore>((set) => ({
  conversations: initialConversations,
  selectedConversationId: null,
  searchTerm: "",
  streamingMessageId: null,
  selectConversation: (conversationId) => set({ selectedConversationId: conversationId }),
  startNewConversation: () => {
    const newConversation: Conversation = {
      id: `conv-${nanoid(6)}`,
      title: "Untitled conversation",
      preview: "Say something to start the conversation…",
      lastActivityAt: new Date().toISOString(),
      messages: [],
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      selectedConversationId: newConversation.id,
    }));

    return newConversation;
  },
  updateConversationTitle: (conversationId, title) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, title } : conversation
      ),
    })),
  appendMessage: (conversationId, message) =>
    set((state) => {
      const nextMessage: ChatMessage = {
        ...message,
        status: message.status ?? (message.role === "assistant" ? "ready" : "ready"),
      };

      const updated = state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, nextMessage],
              preview: nextMessage.content || conversation.preview,
              lastActivityAt: nextMessage.createdAt,
            }
          : conversation
      );

      updated.sort(
        (a, b) =>
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
      );

      return {
        conversations: updated,
        selectedConversationId: conversationId,
      };
    }),
  updateMessage: (conversationId, messageId, patch) =>
    set((state) => {
      const conversations = state.conversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const messages = conversation.messages.map((message) =>
          message.id === messageId ? { ...message, ...patch } : message
        );

        const updatedConversation: Conversation = {
          ...conversation,
          messages,
        };

        const target = messages.find((message) => message.id === messageId);
        if (target) {
          const trimmed = target.content?.trim();
          updatedConversation.preview = trimmed && trimmed.length > 0 ? trimmed : "Thinking…";
          updatedConversation.lastActivityAt =
            patch.createdAt ?? target.createdAt ?? conversation.lastActivityAt;
        }

        return updatedConversation;
      });

      conversations.sort(
        (a, b) =>
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
      );

      return { conversations };
    }),
  togglePin: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, pinned: !conversation.pinned }
          : conversation
      ),
    })),
  updateSearchTerm: (term) => set({ searchTerm: term }),
  clearSearch: () => set({ searchTerm: "" }),
  setStreamingMessage: (messageId) => set({ streamingMessageId: messageId }),
}));

export const selectConversations = () => {
  const { conversations, searchTerm } = useChatStore.getState();

  if (!searchTerm.trim()) {
    return conversations;
  }

  const lowerTerm = searchTerm.toLowerCase();

  return conversations.filter((conversation) =>
    [conversation.title, conversation.preview].some((value) =>
      value.toLowerCase().includes(lowerTerm)
    )
  );
};

export const selectActiveConversation = () => {
  const { conversations, selectedConversationId } = useChatStore.getState();
  return conversations.find((conversation) => conversation.id === selectedConversationId) ?? null;
};
