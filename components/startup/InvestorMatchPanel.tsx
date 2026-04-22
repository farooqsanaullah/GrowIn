"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, TrendingUp, MapPin, CheckCircle } from "lucide-react";

interface MatchedInvestor {
  investorId: string;
  userName: string;
  name?: string;
  bio?: string;
  city?: string;
  country?: string;
  fundingRange?: {
    min?: number;
    max?: number;
  };
  isVerified: boolean;
  profileImage?: string;
  similarity: number;
  reasons: string[];
}

interface InvestorMatchPanelProps {
  startupId: string;
  onClose: () => void;
  onGenerateOutreach: (investorId: string, investorName: string) => void;
}

const InvestorMatchPanel: React.FC<InvestorMatchPanelProps> = ({
  startupId,
  onClose,
  onGenerateOutreach,
}) => {
  const [matches, setMatches] = useState<MatchedInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, [startupId]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, topK: 5 }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch matches");
      }

      setMatches(data.data.results || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-700 bg-green-100 border border-green-200";
    if (score >= 50) return "text-blue-700 bg-blue-100 border border-blue-200";
    return "text-gray-700 bg-gray-100 border border-gray-200";
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div 
          className="text-white p-6 flex items-center justify-between"
          style={{ 
            background: `linear-gradient(135deg, var(--text-primary), var(--text-secondary))` 
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">AI Investor Matches</h2>
              <p className="text-sm opacity-90">
                Top investors matched to your startup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderBottomColor: 'var(--text-primary)' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Finding your best matches...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchMatches}
                className="mt-3 px-4 py-2 text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No matches found</p>
              <p className="text-sm text-gray-400">
                Try adding more details to your startup profile
              </p>
            </div>
          )}

          {!loading && !error && matches.length > 0 && (
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <div
                  key={match.investorId}
                  className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={match.profileImage || "/fallback-avatar.png"}
                        alt={match.name || match.userName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      {match.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {match.name || match.userName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{match.userName}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full font-semibold text-sm ${getScoreColor(
                            match.similarity
                          )}`}
                        >
                          {Math.round(match.similarity)}% match
                        </div>
                      </div>

                      {/* Bio */}
                      {match.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {match.bio}
                        </p>
                      )}

                      {/* Reasons */}
                      <div className="space-y-1 mb-3">
                        {match.reasons.map((reason, rIdx) => (
                          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <TrendingUp 
                              className="w-4 h-4 flex-shrink-0" 
                              style={{ color: 'var(--text-primary)' }}
                            />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      {/* Location and Funding */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        {(match.city || match.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {[match.city, match.country]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                        {match.fundingRange && (
                          <div className="flex items-center gap-1">
                            <span>💰</span>
                            <span>
                              {match.fundingRange.min &&
                              match.fundingRange.max
                                ? `${formatAmount(
                                    match.fundingRange.min
                                  )} - ${formatAmount(match.fundingRange.max)}`
                                : match.fundingRange.min
                                ? `${formatAmount(match.fundingRange.min)}+`
                                : match.fundingRange.max
                                ? `Up to ${formatAmount(
                                    match.fundingRange.max
                                  )}`
                                : "Range not specified"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() =>
                          onGenerateOutreach(
                            match.investorId,
                            match.name || match.userName
                          )
                        }
                        className="w-full text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, var(--text-primary), var(--text-secondary))`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 38, 61, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Outreach
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorMatchPanel;
