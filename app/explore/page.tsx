// app/explore/page.tsx
import { Startup } from "@/types/startup";
import startupsData from "@/app/data/startups.json";
import ClientExplore from "@/components/explore/ClientExplore";

export default async function ExplorePage() {
  const data = startupsData as Startup[];

  const trending = data.filter((s) => s.badges?.includes("Trending"));
  const funded = data.filter((s) => s.badges?.includes("Funded"));
  const active = data.filter((s) => s.status === "Active");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 ml-20">Explore Startups</h1>
      <ClientExplore data={data} trending={trending} funded={funded} active={active} />
    </div>
  );
}
