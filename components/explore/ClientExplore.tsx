"use client";

import FiltersBar from "@/components/explore/FiltersBar";
import HorizontalSection from "@/components/explore/HorizontalSection";
import { Startup } from "@/types/startup";
import { useState, useMemo } from "react";

interface ClientExploreProps {
  data: Startup[];
  trending: Startup[];
  funded: Startup[];
  active: Startup[];
}

export default function ClientExplore({ data }: ClientExploreProps) {
  const [activeFilters, setActiveFilters] = useState<{ industry?: string; category?: string; batch?: string }>({});

  const filteredData = useMemo(() => {
    return data.filter((s) => {
      const industryMatch = !activeFilters.industry || s.industry === activeFilters.industry;
      const categoryMatch = !activeFilters.category || s.categoryType === activeFilters.category;
      const batchMatch = !activeFilters.batch || s.badges?.includes(activeFilters.batch);
      return industryMatch && categoryMatch && batchMatch;
    });
  }, [data, activeFilters]);

  const trendingFiltered = filteredData.filter((s) => s.badges?.includes("Trending"));
  const fundedFiltered = filteredData.filter((s) => s.badges?.includes("Funded"));
  const activeFiltered = filteredData.filter((s) => s.status === "Active");

  return (
    <div className="space-y-6">
      <FiltersBar activeFilters={activeFilters} setActiveFilters={setActiveFilters} />

      {trendingFiltered.length > 0 && (
        <HorizontalSection title="Trending Startups" startups={trendingFiltered} />
      )}
      {fundedFiltered.length > 0 && (
        <HorizontalSection title="Funded Startups" startups={fundedFiltered} />
      )}
      {activeFiltered.length > 0 && (
        <HorizontalSection title="All Active Startups" startups={activeFiltered} />
      )}
    </div>
  );
}
