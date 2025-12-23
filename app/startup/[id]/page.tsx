import { Startup } from "@/lib/types/startup";
import ClientWrapper from "@/components/startup/ClientWrapper";
import { notFound } from "next/navigation";
import {IConversation} from "@/lib/types/index";

type Props = {
  params: Promise<{ id: string }>;
};

const StartupProfilePage = async ({ params }: Props) => {
  const { id } = await params;
  
  // Fetch startup data
  const startupRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups/${id}`,
    { cache: "no-store" }
  );

  if (!startupRes.ok) notFound();

  const startupJson = await startupRes.json();
  const startup: Startup = startupJson.data;

  // Fetch conversations
  let conversations: IConversation[] = [];
  try {
    const conversationsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups/${id}/conversations`,
      { cache: "no-store" }
    );

    console.log('Conversations response status:', conversationsRes.status);
    if (conversationsRes.ok) {
      const conversationsJson = await conversationsRes.json();
      console.log('Fetched conversations:', conversationsJson);
      conversations = conversationsJson.conversations || [];
    }
  } catch (err) {
    console.error('Failed to fetch conversations', err);
  }

  return <ClientWrapper startup={startup} conversations={conversations} />;
};

export default StartupProfilePage;