import { AppShell } from "@/components/layout/app-shell";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function Home() {
  return (
    <AppShell>
      <ChatLayout />
    </AppShell>
  );
}
