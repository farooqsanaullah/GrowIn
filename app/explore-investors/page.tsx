"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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
    MapPin,
    DollarSign,
    Users,
    CheckCircle,
    Loader2,
    User
} from "lucide-react";
import InvestorCard from "@/components/explore/InvestorCard";
import { investorsApi } from "@/lib/api/investors";
import type { Investor, InvestorFilters } from "@/lib/api/investors";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";

export default function ExploreInvestorsPage() {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCity, setFilterCity] = useState<string>("all");
    const [filterCountry, setFilterCountry] = useState<string>("all");
    const [filterFundingRange, setFilterFundingRange] = useState<string>("all");
    const [filterVerified, setFilterVerified] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter options
    const [cities, setCities] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

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
                sortBy: sortBy as InvestorFilters['sortBy'],
            };

            // Handle funding range filter
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
                    if (range.min) filters.minFunding = range.min;
                    if (range.max) filters.maxFunding = range.max;
                }
            }

            const response = await investorsApi.getAll(filters);

            if (response.success && response.data) {
                setInvestors(response.data.investors);
                setTotalPages(response.data.pagination.pages);

                // Set filter options
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

    useEffect(() => {
        fetchInvestors();
    }, [searchTerm, filterCity, filterCountry, filterFundingRange, filterVerified, sortBy, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterCity("all");
        setFilterCountry("all");
        setFilterFundingRange("all");
        setFilterVerified("all");
        setSortBy("recent");
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm ||
        filterCity !== "all" ||
        filterCountry !== "all" ||
        filterFundingRange !== "all" ||
        filterVerified !== "all" ||
        sortBy !== "recent";

    if (loading) {
        return (
            <div>
                <Header />
                <div className="space-y-6 container mx-auto px-4 pt-38 pb-12">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Explore Investors</h1>
                            <p className="text-muted-foreground">Connect with investors looking for promising startups</p>
                        </div>
                    </div>
                    <div className="text-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Finding great investors for you...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Explore Investors</h1>
                        <p className="text-muted-foreground">Connect with investors looking for promising startups</p>
                    </div>
                </div>
                <div className="text-center py-16">
                    <User className="h-16 w-16 mx-auto mb-6 text-destructive" />
                    <h2 className="text-xl font-bold mb-4 text-foreground">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button onClick={fetchInvestors}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="space-y-6 container mx-auto px-4 pt-38 pb-12">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Explore Investors</h1>
                        <p className="text-muted-foreground">Connect with {investors.length > 0 ? `${investors.length} active` : ''} investors looking for promising startups</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="p-6">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search investors by name, username, or bio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">Filters:</span>
                            </div>

                            {/* City Filter */}
                            <Select value={filterCity} onValueChange={setFilterCity}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map(city => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Country Filter */}
                            <Select value={filterCountry} onValueChange={setFilterCountry}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    {countries.map(country => (
                                        <SelectItem key={country} value={country}>{country}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Funding Range Filter */}
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

                            {/* Verification Filter */}
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

                            {/* Sort */}
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

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters} size="sm">
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Results */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {investors.map((investor) => (
                        <InvestorCard key={investor._id} investor={investor} />
                    ))}
                </div>

                {/* Empty State */}
                {investors.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <User className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-4 text-foreground">No investors found</h2>
                        <p className="text-muted-foreground mb-6">
                            {hasActiveFilters
                                ? "Try adjusting your filters or search terms"
                                : "No investors are available at the moment"}
                        </p>
                        {hasActiveFilters && (
                            <Button onClick={clearFilters}>Clear All Filters</Button>
                        )}
                    </div>
                ) : investors.length > 0 && (
                    /* Pagination */
                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>

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
                )}
            </div>
            <Footer />
        </div>
    );
}