"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import StartupCard from "@/components/explore/StartupCard";
import { Startup } from "@/lib/types/startup";
import FiltersBar from "@/components/explore/FiltersBar";

const PAGE_SIZE = 6;

function ExploreContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", PAGE_SIZE.toString());

    const fetchStartups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/startups?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setStartups(json.data || []);
        setTotal(json.meta?.total || 0);
      } catch (err) {
        console.error(err);
        setStartups([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [searchParams, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4 md:px-20 space-y-6 pt-30">
      <h1 className="text-xl md:text-2xl font-bold text-center sm:text-left">
        Invest in Innovation, Grow Together.
      </h1>

      <FiltersBar />

      {loading ? (
        <p>Loading...</p>
      ) : startups.length === 0 ? (
        <p>No startups found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-20">
            {startups.map((s) => (
              <StartupCard key={s._id} startup={s} />
            ))}
          </div>

          {/* Pagination */}
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

              <span className="px-3 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

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

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-4 md:px-20">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
