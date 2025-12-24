"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Loader } from "lucide-react";
import { SkeletonInvestor } from "@/components/skeletons/admin/investors";
import { getInitials } from "@/lib/helpers";

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
            <Card
              key={inv._id}
              className="relative p-4 hover:shadow-lg transition flex flex-col gap-3"
            >
              {/* Top: Profile Image + Investments badge */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                {inv.profileImage ? (
                  <img
                    src={inv.profileImage}
                    alt={inv.name || inv.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center font-semibold text-foreground text-2xl">
                    {getInitials(inv.name, inv.userName)}
                  </div>
                )}

                {/* Total Investments Badge on top-right */}
                <Badge className="absolute top-2 right-2 bg-green-50 text-green-600 rounded-sm py-1 px-3 flex items-center gap-1 shadow-sm">
                  {inv.totalInvestments} investments
                </Badge>
              </div>

              {/* Name + Activate/Deactivate Button */}
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold text-lg">{inv.name || inv.userName}</p>
                <Button
                  size="sm"
                  variant={inv.status === "active" ? "outline" : "default"}
                  disabled={updatingId === inv._id}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(inv._id, inv.status)}
                >
                  {updatingId === inv._id
                    ? <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                    : inv.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>

              {/* Separator */}
              <div className="border-t mt-2 pt-2"></div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {inv.city || inv.country
                  ? `${inv.city ?? ""}${inv.city && inv.country ? ", " : ""}${inv.country ?? ""}`
                  : "Location not set"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
