"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Search, Loader } from "lucide-react";
import { SkeletonFounder } from "@/components/skeletons/admin/founders";
import { getInitials } from "@/lib/helpers";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Founders</h1>
        <p className="text-muted-foreground">Manage all registered founders</p>
      </div>

      {/* Search */}
      <div className="relative w-full">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonFounder key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No founders found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((f) => (
            <Card key={f._id} className="relative p-4 hover:shadow-lg transition flex flex-col gap-3">
              {/* Top: Profile Image + Startups badge */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                {f.profileImage ? (
                  <img
                    src={f.profileImage}
                    alt={f.name || f.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center font-semibold text-foreground text-2xl">
                    {getInitials(f.name, f.userName)}
                  </div>
                )}

                {/* Total Startups Badge on top-right */}
                <Badge className="absolute top-2 right-2 bg-green-50 text-green-600 rounded-sm py-1 px-3 flex items-center gap-1 shadow-sm">
                  {f.totalStartups} startups
                </Badge>
              </div>

              {/* Name + Activate/Deactivate Button */}
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold text-lg">{f.name || f.userName}</p>
                <Button
                  size="sm"
                  variant={f.status === "active" ? "outline" : "default"}
                  disabled={updatingId === f._id}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(f._id, f.status)}
                >
                  {updatingId === f._id
                    ? <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                    : f.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>

              {/* Skills Dropdown */}
              {f.skills && f.skills.length > -1 && (
                <details className="mt-1">
                  <summary className="cursor-pointer text-sm text-muted-foreground">Skills ({f.skills.length})</summary>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {f.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="border-blue-400 bg-blue-50 text-blue-600 rounded-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </details>
              )}

              {/* Separator */}
              <div className="border-t mt-2 pt-2"></div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {f.city || f.country
                  ? `${f.city ?? ""}${f.city && f.country ? ", " : ""}${f.country ?? ""}`
                  : "Location not set"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
