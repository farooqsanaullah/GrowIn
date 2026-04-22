import type {
  ApiResponse,
  Startup,
  CreateStartupData,
  StartupFilters,
  StartupListResponse,
  StartupResponse,
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

export const startupsApi = {

  getAll: async (filters: StartupFilters = {}): Promise<StartupListResponse> => {
    return fetchAPI<StartupListResponse>(buildUrl("/api/startups", filters));
  },

  getById: async (id: string): Promise<StartupResponse> => {
    return fetchAPI<StartupResponse>(`/api/startups/${id}`);
  },

  getByFounder: async (
    founderId: string,
    filters: Pick<StartupFilters, "page" | "limit"> = {}
  ): Promise<StartupListResponse> => {
    return fetchAPI<StartupListResponse>(
      buildUrl(`/api/startups/founder/${founderId}`, filters)
    );
  },

  create: async (data: CreateStartupData, options: RequestInit = {}): Promise<StartupResponse> => {
    return fetchAPI<StartupResponse>("/api/startups", {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  update: async (
    id: string,
    data: Partial<CreateStartupData>,
    options: RequestInit = {}
  ): Promise<StartupResponse> => {
    return fetchAPI<StartupResponse>(`/api/startups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    return fetchAPI<ApiResponse<{ id: string }>>(`/api/startups/${id}`, {
      method: "DELETE",
    });
  },
};