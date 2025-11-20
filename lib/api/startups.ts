import type {
  ApiResponse,
  Startup,
  CreateStartupData,
  StartupFilters,
  StartupListResponse,
  StartupResponse,
} from '@/types/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';


const fetchAPI = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiResponse<null>;
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
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

/**
 * Construct URL with query params
 */
const buildUrl = (
  baseUrl: string,
  filters?: Record<string, any>
): string => {
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl;
  }
  const query = buildQueryParams(filters);
  return query ? `${baseUrl}?${query}` : baseUrl;
};


export const startupsApi = {
  /**
   * Get all startups with optional filters and pagination
   */
  getAll: async (filters: StartupFilters = {}): Promise<StartupListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/startups`, filters);
    return fetchAPI<StartupListResponse>(url);
  },

  /**
   * Get single startup by ID
   */
  getById: async (id: string): Promise<StartupResponse> => {
    return fetchAPI<StartupResponse>(`${API_BASE_URL}/startups/${id}`);
  },

  /**
   * Get startups by founder ID
   */
  getByFounder: async (
    founderId: string,
    filters: Pick<StartupFilters, 'page' | 'limit'> = {}
  ): Promise<StartupListResponse> => {
    const url = buildUrl(`${API_BASE_URL}/startups/founder/${founderId}`, filters);
    return fetchAPI<StartupListResponse>(url);
  },

  /**
   * Create new startup
   */
  create: async (data: CreateStartupData): Promise<StartupResponse> => {
    return fetchAPI<StartupResponse>(`${API_BASE_URL}/startups`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update startup by ID
   */
  update: async (
    id: string,
    data: Partial<CreateStartupData>
  ): Promise<StartupResponse> => {
    return fetchAPI<StartupResponse>(`${API_BASE_URL}/startups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete startup by ID
   */
  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    return fetchAPI<ApiResponse<{ id: string }>>(`${API_BASE_URL}/startups/${id}`, {
      method: 'DELETE',
    });
  },
};