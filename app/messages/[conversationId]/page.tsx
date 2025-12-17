import ChatPageClient from './ChatPageClient';

interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { conversationId } = await params; // unwrap the promise

  return <ChatPageClient conversationId={conversationId} />;
}
