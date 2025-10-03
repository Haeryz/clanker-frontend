"use client";

import { nanoid } from "nanoid";

import { useChatStore } from "@/lib/store/use-chat-store";

const BASE_DELAY = 320;
const DELAY_VARIANCE = 180;

export function simulateAssistantResponse(conversationId: string, prompt: string) {
  const store = useChatStore.getState();
  const draft = buildDraft(prompt);

  const messageId = `msg-${nanoid(8)}`;
  const createdAt = new Date().toISOString();

  store.appendMessage(conversationId, {
    id: messageId,
    role: "assistant",
    content: "",
    createdAt,
    status: "thinking",
    reasoning: draft.reasoning,
  });

  store.setStreamingMessage(messageId);

  let assembled = "";

  draft.chunks.forEach((chunk, index) => {
    const delay = draft.intervals[index];

    setTimeout(() => {
      assembled = `${assembled}${chunk}`;
      const finalChunk = index === draft.chunks.length - 1;
      const timestamp = new Date().toISOString();

      store.updateMessage(conversationId, messageId, {
        content: assembled.trim(),
        status: finalChunk ? "ready" : "thinking",
        createdAt: timestamp,
      });

      if (finalChunk) {
        store.setStreamingMessage(null);
      }
    }, delay);
  });
}

function buildDraft(prompt: string) {
  const normalized = prompt.trim();
  const shortened = normalized.length > 180 ? `${normalized.slice(0, 177)}…` : normalized;

  const reasoning = [
    `Confirm intent by restating the request: "${shortened}"`,
    "Gather the relevant context, resources, and edge cases to cover",
    "Plan the response so it's concise, actionable, and easy to iterate on",
  ];

  const response = [
    normalized
      ? `Here’s how we can handle “${shortened}” right now:`
      : "Here’s what I can help with right now:",
    "1. Capture the objective and constraints in a quick summary.",
    "2. Outline the steps to get to a first useful result.",
    "3. Flag any decisions or validations we should confirm before shipping.",
    "Let me know if you want me to go deeper on any part or take action on it.",
  ].join("\n\n");

  const segments = response
    .split(/\n\n/)
    .flatMap((block) => block.split(/(?<=[.!?])\s+/))
    .filter(Boolean);

  const chunks = segments.map((sentence, index) => (index === 0 ? sentence : ` ${sentence}`));
  const intervals = chunks.map((_, index) => BASE_DELAY * (index + 1) + Math.random() * DELAY_VARIANCE);

  return {
    reasoning,
    chunks,
    intervals,
  };
}
