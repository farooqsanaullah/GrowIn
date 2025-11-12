"use client";

const HowToInvest = () => {
  const colors = {
    bgPrimary: '#D6F6FE',
    bgSecondary: '#FEE8BD',
    textPrimary: '#16263d',
    textSecondary: '#65728d',
    textMuted: '#657da8'
  };

  const investmentSteps = [
    {
      id: 1,
      icon: '📝',
      title: 'Create Account',
      description: 'Sign up and complete your investor profile in just 2 minutes'
    },
    {
      id: 2,
      icon: '🔍',
      title: 'Browse Startups',
      description: 'Explore verified startups across different industries and stages'
    },
    {
      id: 3,
      icon: '📊',
      title: 'Analyze & Compare',
      description: 'Review metrics, team info, and growth potential with AI insights'
    },
    {
      id: 4,
      icon: '💰',
      title: 'Invest Securely',
      description: 'Start investing from $100 with secure payment processing'
    }
  ];

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
            How to Start Investing
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Get started with startup investing in just four simple steps. No complex procedures, just straightforward investment opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {investmentSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div 
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 relative"
                style={{ borderColor: colors.textMuted + '30' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.textPrimary;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${colors.textPrimary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.textMuted + '30';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                     style={{ backgroundColor: colors.textPrimary }}>
                  {step.id}
                </div>
                
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                    {step.title}
                  </h3>
                  <p className="text-sm lg:text-base leading-relaxed" style={{ color: colors.textMuted }}>
                    {step.description}
                  </p>
                </div>
              </div>

              {index < investmentSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <div className="w-12 h-0.5" style={{ backgroundColor: colors.textSecondary }}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-2 border-b-2 border-transparent"
                         style={{ borderLeftColor: colors.textSecondary }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            className="px-8 py-4 font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-lg"
            style={{ 
              backgroundColor: colors.textPrimary,
              boxShadow: '0 10px 25px rgba(22, 38, 61, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.textSecondary;
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(22, 38, 61, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.textPrimary;
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(22, 38, 61, 0.25)';
            }}
          >
            Start Your Investment Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowToInvest;