import { Startup } from "@/types/startup";
import startupsData from "@/app/data/startups.json";
import ClientExplore from "@/components/explore/ClientExplore";

export default async function ExplorePage() {
  const data = startupsData as Startup[];

  const trending = data.filter((s) => s.badges?.includes("Trending"));
  const funded = data.filter((s) => s.badges?.includes("Funded"));
  const active = data.filter((s) => s.status === "Active");

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
      <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-4 md:mx-20 sm:mx-4 text-center sm:text-left">
        Invest in Innovation, Grow Together.
      </h1>
      <ClientExplore data={data} trending={trending} funded={funded} active={active} />
    </div>
  );
}
