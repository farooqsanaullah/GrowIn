import Footer from "@/components/landingpage/Footer";
import Header from "@/components/landingpage/Header";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PortfolioSection from "@/components/profile/PortfolioSection";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
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
  skills?: string[];
  isVerified?: boolean;
  joinedDate: string;
}

interface Portfolio {
  id: number;
  startupName: string;
  logo: string;
  investedDate: string;
  status: "active" | "exited" | "failed";
  role: string;
}

const FounderProfile = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  
  const colors = {
    bgPrimary: '#D6F6FE',
    bgSecondary: '#FEE8BD',
    textPrimary: '#16263d',
    textSecondary: '#65728d',
    textMuted: '#657da8'
  };

  // Static sample data for founder
  const founderData: IUser = {
    name: "Sarah Johnson",
    email: "sarah@ecotech.com",
    role: "founder",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format",
    bio: "Serial entrepreneur with 8+ years in cleantech. Founded 3 startups, 2 successful exits. Passionate about sustainable technology and climate solutions. Currently building the future of renewable energy.",
    socialLinks: {
      twitter: "https://twitter.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      website: "https://sarahjohnson.tech"
    },
    city: "San Francisco",
    country: "United States",
    skills: ["Product Strategy", "Team Building", "Fundraising", "Clean Energy", "IoT", "AI/ML", "Business Development", "Sustainability"],
    isVerified: true,
    joinedDate: "March 2023"
  };

  const portfolioData: Portfolio[] = [
    {
      id: 1,
      startupName: "EcoTech Solutions",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=60&h=60&fit=crop",
      investedDate: "2 years ago",
      status: "active",
      role: "Founder & CEO"
    },
    {
      id: 4,
      startupName: "CleanWave Technologies",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=60&h=60&fit=crop",
      investedDate: "1 year ago",
      status: "active",
      role: "Advisor"
    },
    {
      id: 5,
      startupName: "NextGen Solar",
      logo: "https://images.unsplash.com/photo-1497436072909-f5e4be91ed90?w=60&h=60&fit=crop",
      investedDate: "6 months ago",
      status: "active",
      role: "Strategic Advisor"
    }
  ];

  const portfolioStats = {
    stat1: { value: portfolioData.length, label: "Active Companies" },
    stat2: { value: 3, label: "Founded" },
    stat3: { value: "8+", label: "Years Exp" },
    stat4: { value: "50+", label: "Team Members" }
  };


  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 font-montserrat" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ProfileSidebar user={founderData} colors={colors} />
            <PortfolioSection 
              portfolioData={portfolioData}
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