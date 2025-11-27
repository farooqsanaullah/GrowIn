import type {
  ApiResponse,
  Investor,
  CreateInvestorData,
  InvestorFilters,
  InvestorListResponse,
  InvestorResponse,
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

export const investorsApi = {
  /**
   * Get all investors with optional filters and pagination
   */
  getAll: async (
    filters: InvestorFilters = {}
  ): Promise<InvestorListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/investor`, filters);
    return fetchAPI<InvestorListResponse>(url);
  },

  /**
   * Get single investor by ID
   */
  getById: async (id: string): Promise<InvestorResponse> => {
    return fetchAPI<InvestorResponse>(`${API_BASE_URL}/investor/${id}`);
  },

  /**
   * Get investor by username
   */
  getByUsername: async (username: string): Promise<InvestorResponse> => {
    return fetchAPI<InvestorResponse>(`${API_BASE_URL}/investor/username/${username}`);
  },

  /**
   * Get investors for discovery with enhanced filters
   */
  getForDiscovery: async (
    filters: InvestorFilters = {}
  ): Promise<InvestorListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/investor/discover`, filters);
    return fetchAPI<InvestorListResponse>(url);
  },

  /**
   * Update investor profile
   */
  update: async (
    id: string,
    data: Partial<CreateInvestorData>
  ): Promise<InvestorResponse> => {
    return fetchAPI<InvestorResponse>(`${API_BASE_URL}/investor/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Follow/unfollow an investor
   */
  toggleFollow: async (
    investorId: string
  ): Promise<ApiResponse<{ following: boolean }>> => {
    return fetchAPI<ApiResponse<{ following: boolean }>>(
      `${API_BASE_URL}/investor/${investorId}/follow`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Get investor's followers
   */
  getFollowers: async (
    investorId: string,
    filters: Pick<InvestorFilters, "page" | "limit"> = {}
  ): Promise<InvestorListResponse> => {
    const url = buildUrl(
      `${API_BASE_URL}/investor/${investorId}/followers`,
      filters
    );
    return fetchAPI<InvestorListResponse>(url);
  },

  /**
   * Get investors that this investor is following
   */
  getFollowing: async (
    investorId: string,
    filters: Pick<InvestorFilters, "page" | "limit"> = {}
  ): Promise<InvestorListResponse> => {
    const url = buildUrl(
      `${API_BASE_URL}/investor/${investorId}/following`,
      filters
    );
    return fetchAPI<InvestorListResponse>(url);
  },

  /**
   * Search investors
   */
  search: async (
    query: string,
    filters: Omit<InvestorFilters, "search"> = {}
  ): Promise<InvestorListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/investor/search`, {
      search: query,
      ...filters,
    });
    return fetchAPI<InvestorListResponse>(url);
  },

  /**
   * Get investor recommendations
   */
  getRecommendations: async (
    filters: Pick<InvestorFilters, "page" | "limit"> = {}
  ): Promise<InvestorListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/investor/recommendations`, filters);
    return fetchAPI<InvestorListResponse>(url);
  },
};