"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SkeletonInvestor } from "@/components/skeletons/admin/investors";
import { AdminCard } from "@/components/admin/AdminCard";

interface Investor {
  _id: string;
  name?: string;
  userName: string;
  profileImage?: string;
  city?: string;
  country?: string;
  status: "active" | "inactive";
  totalInvestments: number;
}

export default function AdminInvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const res = await fetch("/api/admin/investors");
        const json = await res.json();
        setInvestors(json.data || []);
      } catch (err) {
        console.error("Failed to load investors");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  const toggleStatus = async (id: string, status: "active" | "inactive") => {
    try {
      setUpdatingId(id);
      await fetch(`/api/admin/investors/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status === "active" ? "inactive" : "active",
        }),
      });

      setInvestors((prev) =>
        prev.map((inv) =>
          inv._id === id
            ? { ...inv, status: inv.status === "active" ? "inactive" : "active" }
            : inv
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = investors.filter((inv) => {
    const term = search.toLowerCase();
    return (
      inv.name?.toLowerCase().includes(term) ||
      inv.userName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Investors</h1>
        <p className="text-muted-foreground">Manage all registered investors</p>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search investors..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonInvestor key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No investors found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((inv) => (
            <AdminCard
              key={inv._id}
              id={inv._id}
              name={inv.name}
              userName={inv.userName}
              profileImage={inv.profileImage}
              city={inv.city}
              country={inv.country}
              status={inv.status}
              count={inv.totalInvestments}
              countLabel="investments"
              updatingId={updatingId}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
