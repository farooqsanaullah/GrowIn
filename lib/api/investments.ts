import type {
  ApiResponse,
  CreateInvestmentData,
  InvestmentFilters,
  InvestmentListResponse,
  InvestmentResponse,
  PortfolioStatsResponse,
  AnalyticsResponse,
} from "@/lib/types/api";

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

const buildQueryParams = <T extends Record<string, any>>(filters: T): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

const buildUrl = (baseUrl: string, filters?: Record<string, any>): string => {
  if (!filters || Object.keys(filters).length === 0) return baseUrl;
  const query = buildQueryParams(filters);
  return query ? `${baseUrl}?${query}` : baseUrl;
};

export const investmentsApi = {

  getAll: async (filters: InvestmentFilters = {}): Promise<InvestmentListResponse> => {
    return fetchAPI<InvestmentListResponse>(buildUrl("/api/investment", filters));
  },

  getById: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`/api/investment/${id}`);
  },

  getByInvestor: async (
    investorId: string,
    filters: Omit<InvestmentFilters, "investorId"> = {}
  ): Promise<InvestmentListResponse> => {
    return fetchAPI<InvestmentListResponse>(
      buildUrl(`/api/investment/investor/${investorId}`, filters)
    );
  },

  getByStartup: async (
    startupId: string,
    filters: Omit<InvestmentFilters, "startupId"> = {}
  ): Promise<InvestmentListResponse> => {
    return fetchAPI<InvestmentListResponse>(
      buildUrl(`/api/investment/startup/${startupId}`, filters)
    );
  },

  create: async (data: CreateInvestmentData): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>("/api/investment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<CreateInvestmentData>
  ): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`/api/investment/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  cancel: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`/api/investment/${id}/cancel`, {
      method: "POST",
    });
  },

  complete: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`/api/investment/${id}/complete`, {
      method: "POST",
    });
  },

  getPortfolioStats: async (investorId?: string, options: RequestInit = {}): Promise<PortfolioStatsResponse> => {
    const url = investorId
      ? `/api/investor/${investorId}/portfolio/stats`
      : `/api/investor/portfolio/stats`;
    return fetchAPI<PortfolioStatsResponse>(url, options);
  },

  getPortfolio: async (
    investorId?: string,
    filters: Pick<InvestmentFilters, "page" | "limit" | "status"> = {},
    options: RequestInit = {}
  ): Promise<InvestmentListResponse> => {
    return fetchAPI<InvestmentListResponse>(
      buildUrl(`/api/investor/${investorId}/portfolio`, filters),
      options
    );
  },

  getAnalytics: async (
    investorId?: string,
    period: "1m" | "3m" | "6m" | "1y" | "all" = "6m"
  ): Promise<AnalyticsResponse> => {
    return fetchAPI<AnalyticsResponse>(
      `/api/investor/${investorId}/analytics?period=${period}`
    );
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
    return fetchAPI(buildUrl("/api/investor/activities", filters));
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
    return fetchAPI(buildUrl("/api/investor/recommendations", filters));
  },
};