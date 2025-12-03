import { Startup } from "@/lib/types/startup";
import ClientWrapper from "@/components/startup/ClientWrapper";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const StartupProfilePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const json = await res.json();
  const startup: Startup = json.data;

  return <ClientWrapper startup={startup} />;
};

export default StartupProfilePage;
