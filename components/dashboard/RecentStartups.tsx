"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Edit, Eye, MoreHorizontal, Users, Loader2 } from "lucide-react";
import { startupsApi } from '@/lib/api/startups';
import type { Startup } from '@/lib/types/api';
import { useSession } from "next-auth/react";

export function RecentStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const founderId = session?.user?.id;

  useEffect(() => {
    const fetchRecentStartups = async () => {
      try {

        if (!founderId) {
          setLoading(false);
          return;
        }

        const response = await startupsApi.getByFounder(founderId, { limit: 3 });

        if (response.success && response.data) {
          setStartups(response.data);
        } else {
          setError("Failed to fetch startups");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch startups");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStartups();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Recent Startups</h2>
          <p className="text-sm text-muted-foreground">Manage and track your startup projects</p>
        </div>
        <Button asChild size="sm">
          <Link href="/founder/startups/new">
            <Plus className="h-4 w-4 mr-2" />
            New Startup
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading startups...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Building2 className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">No startups found</p>
            <Button asChild size="sm">
              <Link href="/founder/startups/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Startup
              </Link>
            </Button>
          </div>
        ) : (
          startups.map((startup) => (
            <div
              key={startup._id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  {startup.profilePic ? (
                    <img
                      src={startup.profilePic}
                      alt={startup.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-card-foreground truncate">{startup.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status)}`}>
                      {startup.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {startup.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {startup.followers} followers
                    </span>
                    <span>Industry: {startup.industry}</span>
                    <span>Created {new Date(startup.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mr-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/founder/startups/${startup._id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/startup/${startup._id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline" asChild>
          <Link href="/founder/startups">
            View All Startups
          </Link>
        </Button>
      </div>
    </div>
  );
}