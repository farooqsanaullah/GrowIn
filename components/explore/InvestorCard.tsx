"use client";
import React from "react";
import Link from "next/link";
import { MapPin, DollarSign, Building2, CheckCircle, User, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Investor } from "@/lib/api/investors";

interface InvestorCardProps {
  investor: Investor;
}

const colors = {
  bgPrimary: "#D6F6FE",
  bgSecondary: "#FEE8BD",
  textPrimary: "#16263d",
  textSecondary: "#65728d",
  textMuted: "#657da8",
};

const InvestorCard: React.FC<InvestorCardProps> = ({ investor }) => {
  const profileImage = investor.profileImage || "/fallback-avatar.png";
  
  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const formatFundingRange = () => {
    if (!investor.fundingRange) return "Range not specified";
    const { min, max } = investor.fundingRange;
    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    } else if (min) {
      return `${formatAmount(min)}+`;
    } else if (max) {
      return `Up to ${formatAmount(max)}`;
    }
    return "Range not specified";
  };

  const joinedDate = new Date(investor.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });

  return (
    <div
      className="relative bg-white shadow-md overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg rounded-xl border border-gray-100"
      style={{ color: colors.textPrimary }}
    >
      {/* Header with profile image and verification */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={profileImage}
                alt={`${investor.name || investor.userName} avatar`}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              {investor.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {investor.name || investor.userName}
              </h3>
              <p className="text-sm text-muted-foreground">@{investor.userName}</p>
              {investor.isVerified && (
                <Badge variant="outline" className="text-xs mt-1 text-green-600 border-green-200">
                  Verified Investor
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 pb-4">
        <p
          className="text-sm line-clamp-3 leading-relaxed"
          style={{ color: colors.textMuted }}
        >
          {investor.bio || "Professional investor looking for promising opportunities to support innovative startups."}
        </p>
      </div>

      {/* Stats section */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center text-primary mb-1">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="text-lg font-semibold text-foreground">
              {investor.investmentStats.totalInvestments}
            </div>
            <div className="text-xs text-muted-foreground">Investments</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center text-primary mb-1">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-lg font-semibold text-foreground">
              {formatAmount(investor.investmentStats.totalInvested)}
            </div>
            <div className="text-xs text-muted-foreground">Total Invested</div>
          </div>
        </div>
      </div>

      {/* Location and funding range */}
      <div className="px-6 pb-4 space-y-2">
        {(investor.city || investor.country) && (
          <div className="flex items-center space-x-2 text-sm" style={{ color: colors.textSecondary }}>
            <MapPin className="h-4 w-4" />
            <span>
              {investor.city && investor.country 
                ? `${investor.city}, ${investor.country}`
                : investor.city || investor.country
              }
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm" style={{ color: colors.textSecondary }}>
          <DollarSign className="h-4 w-4" />
          <span>{formatFundingRange()}</span>
        </div>
      </div>

      {/* Average investment */}
      {investor.investmentStats.avgInvestment > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg. Investment:</span>
            <span className="font-semibold text-foreground">
              {formatAmount(investor.investmentStats.avgInvestment)}
            </span>
          </div>
        </div>
      )}

      {/* Footer with joined date and action button */}
      <div className="mt-auto px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Joined {joinedDate}
          </div>
        </div>
        
        <Button 
          asChild 
          className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href={`/user/investor/${investor._id}`}>
            <Users className="h-4 w-4 mr-2" />
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InvestorCard;