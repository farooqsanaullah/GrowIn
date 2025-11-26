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
  TrendingUp,
  MapPin,
  Calendar,
  Heart,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface DiscoverStartup {
  id: string;
  name: string;
  description: string;
  category: string;
  stage: string;
  location: string;
  foundedYear: number;
  founderName: string;
  seekingAmount: number;
  raisedAmount: number;
  followers: number;
  rating: number;
  tags: string[];
  logo?: string;
  isBookmarked: boolean;
}

export default function DiscoverPage() {
  const [startups, setStartups] = useState<DiscoverStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [sortBy, setSortBy] = useState("trending");

  useEffect(() => {
    const fetchStartups = async () => {
      try {

        const mockStartups: DiscoverStartup[] = [
          {
            id: "s1",
            name: "GreenCharge",
            description: "Solar-powered charging stations for electric vehicles in urban areas",
            category: "Clean Energy",
            stage: "Seed",
            location: "San Francisco, CA",
            foundedYear: 2023,
            founderName: "Emma Davis",
            seekingAmount: 500000,
            raisedAmount: 150000,
            followers: 1250,
            rating: 4.8,
            tags: ["Sustainable", "EV", "Urban Tech"],
            isBookmarked: false,
          },
          {
            id: "s2",
            name: "MindfulAI",
            description: "AI-powered mental health support platform with personalized therapy sessions",
            category: "Healthcare",
            stage: "Pre-Seed",
            location: "Austin, TX",
            foundedYear: 2024,
            founderName: "Dr. Ryan Kim",
            seekingAmount: 250000,
            raisedAmount: 75000,
            followers: 890,
            rating: 4.6,
            tags: ["Mental Health", "AI", "Therapy"],
            isBookmarked: true,
          },
          {
            id: "s3",
            name: "CropOptimizer",
            description: "Machine learning platform for optimizing crop yields using satellite data",
            category: "AgTech",
            stage: "Series A",
            location: "Denver, CO",
            foundedYear: 2022,
            founderName: "Carlos Rodriguez",
            seekingAmount: 2000000,
            raisedAmount: 800000,
            followers: 2100,
            rating: 4.9,
            tags: ["ML", "Agriculture", "Satellite"],
            isBookmarked: false,
          },
          {
            id: "s4",
            name: "EduMetaverse",
            description: "Virtual reality platform for immersive educational experiences",
            category: "EdTech",
            stage: "Seed",
            location: "Seattle, WA",
            foundedYear: 2023,
            founderName: "Sarah Williams",
            seekingAmount: 750000,
            raisedAmount: 300000,
            followers: 1650,
            rating: 4.7,
            tags: ["VR", "Education", "Immersive"],
            isBookmarked: true,
          },
          {
            id: "s5",
            name: "WaterSense",
            description: "IoT sensors for real-time water quality monitoring in residential buildings",
            category: "PropTech",
            stage: "Pre-Seed",
            location: "Miami, FL",
            foundedYear: 2024,
            founderName: "Miguel Santos",
            seekingAmount: 300000,
            raisedAmount: 50000,
            followers: 420,
            rating: 4.4,
            tags: ["IoT", "Water", "Sensors"],
            isBookmarked: false,
          },
          {
            id: "s6",
            name: "RetailBot",
            description: "AI-powered customer service automation for e-commerce platforms",
            category: "E-commerce",
            stage: "Seed",
            location: "New York, NY",
            foundedYear: 2023,
            founderName: "Lisa Chen",
            seekingAmount: 600000,
            raisedAmount: 200000,
            followers: 980,
            rating: 4.5,
            tags: ["AI", "Customer Service", "Automation"],
            isBookmarked: false,
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 1000));
        setStartups(mockStartups);
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const categories = [...new Set(startups.map(startup => startup.category))];
  const stages = [...new Set(startups.map(startup => startup.stage))];

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || startup.category === filterCategory;
    const matchesStage = filterStage === "all" || startup.stage === filterStage;
    return matchesSearch && matchesCategory && matchesStage;
  });

  const sortedStartups = [...filteredStartups].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return b.followers - a.followers;
      case "rating":
        return b.rating - a.rating;
      case "recent":
        return b.foundedYear - a.foundedYear;
      case "funding":
        return (b.seekingAmount - b.raisedAmount) - (a.seekingAmount - a.raisedAmount);
      default:
        return 0;
    }
  });

  const toggleBookmark = (startupId: string) => {
    setStartups(prev => prev.map(startup => 
      startup.id === startupId 
        ? { ...startup, isBookmarked: !startup.isBookmarked }
        : startup
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Discover Startups</h1>
        <p className="text-muted-foreground">
          Find promising startups to add to your investment portfolio.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search startups, categories, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(stage => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="funding">Funding Need</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Startup Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedStartups.map((startup) => {
          const fundingProgress = (startup.raisedAmount / startup.seekingAmount) * 100;
          
          return (
            <Card key={startup.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-foreground">{startup.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(startup.id)}
                        className="h-6 w-6"
                      >
                        <Heart className={`h-4 w-4 ${startup.isBookmarked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {startup.stage}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {startup.category}
                      </Badge>
                    </div>
                  </div>
                  <Link href={`/startup/${startup.id}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {startup.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {startup.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Funding Progress</span>
                    <span className="font-medium">
                      ${startup.raisedAmount.toLocaleString()} / ${startup.seekingAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{startup.followers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{startup.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Founder: {startup.founderName}</span>
                    <span>Founded {startup.foundedYear}</span>
                  </div>
                  <Button className="w-full" size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Invest Now
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sortedStartups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No startups found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}