"use client";
import { useState } from "react";
import { Startup } from "@/app/types/startup";

export default function useFilter(data: Startup[]) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredData = data.filter((startup) => {
    if (activeFilter === "All") return true;
    return (
      startup.badges?.includes(activeFilter) ||
      startup.industry?.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  return { activeFilter, setActiveFilter, filteredData };
}
