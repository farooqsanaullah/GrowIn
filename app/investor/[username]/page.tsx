import Footer from "@/components/landingpage/Footer";
import Header from "@/components/landingpage/Header";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PortfolioSection from "@/components/profile/PortfolioSection";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface FundingRange {
  min?: number;
  max?: number;
}

interface IUser {
  name: string;
  email: string;
  role: "investor" | "founder" | "admin";
  profileImage?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  city: string;
  country: string;
  fundingRange?: FundingRange;
  isVerified?: boolean;
  joinedDate: string;
}

interface Portfolio {
  id: number;
  startupName: string;
  logo: string;
  investedDate: string;
  status: "active" | "exited" | "failed";
  investmentAmount: string;
  currentValue?: string;
}

const InvestorProfile = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  
  const colors = {
    bgPrimary: '#D6F6FE',
    bgSecondary: '#FEE8BD',
    textPrimary: '#16263d',
    textSecondary: '#65728d',
    textMuted: '#657da8'
  };

  // Static sample data for investor
  const investorData: IUser = {
    name: "Michael Chen",
    email: "michael@techventures.com",
    role: "investor",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format",
    bio: "Seasoned investor with 12+ years in venture capital. Former tech executive turned angel investor. Focus on early-stage SaaS, fintech, and AI startups. Portfolio includes 45+ investments with 8 successful exits.",
    socialLinks: {
      twitter: "https://twitter.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      website: "https://michaelchen.vc"
    },
    city: "New York",
    country: "United States",
    fundingRange: {
      min: 10000,
      max: 500000
    },
    isVerified: true,
    joinedDate: "January 2023"
  };

  const portfolioData: Portfolio[] = [
    {
      id: 1,
      startupName: "NeuroLink AI",
      logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop",
      investedDate: "6 months ago",
      status: "active",
      investmentAmount: "$75,000",
      currentValue: "$120,000"
    },
    {
      id: 2,
      startupName: "Quantum FinTech",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=60&h=60&fit=crop",
      investedDate: "1 year ago",
      status: "active",
      investmentAmount: "$100,000",
      currentValue: "$180,000"
    },
    {
      id: 4,
      startupName: "DataFlow Analytics",
      logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=60&h=60&fit=crop",
      investedDate: "8 months ago",
      status: "active",
      investmentAmount: "$25,000",
      currentValue: "$32,000"
    },
    {
      id: 6,
      startupName: "MediCare Plus",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=60&h=60&fit=crop",
      investedDate: "4 months ago",
      status: "active",
      investmentAmount: "$150,000",
      currentValue: "$165,000"
    },
    {
      id: 7,
      startupName: "AgriTech Innovations",
      logo: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=60&h=60&fit=crop",
      investedDate: "3 months ago",
      status: "active",
      investmentAmount: "$80,000",
      currentValue: "$85,000"
    }
  ];

  const portfolioStats = {
    stat1: { value: portfolioData.length, label: "Active Investments" },
    stat2: { value: "12+", label: "Years Experience" },
    stat3: { value: "$430K", label: "Total Invested" },
    stat4: { value: "1.8x", label: "Avg Return" }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ProfileSidebar user={investorData} colors={colors} />
            <PortfolioSection 
              portfolioData={portfolioData}
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