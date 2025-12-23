"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Wallet, Search, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Skeleton for the investor ribbon
  const SkeletonInvestor = () => (
    <Card className="flex items-center justify-between p-4 space-x-4 animate-pulse">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Middle */}
      <div className="hidden sm:flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>
    </Card>
  );

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
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonInvestor key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No investors found
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => (
            <Card
              key={inv._id}
              className="flex items-center justify-between p-4 hover:shadow-md transition"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {inv.profileImage ? (
                    <img
                      src={inv.profileImage}
                      alt={inv.name || inv.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <p className="font-semibold">
                    {inv.name || inv.userName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {inv.city || inv.country
                      ? `${inv.city ?? ""}${inv.city && inv.country ? ", " : ""}${inv.country ?? ""}`
                      : "Location not set"}
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{inv.totalInvestments} investments</span>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <Badge variant={inv.status === "active" ? "default" : "secondary"}>
                  {inv.status}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updatingId === inv._id}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(inv._id, inv.status)}
                >
                  {updatingId === inv._id ? (
                    <Loader className="h-4 w-4 rounded" />
                  ) : inv.status === "active" ? (
                    "Deactivate"
                  ) : (
                    "Activate"
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
