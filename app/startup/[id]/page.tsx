import { Startup } from "@/lib/types/startup";
import ClientWrapper from "@/components/startup/ClientWrapper";
import { notFound } from "next/navigation";
import { IConversation } from "@/lib/types/index";

type Props = {
  params: Promise<{ id: string }>;
};

const StartupProfilePage = async ({ params }: Props) => {
  const { id } = await params;

  // Fetch startup data
  const startupRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/startups/${id}`,
    { cache: "no-store" }
  );

  if (!startupRes.ok) notFound();

  const startupJson = await startupRes.json();
  const startup: Startup = startupJson.data;

  // Fetch conversations
  let conversations: IConversation[] = [];
  try {
    const conversationsRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/startups/${id}/conversations`,
      { cache: "no-store" }
    );
    if (conversationsRes.ok) {
      const json = await conversationsRes.json();
      conversations = json.conversations || [];
    }
  } catch {
    // non-critical — page renders without conversations
  }

  return <ClientWrapper startup={startup} conversations={conversations} />;
};

export default StartupProfilePage;