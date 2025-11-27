import type {
  ApiResponse,
  ProfileResponse,
  ProfileData,
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

export const profilesApi = {
  /**
   * Get profile by username (works for both founders and investors)
   */
  getByUsername: async (username: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/profile/${username}`);
  },

  /**
   * Get founder profile by username
   */
  getFounderByUsername: async (username: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/profile/founder/${username}`);
  },

  /**
   * Get investor profile by username
   */
  getInvestorByUsername: async (username: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/profile/investor/${username}`);
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (
    data: Partial<ProfileData["user"]>
  ): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/profile/update`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current user's profile
   */
  getCurrentProfile: async (): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/profile/me`);
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (formData: FormData): Promise<ApiResponse<{ imageUrl: string }>> => {
    return fetchAPI<ApiResponse<{ imageUrl: string }>>(`${API_BASE_URL}/profile/upload-image`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
      },
    });
  },

  /**
   * Follow/unfollow a user
   */
  toggleFollow: async (
    username: string
  ): Promise<ApiResponse<{ following: boolean }>> => {
    return fetchAPI<ApiResponse<{ following: boolean }>>(
      `${API_BASE_URL}/profile/${username}/follow`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Get user's followers
   */
  getFollowers: async (username: string): Promise<ApiResponse<ProfileData["user"][]>> => {
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `${API_BASE_URL}/profile/${username}/followers`
    );
  },

  /**
   * Get users that this user is following
   */
  getFollowing: async (username: string): Promise<ApiResponse<ProfileData["user"][]>> => {
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `${API_BASE_URL}/profile/${username}/following`
    );
  },

  /**
   * Search profiles (both founders and investors)
   */
  search: async (
    query: string,
    options: {
      role?: "founder" | "investor";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<ProfileData["user"][]>> => {
    const params = new URLSearchParams();
    params.set("search", query);
    
    if (options.role) params.set("role", options.role);
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));

    const queryString = params.toString();
    const url = `${API_BASE_URL}/profile/search${queryString ? `?${queryString}` : ""}`;
    
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(url);
  },

  /**
   * Verify profile (admin functionality)
   */
  verifyProfile: async (
    username: string,
    verified: boolean
  ): Promise<ApiResponse<{ verified: boolean }>> => {
    return fetchAPI<ApiResponse<{ verified: boolean }>>(
      `${API_BASE_URL}/profile/${username}/verify`,
      {
        method: "POST",
        body: JSON.stringify({ verified }),
      }
    );
  },
};