"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Search, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Founder {
  _id: string;
  name?: string;
  userName: string;
  profileImage?: string;
  city?: string;
  country?: string;
  status: "active" | "inactive";
  totalStartups: number;
  skills?: string[];
}

export default function AdminFoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const res = await fetch("/api/admin/founders");
        const json = await res.json();
        setFounders(json.data || []);
      } catch (err) {
        console.error("Failed to load founders");
      } finally {
        setLoading(false);
      }
    };
    fetchFounders();
  }, []);

  const toggleStatus = async (id: string, status: "active" | "inactive") => {
    try {
      setUpdatingId(id);
      await fetch(`/api/admin/founders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status === "active" ? "inactive" : "active",
        }),
      });

      setFounders((prev) =>
        prev.map((f) =>
          f._id === id ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = founders.filter((f) => {
    const term = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) || f.userName.toLowerCase().includes(term)
    );
  });

  // Skeleton for founder card
  const SkeletonFounder = () => (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 space-y-2 sm:space-y-0 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-10 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
          </div>
        </div>
      </div>
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
        <h1 className="text-3xl font-bold">Founders</h1>
        <p className="text-muted-foreground">Manage all registered founders</p>
      </div>

      {/* Search */}
      <div className="relative w-full w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search founders..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonFounder key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No founders found
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((f) => (
            <Card
              key={f._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:shadow-md transition space-y-2 sm:space-y-0"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {f.profileImage ? (
                    <img
                      src={f.profileImage}
                      alt={f.name || f.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{f.name || f.userName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {f.city || f.country
                      ? `${f.city ?? ""}${f.city && f.country ? ", " : ""}${f.country ?? ""}`
                      : "Location not set"}
                  </div>
                  {/* Skills tags */}
                  {f.skills && f.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {f.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="border border-blue-200 bg-blue-50 text-blue-600">{skill}</Badge>
                      ))}
                      {f.skills.length > 3 && (
                        <Badge variant="secondary" className="border border-blue-300 bg-blue-50 text-blue-600">+{f.skills.length - 3} more</Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2 sm:mt-0">
                <Badge variant={f.status === "active" ? "default" : "secondary"}>
                  {f.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updatingId === f._id}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(f._id, f.status)}
                >
                  {updatingId === f._id
                    ? <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                    : f.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                {/* <span className="text-sm font-medium text-muted-foreground">
                  {f.totalStartups} startups
                </span> */}
                <Badge variant="outline" className="border border-green-500 bg-green-50 text-green-600 rounded-sm py-1.5 px-3">
                  {f.totalStartups} startups
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
