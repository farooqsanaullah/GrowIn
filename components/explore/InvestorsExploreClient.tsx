"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, User } from "lucide-react";
import InvestorCard from "@/components/explore/InvestorCard";
import { investorsApi, type Investor, type InvestorFilters } from "@/lib/api/investors";

interface InvestorsExploreClientProps {
  initialInvestors: Investor[];
  initialCities: string[];
  initialCountries: string[];
  initialTotalPages: number;
}

export default function InvestorsExploreClient({
  initialInvestors,
  initialCities,
  initialCountries,
  initialTotalPages,
}: InvestorsExploreClientProps) {
  const [investors, setInvestors] = useState<Investor[]>(initialInvestors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterFundingRange, setFilterFundingRange] = useState<string>("all");
  const [filterVerified, setFilterVerified] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);

  const [cities, setCities] = useState<string[]>(initialCities || []);
  const [countries, setCountries] = useState<string[]>(initialCountries || []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(searchTerm) ||
      filterCity !== "all" ||
      filterCountry !== "all" ||
      filterFundingRange !== "all" ||
      filterVerified !== "all" ||
      sortBy !== "recent",
    [searchTerm, filterCity, filterCountry, filterFundingRange, filterVerified, sortBy]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCity("all");
    setFilterCountry("all");
    setFilterFundingRange("all");
    setFilterVerified("all");
    setSortBy("recent");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters: InvestorFilters = {
          page: currentPage,
          limit: 12,
          ...(searchTerm && { search: searchTerm }),
          ...(filterCity !== "all" && { city: filterCity }),
          ...(filterCountry !== "all" && { country: filterCountry }),
          ...(filterVerified !== "all" && { isVerified: filterVerified }),
          sortBy: sortBy as InvestorFilters["sortBy"],
        };

        if (filterFundingRange !== "all") {
          const ranges: Record<string, { min?: number; max?: number }> = {
            "0-10000": { min: 0, max: 10000 },
            "10000-50000": { min: 10000, max: 50000 },
            "50000-100000": { min: 50000, max: 100000 },
            "100000-500000": { min: 100000, max: 500000 },
            "500000+": { min: 500000 },
          };
          const range = ranges[filterFundingRange];
          if (range) {
            if (range.min !== undefined) (filters as any).minFunding = range.min;
            if (range.max !== undefined) (filters as any).maxFunding = range.max;
          }
        }

        const response = await investorsApi.getAll(filters);
        if (response.success && response.data) {
          setInvestors(response.data.investors);
          setTotalPages(response.data.pagination.pages);
          if (response.data.filters) {
            setCities(response.data.filters.cities);
            setCountries(response.data.filters.countries);
          }
        } else {
          setInvestors([]);
          setError(response.message || "Failed to fetch investors");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch investors");
        setInvestors([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when a user changes filters/pagination from initial SSR defaults
    fetchInvestors();
  }, [searchTerm, filterCity, filterCountry, filterFundingRange, filterVerified, sortBy, currentPage]);

  const showSkeleton = loading && investors.length === 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search investors by name, username, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterFundingRange} onValueChange={setFilterFundingRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Investment Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="0-10000">$0 - $10K</SelectItem>
                <SelectItem value="10000-50000">$10K - $50K</SelectItem>
                <SelectItem value="50000-100000">$50K - $100K</SelectItem>
                <SelectItem value="100000-500000">$100K - $500K</SelectItem>
                <SelectItem value="500000+">$500K+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterVerified} onValueChange={setFilterVerified}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Investors</SelectItem>
                <SelectItem value="true">Verified Only</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="funding_high">Highest Funding</SelectItem>
                <SelectItem value="funding_low">Lowest Funding</SelectItem>
                <SelectItem value="verified">Verified First</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showSkeleton
          ? [...Array(12)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                </div>
              </Card>
            ))
          : investors.map((investor) => (
              <InvestorCard key={investor._id} investor={investor} />
            ))}
      </div>

      {investors.length === 0 && !loading ? (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-foreground">No investors found</h2>
          <p className="text-muted-foreground mb-6">
            {hasActiveFilters
              ? "Try adjusting your filters or search terms"
              : "No investors are available at the moment"}
          </p>
          {hasActiveFilters && <Button onClick={clearFilters}>Clear All Filters</Button>}
        </div>
      ) : (
        investors.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="min-w-[2.5rem]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
