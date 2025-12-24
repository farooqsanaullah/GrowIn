"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import StartupCard from "@/components/explore/StartupCard";
import { Startup } from "@/lib/types/startup";
import FiltersBar from "@/components/explore/FiltersBar";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";

const PAGE_SIZE = 6;

function ExploreContent() {
  const searchParamsHook = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [loading, setLoading] = useState(true);

  const [paramsString, setParamsString] = useState(searchParamsHook?.toString() || "");

  useEffect(() => {
    setParamsString(searchParamsHook?.toString() || "");
  }, [pathname, searchParamsHook?.toString()]);

  const page = parseInt(searchParamsHook?.get("page") || "1", 10);
  const skip = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    const params = new URLSearchParams(paramsString);

    if (skip) params.set("skip", skip.toString());
    params.set("limit", PAGE_SIZE.toString());

    const fetchStartups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/startups?${params.toString()}`, { cache: "no-store" });
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
    router.push(`/category?${params.toString()}`);
  };

  return (
    <div>
      <Header />
    <div className="p-4 md:px-20 space-y-6 pt-30">
      <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-4 md:mx-20 sm:mx-4 text-center sm:text-left">
          Invest in Innovation, Grow Together.
        </h1>
      <FiltersBar />
      {loading ? (
        <p>Loading...</p>
      ) : startups.length === 0 ? (
        <p>No startups found</p>
      ) : (
        <>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:px-20 ">
            {startups.map(s => <StartupCard key={s._id} startup={s} />)}
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
    <Footer />
    
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-4 md:px-20">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}