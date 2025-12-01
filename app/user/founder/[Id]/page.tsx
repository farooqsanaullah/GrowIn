import Footer from "@/components/landingpage/Footer";
import Header from "@/components/landingpage/Header";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PortfolioSection from "@/components/profile/PortfolioSection";
import { profilesApi } from "@/lib/api/profiles";
import type { ProfileData } from "@/lib/types/api";

const FounderProfile = async ({ params }: { params: Promise<{ Id: string }> }) => {
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
    data = await profilesApi.getFounderByUsername(Id);
    console.log("Fetched founder data:", data);
    
  } catch (error) {
    console.error("Error fetching founder data:", error);
    data = null;
  }
  console.log("Final founder data state:", data);
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
                Founder Not Found
              </h1>
              <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                The founder profile for "<strong>{Id}</strong>" could not be found.
              </p>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                This founder may not exist or may have a different username.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show wrong role message if user is not a founder
  if (data.data.user.role !== 'founder') {
    return (
      <>
        <Header />
        <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Not a Founder Profile
              </h1>
              <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                The user "<strong>{Id}</strong>" is not registered as a founder.
              </p>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                This user may be an investor or have a different role.
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

  const founderData = {
    name: user.name || user.userName || "Anonymous Founder",
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    socialLinks: user.socialLinks,
    city: user.city || "Unknown",
    country: user.country || "Unknown",
    skills: user.skills,
    isVerified: user.isVerified || false,
    joinedDate: user.joinedDate || "Recently joined"
  };

  // Convert string IDs to numbers for component compatibility and handle empty portfolio
  const formattedPortfolioData = portfolioData && portfolioData.length > 0 
    ? portfolioData.map((item: any, index: number) => ({
        ...item,
        id: index + 1 // Use index + 1 as numeric ID
      }))
    : [];

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ProfileSidebar user={founderData} colors={colors} />
            <PortfolioSection 
              portfolioData={formattedPortfolioData}
              portfolioStats={portfolioStats}
              portfolioType="founder"
              portfolioTitle="Portfolio"
              colors={colors}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FounderProfile;