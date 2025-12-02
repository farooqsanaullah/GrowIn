"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter,
  Star,
  Users,
  DollarSign,
  ExternalLink,
  Loader2,
  Building2
} from "lucide-react";
import Link from "next/link";
import { startupsApi } from "@/lib/helpers/api/startups";
import type { Startup, StartupFilters } from "@/lib/types/api";

export default function DiscoverPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: StartupFilters = {
        page: currentPage,
        limit: 12,
        ...(filterCategory !== "all" && { categoryType: filterCategory }),
        ...(filterIndustry !== "all" && { industry: filterIndustry }),
        ...(searchTerm && { search: searchTerm }),
        status: "active",
      };

      const response = await startupsApi.getAll(filters);
      
      if (response.success && response.data) {
        setStartups(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setStartups([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch startups");
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [searchTerm, filterCategory, filterIndustry, currentPage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Discover Startups</h1>
            <p className="text-muted-foreground">Find and invest in promising startups</p>
          </div>
        </div>
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Finding amazing startups for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Discover Startups</h1>
            <p className="text-muted-foreground">Find and invest in promising startups</p>
          </div>
        </div>
        <div className="text-center py-16">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-destructive" />
          <h2 className="text-2xl font-bold mb-4">Error loading startups</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchStartups}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Discover Startups</h1>
        <p className="text-muted-foreground">Find promising startups to add to your investment portfolio.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search startups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="B2C">B2C</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <Card key={startup._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    {startup.profilePic ? (
                      <img
                        src={startup.profilePic}
                        alt={startup.title}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">{startup.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{startup.status}</Badge>
                    <Badge variant="secondary" className="text-xs">{startup.categoryType}</Badge>
                  </div>
                </div>
                <Link href={`/startup/${startup._id}`}>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{startup.description}</p>

              {startup.badges.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {startup.badges.slice(0, 3).map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{badge}</Badge>
                  ))}
                  {startup.badges.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{startup.badges.length - 3} more</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{startup.followers.length}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{startup.avgRating.toFixed(1)}</span>
                  </div>
                </div>
                <span className="text-xs">Industry: {startup.industry}</span>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Founded: {new Date(startup.createdAt).getFullYear()}</span>
                  <span>{startup.ratingCount} reviews</span>
                </div>
                <Button className="w-full" size="sm" asChild>
                  <Link href={`/startup/${startup._id}`}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {startups.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">No startups found</h2>
          <p className="text-muted-foreground">
            {searchTerm || filterCategory !== "all" || filterIndustry !== "all"
              ? "Try adjusting your filters or search terms"
              : "No active startups are available at the moment"}
          </p>
        </div>
      ) : startups.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Showing {startups.length} startups</p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}