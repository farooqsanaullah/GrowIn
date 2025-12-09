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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

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

/**
 * Build query params from object, only include defined values
 */
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

/**
 * Construct URL with query params
 */
const buildUrl = (baseUrl: string, filters?: Record<string, any>): string => {
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl;
  }
  const query = buildQueryParams(filters);
  return query ? `${baseUrl}?${query}` : baseUrl;
};

export const investmentsApi = {
  /**
   * Get all investments with optional filters and pagination
   */
  getAll: async (
    filters: InvestmentFilters = {}
  ): Promise<InvestmentListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/investment`, filters);
    return fetchAPI<InvestmentListResponse>(url);
  },

  /**
   * Get single investment by ID
   */
  getById: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${API_BASE_URL}/investment/${id}`);
  },

  /**
   * Get investments by investor ID
   */
  getByInvestor: async (
    investorId: string,
    filters: Omit<InvestmentFilters, "investorId"> = {}
  ): Promise<InvestmentListResponse> => {
    const url = buildUrl(
      `${API_BASE_URL}/investment/investor/${investorId}`,
      filters
    );
    return fetchAPI<InvestmentListResponse>(url);
  },

  /**
   * Get investments by startup ID
   */
  getByStartup: async (
    startupId: string,
    filters: Omit<InvestmentFilters, "startupId"> = {}
  ): Promise<InvestmentListResponse> => {
    const url = buildUrl(
      `${API_BASE_URL}/investment/startup/${startupId}`,
      filters
    );
    return fetchAPI<InvestmentListResponse>(url);
  },

  /**
   * Create new investment
   */
  create: async (data: CreateInvestmentData): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${API_BASE_URL}/investment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update investment by ID
   */
  update: async (
    id: string,
    data: Partial<CreateInvestmentData>
  ): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(`${API_BASE_URL}/investment/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cancel investment by ID
   */
  cancel: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(
      `${API_BASE_URL}/investment/${id}/cancel`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Complete investment by ID
   */
  complete: async (id: string): Promise<InvestmentResponse> => {
    return fetchAPI<InvestmentResponse>(
      `${API_BASE_URL}/investment/${id}/complete`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Get portfolio stats for an investor
   */

  getPortfolioStats: async (
    investorId?: string,
    options: RequestInit = {}
  ): Promise<PortfolioStatsResponse> => {
    const url = investorId
      ? `${API_BASE_URL}/investor/${investorId}/portfolio/stats`
      : `${API_BASE_URL}/investor/portfolio/stats`;
    return fetchAPI<PortfolioStatsResponse>(url, options);
  },

  /**
   * Get portfolio investments for an investor
   */
  getPortfolio: async (
    investorId?: string,
    filters: Pick<InvestmentFilters, "page" | "limit" | "status"> = {},
    options: RequestInit = {}
  ): Promise<InvestmentListResponse> => {
    const baseUrl = investorId
      ? `${API_BASE_URL}/investor/${investorId}/portfolio`
      : `${API_BASE_URL}/investor/portfolio`;
    const url = buildUrl(baseUrl, filters);
    return fetchAPI<InvestmentListResponse>(url, options);
  },

  /**
   * Get analytics data for investor dashboard
   */
  getAnalytics: async (
    investorId?: string,
    period: "1m" | "3m" | "6m" | "1y" | "all" = "6m"
  ): Promise<AnalyticsResponse> => {
    const baseUrl = investorId
      ? `${API_BASE_URL}/investor/${investorId}/analytics`
      : `${API_BASE_URL}/investor/analytics`;
    const url = `${baseUrl}?period=${period}`;
    return fetchAPI<AnalyticsResponse>(url);
  },

  /**
   * Get investment activities/history
   */
  getActivities: async (
    filters: Pick<InvestmentFilters, "page" | "limit"> & { type?: string } = {}
  ): Promise<
    ApiResponse<
      Array<{
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
      }>
    >
  > => {
    const url = buildUrl(`${API_BASE_URL}/investor/activities`, filters);
    return fetchAPI<
      ApiResponse<
        Array<{
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
        }>
      >
    >(url);
  },

  /**
   * Get investment recommendations
   */
  getRecommendations: async (
    filters: Pick<InvestmentFilters, "page" | "limit"> = {}
  ): Promise<
    ApiResponse<
      Array<{
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
      }>
    >
  > => {
    const url = buildUrl(`${API_BASE_URL}/investor/recommendations`, filters);
    return fetchAPI<
      ApiResponse<
        Array<{
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
        }>
      >
    >(url);
  },
};
