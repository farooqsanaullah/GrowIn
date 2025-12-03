"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  DollarSign, 
  Building2, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Calendar,
  Globe,
  Linkedin,
  Twitter,
  Github,
  ExternalLink,
  ArrowLeft,
  Loader2,
  User as UserIcon,
  BarChart3,
  PieChart,
  Star
} from "lucide-react";
import Link from "next/link";
import { investorsApi } from "@/lib/api/investors";
import type { InvestorProfile } from "@/lib/api/investors";

export default function InvestorProfilePage() {
  const params = useParams();
  const investorId = params.id as string;
  
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await investorsApi.getById(investorId);
        
        if (response.success && response.data) {
          setProfile(response.data);
        } else {
          setError(response.message || "Failed to fetch investor profile");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch investor profile");
      } finally {
        setLoading(false);
      }
    };

    if (investorId) {
      fetchProfile();
    }
  }, [investorId]);

  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const formatFundingRange = (fundingRange?: { min?: number; max?: number }) => {
    if (!fundingRange) return "Range not specified";
    const { min, max } = fundingRange;
    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    } else if (min) {
      return `${formatAmount(min)}+`;
    } else if (max) {
      return `Up to ${formatAmount(max)}`;
    }
    return "Range not specified";
  };

  const getROIColor = (roi: number) => {
    if (roi > 0) return "text-green-600";
    if (roi < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading investor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/explore-investors" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Investors
          </Link>
        </Button>
        <div className="text-center py-16">
          <UserIcon className="h-16 w-16 mx-auto mb-6 text-destructive" />
          <h2 className="text-xl font-bold mb-4 text-foreground">Profile not found</h2>
          <p className="text-muted-foreground mb-6">{error || "The investor profile you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/explore-investors">Explore Other Investors</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { investor, stats, portfolio, insights } = profile;

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Button variant="ghost" asChild>
        <Link href="/explore-investors" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Investors
        </Link>
      </Button>

      {/* Header Section */}
      <Card className="p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Image and Basic Info */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative mb-4">
              <img
                src={investor.profileImage || "/fallback-avatar.png"}
                alt={`${investor.name || investor.userName} avatar`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {investor.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            
            {investor.isVerified && (
              <Badge variant="outline" className="text-green-600 border-green-200 mb-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Investor
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {investor.name || investor.userName}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">@{investor.userName}</p>
            
            {investor.bio && (
              <p className="text-foreground mb-6 leading-relaxed">
                {investor.bio}
              </p>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">{stats.totalInvestments}</div>
                <div className="text-sm text-muted-foreground">Investments</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">{formatAmount(stats.totalInvested)}</div>
                <div className="text-sm text-muted-foreground">Total Invested</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">{stats.activeInvestments}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">{stats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              {(investor.city || investor.country) && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {investor.city && investor.country 
                      ? `${investor.city}, ${investor.country}`
                      : investor.city || investor.country
                    }
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{formatFundingRange(investor.fundingRange)}</span>
              </div>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(investor.joinedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}</span>
              </div>

              {/* Social Links */}
              {investor.socialLinks && (
                <div className="flex items-center space-x-3 mt-4">
                  {investor.socialLinks.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={investor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {investor.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={investor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {investor.socialLinks.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={investor.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {investor.socialLinks.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={investor.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground">Portfolio Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Value:</span>
              <span className="font-semibold">{formatAmount(stats.totalCurrentValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total ROI:</span>
              <span className={`font-semibold ${getROIColor(stats.totalROI)}`}>
                {stats.totalROI > 0 ? '+' : ''}{stats.totalROI.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Investment:</span>
              <span className="font-semibold">{formatAmount(stats.avgInvestment)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground">Diversification</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Industries:</span>
              <span className="font-semibold">{stats.industries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Categories:</span>
              <span className="font-semibold">{stats.categories}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Startups:</span>
              <span className="font-semibold">{stats.activeInvestments}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-foreground">Investment Focus</h3>
          </div>
          <div className="space-y-2">
            {insights.favoriteIndustries.slice(0, 3).map((industry, index) => (
              <Badge key={industry} variant="outline" className="text-xs">
                {industry}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Portfolio */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Investment Portfolio
        </h2>
        
        {portfolio.length > 0 ? (
          <div className="space-y-4">
            {portfolio.slice(0, 10).map((investment) => (
              <div key={investment.investmentId} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    {investment.startupLogo ? (
                      <img
                        src={investment.startupLogo}
                        alt={investment.startupTitle}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 truncate">
                      {investment.startupTitle}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {investment.category}
                      </Badge>
                      <span>•</span>
                      <span>{investment.industry}</span>
                      {investment.rating > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                            <span>{investment.rating.toFixed(1)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    {formatAmount(investment.investmentAmount)}
                  </div>
                  <div className={`text-sm ${getROIColor(investment.roi)}`}>
                    {investment.roi > 0 ? '+' : ''}{investment.roi.toFixed(1)}% ROI
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {investment.monthsInvested} months ago
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" asChild className="ml-4">
                  <Link href={`/startup/${investment.startupId}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
            
            {portfolio.length > 10 && (
              <div className="text-center py-4">
                <span className="text-sm text-muted-foreground">
                  Showing 10 of {portfolio.length} investments
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No public investment information available</p>
          </div>
        )}
      </Card>

      {/* Contact Section */}
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-4">Interested in connecting?</h2>
        <p className="text-muted-foreground mb-6">
          Reach out to {investor.name || investor.userName} through their social links or professional networks.
        </p>
        <div className="flex justify-center space-x-3">
          {investor.socialLinks?.linkedin && (
            <Button asChild>
              <a href={investor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 mr-2" />
                Connect on LinkedIn
              </a>
            </Button>
          )}
          {investor.socialLinks?.website && (
            <Button variant="outline" asChild>
              <a href={investor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}