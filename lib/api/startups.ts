interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export interface Startup {
  _id: string;
  title: string;
  description: string;
  pitch: string[];
  founders: Array<{
    _id: string;
    userName: string;
    name: string;
    profileImage?: string;
    email: string;
  }>;
  investors: Array<{
    _id: string;
    userName: string;
    name: string;
    profileImage?: string;
    email: string;
  }>;
  badges: string[];
  categoryType: string;
  industry: string;
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
  };
  followers: number;
  status: "active" | "inactive" | "pending" | "closed";
  ratingCount: number;
  avgRating: number;
  equityRange: Array<{
    range: string;
    equity: number;
  }>;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStartupData {
  title: string;
  description: string;
  pitch?: string[];
  badges?: string[];
  categoryType: string;
  industry: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
  };
  equityRange?: Array<{
    range: string;
    equity: number;
  }>;
  profilePic?: string;
}

export interface StartupFilters {
  page?: number;
  limit?: number;
  categoryType?: string;
  industry?: string;
  status?: string;
  search?: string;
}

const API_BASE_URL = '/api';

export const startupsApi = {
  // Get all startups with filters and pagination
  getAll: async (filters: StartupFilters = {}): Promise<ApiResponse<Startup[]>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.categoryType) params.set('categoryType', filters.categoryType);
    if (filters.industry) params.set('industry', filters.industry);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/startups?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Get single startup by ID
  getById: async (id: string): Promise<ApiResponse<Startup>> => {
    const response = await fetch(`${API_BASE_URL}/startups/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Get startups by founder ID
  getByFounder: async (founderId: string, filters: Omit<StartupFilters, 'categoryType' | 'industry' | 'status' | 'search'> = {}): Promise<ApiResponse<Startup[]>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    const response = await fetch(`${API_BASE_URL}/startups/founder/${founderId}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Create new startup
  create: async (data: CreateStartupData): Promise<ApiResponse<Startup>> => {
    const response = await fetch(`${API_BASE_URL}/startups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Update startup
  update: async (id: string, data: Partial<CreateStartupData>): Promise<ApiResponse<Startup>> => {
    const response = await fetch(`${API_BASE_URL}/startups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Delete startup
  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await fetch(`${API_BASE_URL}/startups/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};