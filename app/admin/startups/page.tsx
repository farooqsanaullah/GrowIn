"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EquityRange {
  range: string;
  equity: number;
}

interface Startup {
  _id: string;
  title: string;
  description: string;
  founders: string[];
  investors: string[];
  badges: string[];
  categoryType: string;
  industry: string;
  ratingCount: number;
  avgRating: number;
  equityRange: EquityRange[];
  profilePic?: string;
  totalRaised?: number;
}

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch("/api/admin/startups");
        const json = await res.json();
        setStartups(json.data || []);
      } catch (err) {
        console.error("Failed to load startups", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const filtered = startups.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      s.categoryType.toLowerCase().includes(term) ||
      s.industry.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Startups</h1>
        <p className="text-muted-foreground">Manage all startups</p>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search startups..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 mt-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No startups found
        </p>
      ) : (
        <div className="space-y-4 mt-6">
          {filtered.map((startup) => (
            <Card
              key={startup._id}
              className="flex flex-col sm:flex-row justify-between p-4 hover:shadow-md transition"
            >
              {/* Left */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {startup.profilePic ? (
                    <img
                      src={startup.profilePic}
                      alt={startup.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground font-bold text-xl">
                      {startup.title.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-semibold">{startup.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {startup.description.slice(0, 20)}
                    {startup.description.length > 20 ? "..." : ""}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {startup.badges.map((badge, i) => (
                      <Badge key={i} variant="outline">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">{startup.founders.length}</span>{" "}
                    founders
                  </p>
                  <p>
                    <span className="font-semibold">{startup.investors.length}</span>{" "}
                    investors
                  </p>
                  <p>
                    <span className="font-semibold">{startup.totalRaised || 0}</span>{" "}
                    raised
                  </p>
                </div>
                <div className="text-sm">
                  <p>
                    Rating: <span className="font-semibold">{startup.avgRating.toFixed(1)}</span> ({startup.ratingCount})
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Badge>{startup.categoryType}</Badge>
                <Badge>{startup.industry}</Badge>
                {startup.equityRange.map((eq, idx) => (
                  <Badge key={idx}>
                    {eq.range} - {eq.equity}%
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
