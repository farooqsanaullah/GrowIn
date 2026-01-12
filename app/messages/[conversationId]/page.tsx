"use client";

import ChatPageClient from "./ChatPageClient";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return <ChatPageClient conversationId={conversationId} />;
}
