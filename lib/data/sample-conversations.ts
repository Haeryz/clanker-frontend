import type { Conversation } from "@/lib/types/chat";

const BASE_TIMESTAMP = "2025-10-04T11:30:00.000Z";

export const sampleConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Ideate launch messaging",
    preview: "Let’s draft a product announcement that feels human and warm…",
    lastActivityAt: BASE_TIMESTAMP,
    pinned: true,
    messages: [
      {
        id: "conv-1-msg-1",
        role: "assistant",
        content:
          "Absolutely! Let’s craft a launch announcement that feels personal yet polished. What tone do you want to lead with?",
        createdAt: "2025-10-04T11:25:00.000Z",
      },
      {
        id: "conv-1-msg-2",
        role: "user",
        content:
          "Friendly and confident. Highlight the new canvas workflow and real-time collaboration.",
        createdAt: "2025-10-04T11:27:00.000Z",
      },
    ],
  },
  {
    id: "conv-2",
    title: "React performance review",
    preview: "Profiling shows hydration costs. Suggest streaming UI tactics…",
    lastActivityAt: "2025-10-04T09:30:00.000Z",
    messages: [
      {
        id: "conv-2-msg-1",
        role: "user",
        content:
          "I’m seeing hydration taking ~250ms on the marketing page. How can I improve it without losing fidelity?",
        createdAt: "2025-10-04T07:30:00.000Z",
      },
      {
        id: "conv-2-msg-2",
        role: "assistant",
        content:
          "Consider server components for static copy and progressively hydrate the hero animation. Also, lazy-load the analytics widget.",
        createdAt: "2025-10-04T08:00:00.000Z",
      },
    ],
  },
  {
    id: "conv-3",
    title: "Weekend meal planner",
    preview: "Finalize grocery list with seasonal vegetables and easy prep…",
    lastActivityAt: "2025-10-03T11:30:00.000Z",
    messages: [
      {
        id: "conv-3-msg-1",
        role: "assistant",
        content:
          "Here’s a cozy weekend plan: roasted squash soup, citrus salad, and a no-fuss pasta bake. Want a shopping list?",
        createdAt: "2025-10-03T11:00:00.000Z",
      },
      {
        id: "conv-3-msg-2",
        role: "user",
        content: "Yes please, include dessert ideas that aren’t too sweet.",
        createdAt: "2025-10-03T11:10:00.000Z",
      },
    ],
  },
];
