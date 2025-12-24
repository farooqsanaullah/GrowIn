"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader, Search } from "lucide-react";
import { 
  Card,
  Badge,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import { SkeletonStartups } from "@/components/skeletons/admin/startups";
import { getInitials } from "@/lib/helpers";
import { USER_STATUS_STYLES } from "@/lib/constants/user";

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
        prev.map((s) => (s._id === id ? { ...s, status } : s))
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonStartups key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No startups found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {filtered.map((startup) => (
            <Card key={startup._id} className="relative p-4 hover:shadow-lg transition flex flex-col gap-3">
              
              {/* Profile Image + Category & Industry badges */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                {startup.profilePic ? (
                  <img
                    src={startup.profilePic}
                    alt={startup.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center font-bold text-2xl text-foreground">
                    {getInitials(startup.title)}
                  </div>
                )}

                {/* Top-left: Industry */}
                <Badge className="absolute top-2 left-2 bg-yellow-50 text-yellow-700 rounded-sm px-2 py-1 text-xs shadow-sm">
                  {startup.industry}
                </Badge>

                {/* Top-right: CategoryType */}
                <Badge className="absolute top-2 right-2 bg-blue-50 text-blue-700 rounded-sm px-2 py-1 text-xs shadow-sm">
                  {startup.categoryType}
                </Badge>
              </div>

              {/* Title + Description */}
              <div className="flex flex-col justify-between items-center mt-2">
                <p className="font-semibold text-lg">{startup.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{startup.description}</p>
              </div>

              {/* Status Dropdown + Equity Ranges Dropdown */}
              <div className="flex w-full gap-2 mt-1">
                
                {/* Status */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      className={`w-full flex-1 cursor-pointer capitalize px-3 py-1.5 rounded-sm flex items-center justify-center gap-1 ${USER_STATUS_STYLES[startup.status || "active"]}`}
                    >
                      {updatingId === startup._id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          {startup.status}
                        </>
                      )}
                    </Badge>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center">
                    {["active", "inactive", "pending", "closed"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        className="cursor-pointer capitalize"
                        onClick={() => updateStatus(startup._id, status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Equity */}
                {startup.equityRange.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="default"
                        className="w-full flex-1 cursor-pointer px-3 py-1.5 rounded-sm flex items-center justify-center gap-1"
                      >
                        <ChevronDown className="h-4 w-4" />
                        Equity ({startup.equityRange.length})
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
                  <Badge
                    variant="secondary"
                    className="w-full flex-1 px-3 py-1.5 rounded-sm flex items-center justify-center"
                  >
                    No equity info
                  </Badge>
                )}
              </div>

              {/* Separator */}
              <div className="border-t mt-2 pt-2"></div>

              {/* Founders | Investors | Raised */}
              <div className="flex justify-between text-sm">
                <p>Founders: <span className="font-semibold">{startup.founders.length}</span></p>
                <p>Investors: <span className="font-semibold">{startup.investors.length}</span></p>
                <p>Raised: <span className="font-semibold">{startup.totalRaised || 0}</span></p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
