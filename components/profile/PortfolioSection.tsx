"use client";

interface Portfolio {
  id: number;
  startupName: string;
  logo: string;
  investedDate: string;
  status: "active" | "exited" | "failed";
  role?: string; // For founders
  investmentAmount?: string; // For investors
  currentValue?: string; // For investors
}

interface PortfolioStats {
  stat1: { value: string | number; label: string; color?: string };
  stat2: { value: string | number; label: string; color?: string };
  stat3: { value: string | number; label: string; color?: string };
  stat4: { value: string | number; label: string; color?: string };
}

interface PortfolioSectionProps {
  portfolioData: Portfolio[];
  portfolioStats: PortfolioStats;
  portfolioType: 'founder' | 'investor';
  portfolioTitle: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

const PortfolioSection = ({ 
  portfolioData, 
  portfolioStats, 
  portfolioType, 
  portfolioTitle,
  colors 
}: PortfolioSectionProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: colors.textPrimary }}>
            {portfolioTitle}
          </h2>
          <div className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary }}>
            {portfolioData.length} {portfolioType === 'founder' ? 'Companies' : 'Investments'}
          </div>
        </div>

                {/* Portfolio Stats */}
        <div className="my-8 py-6" style={{ borderTop: `1px solid ${colors.textMuted}30` }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.bgPrimary + '30' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: portfolioStats.stat1.color || colors.textPrimary }}>
                {portfolioStats.stat1.value}
              </div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                {portfolioStats.stat1.label}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.bgSecondary + '30' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: portfolioStats.stat2.color || colors.textPrimary }}>
                {portfolioStats.stat2.value}
              </div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                {portfolioStats.stat2.label}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#10b98130' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: portfolioStats.stat3.color || '#10b981' }}>
                {portfolioStats.stat3.value}
              </div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                {portfolioStats.stat3.label}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.textMuted + '20' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: portfolioStats.stat4.color || colors.textPrimary }}>
                {portfolioStats.stat4.value}
              </div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                {portfolioStats.stat4.label}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {portfolioData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {portfolioType === 'founder' ? '🚀' : '💼'}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
                {portfolioType === 'founder' ? 'No Companies Yet' : 'No Investments Yet'}
              </h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                {portfolioType === 'founder' 
                  ? 'This founder hasn\'t started any companies yet.' 
                  : 'This investor hasn\'t made any investments yet.'
                }
              </p>
            </div>
          ) : (
            portfolioData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 lg:p-6 rounded-xl border hover:shadow-md transition-all duration-300 cursor-pointer group"
              style={{ borderColor: colors.textMuted + '20' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.textSecondary;
                e.currentTarget.style.backgroundColor = colors.bgPrimary + '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.textMuted + '20';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.logo}
                  alt={item.startupName}
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl object-cover"
                  style={{ boxShadow: `0 4px 12px ${colors.textMuted}20` }}
                />
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {item.startupName}
                  </h3>
                  
                  {portfolioType === 'founder' && item.role && (
                    <>
                      <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                        {item.role}
                      </p>
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        Started {item.investedDate}
                      </p>
                    </>
                  )}
                  
                  {portfolioType === 'investor' && (
                    <>
                      <div className="flex items-center gap-4 mb-1">
                        <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                          {item.investmentAmount}
                        </span>
                        {item.currentValue && (
                          <span className="text-sm font-medium" style={{ color: '#10b981' }}>
                            → {item.currentValue}
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        Invested {item.investedDate}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <span className="text-sm">🚀</span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: '#10b981' }}
                  >
                    Active
                  </span>
                </div>
                <button
                  className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100"
                  style={{
                    backgroundColor: colors.textPrimary,
                    color: 'white'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
          )}
        </div>


      </div>
    </div>
  );
};

export default PortfolioSection;