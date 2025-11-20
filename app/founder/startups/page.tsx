"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startupsApi } from "@/lib/api/startups";
import type { Startup } from "@/types/api";
import { 
  Building2, 
  Plus, 
  Search,
  Edit, 
  Eye, 
  Trash2, 
  Users,
  Loader2
} from "lucide-react";

const STATIC_FOUNDER_ID = "673615f87cdf80bbbb5d7cd7";

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStartups, setTotalStartups] = useState(0);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { categoryType: categoryFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await startupsApi.getByFounder(STATIC_FOUNDER_ID, {
        page: filters.page,
        limit: filters.limit,
      });

      if (response.success && response.data) {
        let filteredStartups = response.data;

        // Apply client-side filtering for status and category since the API endpoint doesn't support these filters
        if (statusFilter !== "all") {
          filteredStartups = filteredStartups.filter(startup => startup.status === statusFilter);
        }
        if (categoryFilter !== "all") {
          filteredStartups = filteredStartups.filter(startup => startup.categoryType === categoryFilter);
        }
        if (searchTerm) {
          filteredStartups = filteredStartups.filter(startup => 
            startup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            startup.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setStartups(filteredStartups);
        setTotalStartups(response.pagination?.total || filteredStartups.length);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch startups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [currentPage, statusFilter, categoryFilter, searchTerm]);

  const handleDelete = async (startupId: string) => {
    if (window.confirm("Are you sure you want t deloete this startup?")) {
      try {
        await startupsApi.delete(startupId);
        fetchStartups(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete startup");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "closed":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Startups</h1>
          <p className="text-muted-foreground">Manage and track all your startup projects</p>
        </div>
        <Button asChild>
          <Link href="/founder/startups/new">
            <Plus className="h-4 w-4 mr-2" />
            New Startup
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="B2B">B2B</SelectItem>
                <SelectItem value="B2C">B2C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading startups...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">Error loading startups</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchStartups}>
                Try Again
              </Button>
            </div>
          ) : startups.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No startups found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first startup"
                }
              </p>
              {(!searchTerm && statusFilter === "all" && categoryFilter === "all") && (
                <Button asChild>
                  <Link href="/founder/startups/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Startup
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            startups.map((startup) => (
              <div
                key={startup._id}
                className="flex items-center p-4 bg-muted/30 flex-col sm:flex-row rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    {startup.profilePic ? (
                      
                      <img 
                        src={startup.profilePic} 
                        alt={startup.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-card-foreground">{startup.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status)}`}>
                        {startup.status}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {startup.categoryType}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {startup.description}
                    </p>
                    <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {startup.followers} followers
                      </span>
                      <span>Industry: {startup.industry}</span>
                      <span>Rating: {startup.avgRating}/5 ({startup.ratingCount} reviews)</span>
                      <span>Created {new Date(startup.createdAt).toLocaleDateString()}</span>
                    </div>
                    {startup.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {startup.badges.slice(0, 3).map((badge, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-secondary/50 text-secondary-foreground"
                          >
                            {badge}
                          </span>
                        ))}
                        {startup.badges.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{startup.badges.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center  space-x-2 space-y-2 sm:space-y-0 my-auto">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/startup/${startup._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/founder/startups/${startup._id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(startup._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div> 
              </div>
            ))
          )}
        </div>

        {startups.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {startups.length} of {totalStartups} startups
            </p>
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
    </div>
  );
}