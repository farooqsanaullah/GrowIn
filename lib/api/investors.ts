import type {
  ApiResponse,
} from "@/lib/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";


export interface InvestorFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  country?: string;
  minFunding?: number;
  maxFunding?: number;
  isVerified?: string;
  sortBy?: "recent" | "name" | "funding_high" | "funding_low" | "verified";
}

export interface InvestorStats {
  totalInvestments: number;
  totalInvested: number;
  avgInvestment: number;
}

export interface Investor {
  _id: string;
  userName: string;
  name?: string;
  email: string;
  profileImage?: string;
  bio?: string;
  city?: string;
  country?: string;
  fundingRange?: {
    min?: number;
    max?: number;
  };
  isVerified: boolean;
  createdAt: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  investmentStats: InvestorStats;
}

export interface InvestorPortfolio {
  investmentId: string;
  startupId: string;
  startupTitle: string;
  startupDescription: string;
  startupLogo?: string;
  category: string;
  industry: string;
  status: string;
  founders: Array<{
    name?: string;
    userName: string;
    profileImage?: string;
  }>;
  rating: number;
  ratingCount: number;
  investmentAmount: number;
  currentValue: number;
  roi: number;
  investmentDate: string;
  monthsInvested: number;
}

export interface InvestorProfile {
  investor: Investor & { joinedDate: string };
  stats: {
    totalInvested: number;
    totalInvestments: number;
    avgInvestment: number;
    totalCurrentValue: number;
    totalROI: number;
    activeInvestments: number;
    industries: number;
    categories: number;
    successRate: number;
  };
  portfolio: InvestorPortfolio[];
  insights: {
    favoriteIndustries: string[];
    favoriteCategories: string[];
    monthlyActivity: Array<{
      month: string;
      count: number;
      amount: number;
    }>;
    topPerformers: InvestorPortfolio[];
    recentInvestments: InvestorPortfolio[];
  };
}

export interface InvestorListResponse {
  success: boolean;
  data?: {
    investors: Investor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      cities: string[];
      countries: string[];
      fundingRanges: Array<{
        label: string;
        min: number;
        max: number | null;
      }>;
    };
  };
  message: string;
}

export interface InvestorResponse {
  success: boolean;
  data?: InvestorProfile;
  message: string;
}

const fetchAPI = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({}))) as ApiResponse<null>;
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
};


const buildQueryParams = (filters: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  return params.toString();
};


const buildUrl = (baseUrl: string, filters?: Record<string, any>): string => {
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl;
  }
  const query = buildQueryParams(filters);
  return query ? `${baseUrl}?${query}` : baseUrl;
};

export const investorsApi = {
  
  getAll: async (filters: InvestorFilters = {}): Promise<InvestorListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/api/investors`, filters);
    return fetchAPI<InvestorListResponse>(url);
  },

  getById: async (id: string): Promise<InvestorResponse> => {
    return fetchAPI<InvestorResponse>(`${API_BASE_URL}/api/investors/${id}`);
  },


  search: async (query: string, filters: Omit<InvestorFilters, 'search'> = {}): Promise<InvestorListResponse> => {
    return investorsApi.getAll({ ...filters, search: query });
  },


  getByLocation: async (city?: string, country?: string, filters: Omit<InvestorFilters, 'city' | 'country'> = {}): Promise<InvestorListResponse> => {
    return investorsApi.getAll({ ...filters, city, country });
  },


  getByFundingRange: async (minFunding?: number, maxFunding?: number, filters: Omit<InvestorFilters, 'minFunding' | 'maxFunding'> = {}): Promise<InvestorListResponse> => {
    return investorsApi.getAll({ ...filters, minFunding, maxFunding });
  },


  getVerified: async (filters: Omit<InvestorFilters, 'isVerified'> = {}): Promise<InvestorListResponse> => {
    return investorsApi.getAll({ ...filters, isVerified: 'true' });
  }
};

export default investorsApi;