"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import StartupCard from "@/components/explore/StartupCard";
import { Startup } from "@/types/startup";

const PAGE_SIZE = 6;

export default function CategoryPageClient() {
  const pathname = usePathname(); // e.g., /category/Trending
  const searchParams = useSearchParams(); // query string
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [loading, setLoading] = useState(true);

  // Extract badge from URL
  const parts = pathname.split("/");
  const badge = parts[2] || ""; // 0: "", 1: "category", 2: badge

  // Get page from query string
  const rawPage = searchParams?.get("page") ?? "1";
  const page = parseInt(rawPage, 10) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  // Fetch startups whenever badge or page changes
  useEffect(() => {
    if (!badge) return;

    const fetchStartups = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups?badges=${badge}&limit=${PAGE_SIZE}&skip=${skip}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setStartups(Array.isArray(json.data) ? json.data : []);
        setTotalStartups(json.total || 0);
      } catch (err) {
        console.error(err);
        setStartups([]);
        setTotalStartups(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [badge, page, skip]);

  const totalPages = Math.ceil(totalStartups / PAGE_SIZE);

  // Pagination handlers
  const goToPage = (p: number) => {
    router.push(`/category/${badge}?page=${p}`);
  };

  if (!badge) return <p className="p-4">Invalid category</p>;

  return (
    <div className="p-4 md:px-20">
      <h1 className="text-2xl font-bold mb-6">{badge} Startups</h1>

      {loading ? (
        <p>Loading...</p>
      ) : startups.length === 0 ? (
        <p>No startups found for {badge}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <StartupCard key={startup._id} startup={startup} />
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
