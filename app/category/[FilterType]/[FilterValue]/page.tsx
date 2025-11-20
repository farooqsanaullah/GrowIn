"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import StartupCard from "@/components/explore/StartupCard";
import FiltersBar from "@/components/explore/FiltersBar";
import { Startup } from "@/types/startup";

const PAGE_SIZE = 6;

export default function FilteredPageClient() {
  const pathname = usePathname(); 
  const searchParams = useSearchParams(); 
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [loading, setLoading] = useState(true);

  // Parse filterType & filterValue from URL
  const parts = pathname.split("/").filter(Boolean); 
  const filterType = parts[1]; 
  const filterValue = parts[2] || "";

  const rawPage = searchParams?.get("page") ?? "1";
  const page = parseInt(rawPage, 10) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  // Map filterType → backend query param
  const queryParamMap: Record<string, string> = {
    badges: "badges",
    industry: "industry",
    "business-model": "categoryType",
  };
  const backendParam = queryParamMap[filterType];

  // Fetch startups from backend
  useEffect(() => {
    if (!backendParam || !filterValue) return;

    const fetchStartups = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups?${backendParam}=${filterValue}&limit=${PAGE_SIZE}&skip=${skip}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setStartups(Array.isArray(json.data) ? json.data : []);
        setTotalStartups(json.meta?.total || 0);
      } catch (err) {
        console.error(err);
        setStartups([]);
        setTotalStartups(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [filterValue, backendParam, skip]);

  const totalPages = Math.ceil(totalStartups / PAGE_SIZE);

  const goToPage = (p: number) => {
    router.push(`/explore/${filterType}/${filterValue}?page=${p}`);
  };


  if (!backendParam || !filterValue) return <p className="p-4">Invalid filter</p>;

  return (
    <div className="p-4 md:px-20 space-y-6">
      {/* FiltersBar */}
      <FiltersBar />

      <h1 className="text-2xl font-bold mb-6 capitalize">
        {filterValue.replace(/-/g, " ")} Startups
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : startups.length === 0 ? (
        <p>No startups found for {filterValue}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <StartupCard key={startup._id} startup={startup} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              {page > 1 && (
                <button
                  onClick={() => goToPage(page - 1)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Previous
                </button>
              )}
              {page < totalPages && (
                <button
                  onClick={() => goToPage(page + 1)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
