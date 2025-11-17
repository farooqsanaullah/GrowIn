"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Startup } from "@/types/startup";
import StartupCard from "@/components/explore/StartupCard";

interface ApiResponse {
  data: Startup[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const CategoryPage: React.FC<{ category: string }> = ({ category }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchStartups = async (page: number) => {
    let url = `/api/startups?page=${page}&limit=${limit}`;

    if (category === "trending" || category === "funded") {
      const badge = category === "trending" ? "Trending" : "Funded";
      url += `&badge=${badge}`;
    } else if (category === "active") {
      url += `&status=Active`;
    }

    const res = await fetch(url);
    const json: ApiResponse = await res.json();
    setStartups(json.data);
    setTotalPages(json.meta.totalPages);
  };

  useEffect(() => {
    fetchStartups(page);
  }, [page, category]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    router.push(`/explore/${category}?page=${newPage}`);
  };

  return (
    <div className="p-6 md:px-20 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 capitalize">{category} Startups</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <StartupCard key={startup._id} startup={startup} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="px-4 py-2 bg-white border rounded hover:bg-gray-100"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-white border rounded hover:bg-gray-100"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
