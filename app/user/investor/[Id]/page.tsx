import Footer from "@/components/landingpage/Footer";
import Header from "@/components/landingpage/Header";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PortfolioSection from "@/components/profile/PortfolioSection";
import { profilesApi } from "@/lib/api/profiles";
import type { ProfileData } from "@/lib/types/api";

const InvestorProfile = async ({ params }: { params: Promise<{ Id: string }> }) => {
  const { Id } = await params;
  
  const colors = {
    bgPrimary: '#D6F6FE',
    bgSecondary: '#FEE8BD',
    textPrimary: '#16263d',
    textSecondary: '#65728d',
    textMuted: '#657da8'
  };

  let data: { success: boolean; data?: ProfileData } | null = null;
  
  try {
    data = await profilesApi.getInvestorByUsername(Id);
  } catch (error) {
    console.error("Error fetching investor data:", error);
    data = null;
  }
  
  // Show user not found message if API fails or user not found
  if (!data?.success || !data.data?.user) {
    return (
      <>
        <Header />
        <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">👤</div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Investor Not Found
              </h1>
              <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                The investor profile for "<strong>{Id}</strong>" could not be found.
              </p>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                This investor may not exist or may have a different ID.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show wrong role message if user is not an investor
  if (data.data.user.role !== 'investor') {
    return (
      <>
        <Header />
        <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Not an Investor Profile
              </h1>
              <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                The user "<strong>{Id}</strong>" is not registered as an investor.
              </p>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                This user may be a founder or have a different role.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Use dynamic data - correctly destructure the API response
  const { user, portfolioData, portfolioStats } = data.data;

  const investorData = {
    name: user.name || user.userName || "Anonymous Investor",
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    socialLinks: user.socialLinks,
    city: user.city || "Unknown",
    country: user.country || "Unknown",
    fundingRange: user.fundingRange,
    isVerified: user.isVerified || false,
    joinedDate: user.joinedDate || "Recently joined"
  };

  // Transform portfolioData to ensure logo is always present
  const transformedPortfolioData = portfolioData.map(item => ({
    ...item,
    logo: item.logo || '/logo.png' // Use the existing logo as fallback
  }));


  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ProfileSidebar user={investorData} colors={colors} />
            <PortfolioSection 
              portfolioData={transformedPortfolioData}
              portfolioStats={portfolioStats}
              portfolioType="investor"
              portfolioTitle="Investment Portfolio"
              colors={colors}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvestorProfile;