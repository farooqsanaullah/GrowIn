"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader, Search } from "lucide-react";
import { 
  Card,
  Badge,
  Input,
  Skeleton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";


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
  followers: number;
  status: string;
  ratingCount: number;
  avgRating: number;
  equityRange: EquityRange[];
  profilePic?: string;
  totalRaised?: number;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-300",
  inactive: "bg-gray-100 text-gray-700 border-gray-300",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
  closed: "bg-red-50 text-red-700 border-red-300",
};

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);

      await fetch(`/api/admin/startups/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setStartups((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status } : s
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

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
              <div className="flex flex-col gap-2">
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

                <div className="flex gap-2">
                  <Badge 
                    variant="outline" 
                    className="px-2 py-1.5 rounded-sm border-blue-400 bg-blue-50 text-blue-600"
                  >{startup.categoryType}</Badge>
                  <Badge 
                    variant="outline" 
                    className="px-2 py-1.5 rounded-sm border-yellow-400 bg-yellow-50 text-yellow-600"
                  >{startup.industry}</Badge>
                  <p>
                    Rating: <span className="text-sm font-semibold">{startup.avgRating.toFixed(1)}</span> ({startup.ratingCount})
                  </p>
                </div>
              </div>

              {/* Middle */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">{startup.founders.length}</span>{" "}
                    Founders
                  </p>
                  <p>
                    <span className="font-semibold">{startup.investors.length}</span>{" "}
                    Investors
                  </p>
                  <p>
                    <span className="font-semibold">{startup.totalRaised || 0}</span>{" "}
                    Raised
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 px-4 py-8 mt-2 sm:mt-0">
                {/* Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant="outline"
                      className={`cursor-pointer capitalize px-3 py-1.5 rounded-sm ${statusStyles[startup.status || "active"]}`}
                    >
                      {updatingId === startup._id ? (
                        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        startup.status
                      )}
                    </Badge>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center">
                    {["active", "inactive", "pending", "closed"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        className="capitalize cursor-pointer"
                        onClick={() => updateStatus(startup._id, status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Equity Dropdown */}
                {startup.equityRange.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="default"
                        className="cursor-pointer px-3 py-1.5 rounded-sm flex items-center"
                      >
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Equity Ranges ({startup.equityRange.length})
                      </Badge>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center" className="w-48">
                      {startup.equityRange.map((eq, idx) => (
                        <DropdownMenuItem key={idx} className="flex justify-between">
                          <span>{eq.range}</span>
                          <span className="font-semibold">{eq.equity}%</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Badge variant="secondary">No equity info</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
