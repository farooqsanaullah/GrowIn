import type {
  ApiResponse,
  Investment,
  CreateInvestmentData,
  InvestmentFilters,
  InvestmentListResponse,
  InvestmentResponse,
  PortfolioStats,
  PortfolioStatsResponse,
  AnalyticsData,
  AnalyticsResponse,
} from "@/lib/types/api";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

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

  return response.json();
};


const buildQueryParams = <T extends Record<string, any>>(
  filters: T
): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
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

export const investmentsApi = {

  getAll: async (
    filters: InvestmentFilters = {}
  ): Promise<InvestmentListResponse> => {
    const url = buildUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/investment`, filters);
    return fetchAPI<InvestmentListResponse>(url);
  },


  getById: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/investment/${id}`);
  },


  getByInvestor: async (
    investorId: string,
    filters: Omit<InvestmentFilters, "investorId"> = {}
  ): Promise<InvestmentListResponse> => {
    const url = buildUrl(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/investment/investor/${investorId}`,
      filters
    );
    return fetchAPI<InvestmentListResponse>(url);
  },


  getByStartup: async (
    startupId: string,
    filters: Omit<InvestmentFilters, "startupId"> = {}
  ): Promise<InvestmentListResponse> => {
    const url = buildUrl(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/investment/startup/${startupId}`,
      filters
    );
    return fetchAPI<InvestmentListResponse>(url);
  },


  create: async (data: CreateInvestmentData): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/investment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },


  update: async (
    id: string,
    data: Partial<CreateInvestmentData>
  ): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/investment/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },


  cancel: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/investment/${id}/cancel`, {
      method: "POST",
    });
  },


  complete: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/investment/${id}/complete`, {
      method: "POST",
    });
  },

  
  getPortfolioStats: async (investorId?: string, options: RequestInit = {}): Promise<PortfolioStatsResponse> => {
    const url = investorId 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/${investorId}/portfolio/stats`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/portfolio/stats`;
    return fetchAPI<PortfolioStatsResponse>(url, options);
  },

  getPortfolio: async (
    investorId?: string,
    filters: Pick<InvestmentFilters, "page" | "limit" | "status"> = {},
    options: RequestInit = {}
  ): Promise<InvestmentListResponse> => {
    const baseUrl = investorId 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/${investorId}/portfolio`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/portfolio`;
    const url = buildUrl(baseUrl, filters);
    return fetchAPI<InvestmentListResponse>(url, options);
  },

  getAnalytics: async (
    investorId?: string,
    period: "1m" | "3m" | "6m" | "1y" | "all" = "6m"
  ): Promise<AnalyticsResponse> => {
    const baseUrl = investorId 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/${investorId}/analytics`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/analytics`;
    const url = `${baseUrl}?period=${period}`;
    return fetchAPI<AnalyticsResponse>(url);
  },

  getActivities: async (
    filters: Pick<InvestmentFilters, "page" | "limit"> & { type?: string } = {}
  ): Promise<ApiResponse<Array<{
    id: string;
    type: "investment" | "update" | "exit";
    title: string;
    description: string;
    amount?: number;
    date: string;
    startup?: {
      id: string;
      name: string;
      logo?: string;
    };
  }>>> => {
    const url = buildUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/activities`, filters);
    return fetchAPI<ApiResponse<Array<{
      id: string;
      type: "investment" | "update" | "exit";
      title: string;
      description: string;
      amount?: number;
      date: string;
      startup?: {
        id: string;
        name: string;
        logo?: string;
      };
    }>>>(url);
  },


  getRecommendations: async (
    filters: Pick<InvestmentFilters, "page" | "limit"> = {}
  ): Promise<ApiResponse<Array<{
    startup: {
      id: string;
      name: string;
      description: string;
      logo?: string;
      category: string;
      funding_target: number;
      raised_amount: number;
    };
    score: number;
    reasons: string[];
  }>>> => {
    const url = buildUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investor/recommendations`, filters);
    return fetchAPI<ApiResponse<Array<{
      startup: {
        id: string;
        name: string;
        description: string;
        logo?: string;
        category: string;
        funding_target: number;
        raised_amount: number;
      };
      score: number;
      reasons: string[];
    }>>>(url);
  },
};