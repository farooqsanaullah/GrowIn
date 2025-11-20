import FiltersBar from "@/components/explore/FiltersBar";
import HorizontalSection from "@/components/explore/HorizontalSection";
import { Startup } from "@/types/startup";

interface ClientExploreProps {
  trending: Startup[];
  funded: Startup[];
  active: Startup[];
}

export default function ClientExplore({ trending, funded, active }: ClientExploreProps) {
  return (
    <div className="space-y-6">
      <FiltersBar /> {/* optional if you plan to add filters later */}

      {trending.length > 0 && (
        <HorizontalSection title="Trending Startups" startups={trending} badge="Trending"/>
      )}

      {funded.length > 0 && (
        <HorizontalSection title="Funded Startups" startups={funded} badge="Funded"/>
      )}

      {active.length > 0 && (
        <HorizontalSection title="All Active Startups" startups={active} badge="Active"/>
      )}
    </div>
  );
}
