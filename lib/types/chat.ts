export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: "thinking" | "ready";
  reasoning?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  pinned?: boolean;
  lastActivityAt: string;
  preview: string;
  messages: ChatMessage[];
}
