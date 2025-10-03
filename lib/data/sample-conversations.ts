import type { Conversation } from "@/lib/types/chat";

export const sampleConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Ideate launch messaging",
    preview: "Let’s draft a product announcement that feels human and warm…",
    lastActivityAt: new Date().toISOString(),
    pinned: true,
    messages: [
      {
        id: "conv-1-msg-1",
        role: "assistant",
        content:
          "Absolutely! Let’s craft a launch announcement that feels personal yet polished. What tone do you want to lead with?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "conv-1-msg-2",
        role: "user",
        content:
          "Friendly and confident. Highlight the new canvas workflow and real-time collaboration.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "conv-2",
    title: "React performance review",
    preview: "Profiling shows hydration costs. Suggest streaming UI tactics…",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    messages: [
      {
        id: "conv-2-msg-1",
        role: "user",
        content:
          "I’m seeing hydration taking ~250ms on the marketing page. How can I improve it without losing fidelity?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: "conv-2-msg-2",
        role: "assistant",
        content:
          "Consider server components for static copy and progressively hydrate the hero animation. Also, lazy-load the analytics widget.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
      },
    ],
  },
  {
    id: "conv-3",
    title: "Weekend meal planner",
    preview: "Finalize grocery list with seasonal vegetables and easy prep…",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        id: "conv-3-msg-1",
        role: "assistant",
        content:
          "Here’s a cozy weekend plan: roasted squash soup, citrus salad, and a no-fuss pasta bake. Want a shopping list?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
      },
      {
        id: "conv-3-msg-2",
        role: "user",
        content: "Yes please, include dessert ideas that aren’t too sweet.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24.4).toISOString(),
      },
    ],
  },
];
