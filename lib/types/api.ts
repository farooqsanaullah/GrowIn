
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  errors?: Record<string, string[]>;
}

interface ErrorResponse extends Omit<ApiResponse<null>, 'data'> {
  success: false;
  message: string;
}

interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
}

interface User {
  _id: string;
  userName: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface EquityRange {
  range: string;
  equity: number;
}

type StartupStatus = 'active' | 'inactive' | 'closed';


interface Startup {
  _id: string;
  name?: string;
  title: string;
  description: string;
  pitch: string[];
  founders: User[];
  investors: User[];
  badges: string[];
  categoryType: string;
  industry: string;
  socialLinks: SocialLinks;
  followers: string[];
  status: StartupStatus;
  ratingCount: number;
  avgRating: number;
  equityRange: EquityRange[];
  profilePic?: string;
  totalRaised?: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateStartupData {
  title: string;
  description: string;
  pitch?: string[];
  badges?: string[];
  categoryType: string;
  industry: string;
  socialLinks?: SocialLinks;
  equityRange?: EquityRange[];
  profilePic?: string;
}

interface StartupFilters {
  page?: number;
  limit?: number;
  categoryType?: string;
  industry?: string;
  status?: StartupStatus;
  search?: string;
}


type StartupResponse = ApiResponse<Startup>;
type StartupListResponse = ApiResponse<Startup[]>;


// Investor specific interfaces
interface FundingRange {
  min?: number;
  max?: number;
}

interface Investor extends User {
  bio?: string;
  city?: string;
  country?: string;
  fundingRange?: FundingRange;
  investmentFocus?: string[];
  totalInvestments?: number;
  successfulExits?: number;
  isVerified?: boolean;
  joinedDate: string;
  socialLinks?: SocialLinks;
}

interface InvestorFilters {
  page?: number;
  limit?: number;
  city?: string;
  country?: string;
  investmentFocus?: string;
  minFunding?: number;
  maxFunding?: number;
  search?: string;
}

interface CreateInvestorData {
  bio?: string;
  city?: string;
  country?: string;
  fundingRange?: FundingRange;
  investmentFocus?: string[];
  socialLinks?: SocialLinks;
}

// Investment specific interfaces
interface Investment {
  _id: string;
  investorId: string;
  startupId: string;
  amount: number;
  equity?: number;
  investmentDate: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  startup?: Startup;
  investor?: Investor;
  valuation?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateInvestmentData {
  startupId: string;
  amount: number;
  equity?: number;
  valuation?: number;
  notes?: string;
}

interface InvestmentFilters {
  page?: number;
  limit?: number;
  investorId?: string;
  startupId?: string;
  status?: Investment['status'];
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Portfolio and Analytics interfaces
interface PortfolioStats {
  totalInvestments: number;
  totalAmount: number;
  activeInvestments: number;
  avgInvestmentSize: number;
  portfolioValue: number;
  totalReturns: number;
}

interface AnalyticsData {
  monthlyInvestments: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  investmentsByCategory: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
  topPerformers: Investment[];
  recentActivity: Investment[];
}

// Profile specific interfaces
interface ProfileUser extends User {
  role: 'investor' | 'founder' | 'admin';
  bio?: string;
  city?: string;
  country?: string;
  skills?: string[];
  fundingRange?: FundingRange;
  isVerified?: boolean;
  joinedDate: string;
  socialLinks?: SocialLinks;
}

interface ProfilePortfolio {
  id: string;
  startupName: string;
  logo?: string;
  investedDate: string;
  status: 'active' | 'exited' | 'failed';
  role?: string;
  investmentAmount?: string;
  currentValue?: string;
  description?: string;
}

interface ProfileData {
  user: ProfileUser;
  portfolioData: ProfilePortfolio[];
  portfolioStats: {
    stat1: { value: number | string; label: string };
    stat2: { value: number | string; label: string };
    stat3: { value: number | string; label: string };
    stat4: { value: number | string; label: string };
  };
}

// API Response types
type InvestorResponse = ApiResponse<Investor>;
type InvestorListResponse = ApiResponse<Investor[]>;
type InvestmentResponse = ApiResponse<Investment>;
type InvestmentListResponse = ApiResponse<Investment[]>;
type PortfolioStatsResponse = ApiResponse<PortfolioStats>;
type AnalyticsResponse = ApiResponse<AnalyticsData>;
type ProfileResponse = ApiResponse<ProfileData>;

export type {
  ApiResponse,
  ErrorResponse,
  Pagination,
  SocialLinks,
  User,
  EquityRange,
  StartupStatus,
  Startup,
  CreateStartupData,
  StartupFilters,
  StartupResponse,
  StartupListResponse,
  // New investor types
  FundingRange,
  Investor,
  InvestorFilters,
  CreateInvestorData,
  InvestorResponse,
  InvestorListResponse,
  // Investment types
  Investment,
  CreateInvestmentData,
  InvestmentFilters,
  InvestmentResponse,
  InvestmentListResponse,
  // Portfolio and Analytics types
  PortfolioStats,
  AnalyticsData,
  PortfolioStatsResponse,
  AnalyticsResponse,
  // Profile types
  ProfileUser,
  ProfilePortfolio,
  ProfileData,
  ProfileResponse,
};