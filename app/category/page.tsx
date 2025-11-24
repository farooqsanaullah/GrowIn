"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import StartupCard from "@/components/explore/StartupCard";
import { Startup } from "@/lib/types/startup";
import FiltersBar from "@/components/explore/FiltersBar";

const PAGE_SIZE = 6;

export default function ExplorePage() {
  const searchParamsHook = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [loading, setLoading] = useState(true);

  // Convert searchParams to a stable object/string for useEffect
  const [paramsString, setParamsString] = useState(searchParamsHook?.toString() || "");

  useEffect(() => {
    // Whenever pathname or search params change, update paramsString
    setParamsString(searchParamsHook?.toString() || "");
  }, [pathname, searchParamsHook?.toString()]);

  const page = parseInt(searchParamsHook?.get("page") || "1", 10);
  const skip = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    // Fetch whenever paramsString changes
    const params = new URLSearchParams(paramsString);

    if (skip) params.set("skip", skip.toString());
    params.set("limit", PAGE_SIZE.toString());

    const fetchStartups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups?${params.toString()}`, { cache: "no-store" });
        const json = await res.json();
        setStartups(json.data || []);
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
  }, [paramsString, skip]);

  const totalPages = Math.ceil(totalStartups / PAGE_SIZE);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParamsHook?.toString() || "");
    params.set("page", p.toString());
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="p-4 md:px-20 space-y-6">
        <FiltersBar />
      {loading ? <p>Loading...</p> : startups.length === 0 ? <p>No startups found</p> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map(s => <StartupCard key={s._id} startup={s} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              {page > 1 && <button onClick={() => goToPage(page - 1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>}
              {page < totalPages && <button onClick={() => goToPage(page + 1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
