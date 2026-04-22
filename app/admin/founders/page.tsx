"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search} from "lucide-react";
import { SkeletonFounder } from "@/components/skeletons/admin/founders";
import { AdminCard } from "@/components/admin/AdminCard";

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
            <AdminCard
              key={f._id}
              id={f._id}
              name={f.name}
              userName={f.userName}
              profileImage={f.profileImage}
              city={f.city}
              country={f.country}
              status={f.status}
              count={f.totalStartups}
              countLabel="startups"
              skills={f.skills}
              updatingId={updatingId}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
