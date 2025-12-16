"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, User, Loader2, Search, Wallet } from "lucide-react";

interface FounderInvestorItem {
  investor: {
    _id: string;
    name?: string;
    userName?: string;
    email?: string;
    profileImage?: string;
  };
  startupsCount: number;
  totalInvested: number;
  investmentsCount: number;
}

export default function InvestorsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<FounderInvestorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const founderId = session?.user?.id;
        if (!founderId) {
          setError("User not authenticated");
          return;
        }
        const res = await fetch(`/api/founder/${founderId}/investors`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(data.data || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load investors");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [session?.user?.id]);

  const filtered = items.filter((i) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    const name = i.investor.name || i.investor.userName || "";
    return name.toLowerCase().includes(term) || (i.investor.email || "").toLowerCase().includes(term);
  });

  const formatCurrency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view investors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investors</h1>
          <p className="text-muted-foreground">Investors engaged with your startups</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search investors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1 ml-4 space-y-2">
                  <div className="h-4 w-56 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-80 bg-muted rounded animate-pulse" />
                </div>
                <div className="w-40 ml-4 space-y-2">
                  <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading investors</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => setLoading(true)}>Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No investors found</h3>
            <p className="text-muted-foreground">No investors are associated with your startups yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div key={item.investor._id} className="flex items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center w-12 h-12 bg-primary/10 rounded-lg justify-center">
                  {item.investor.profileImage ? (
                    <img src={item.investor.profileImage} alt={item.investor.name || item.investor.userName || "Investor"} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-card-foreground">{item.investor.name || item.investor.userName || "Unknown"}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{item.startupsCount} startups</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.investor.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{formatCurrency(item.totalInvested)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.investmentsCount} investments</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
