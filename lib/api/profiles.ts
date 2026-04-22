import type {
  ApiResponse,
  ProfileResponse,
  ProfileData,
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

export const profilesApi = {

  getByUsername: async (Id: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`/api/profile/${Id}`);
  },

  getFounderByUsername: async (Id: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`/api/profile/${Id}`);
  },

  getInvestorByUsername: async (Id: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`/api/profile/${Id}`);
  },

  updateProfile: async (
    data: Partial<ProfileData["user"]>
  ): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>("/api/profile/update", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getCurrentProfile: async (): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>("/api/profile/me");
  },

  uploadProfileImage: async (formData: FormData): Promise<ApiResponse<{ imageUrl: string }>> => {
    return fetchAPI<ApiResponse<{ imageUrl: string }>>("/api/profile/upload-image", {
      method: "POST",
      body: formData,
      // Don't set Content-Type — browser sets it with the correct multipart boundary
      headers: {},
    });
  },

  toggleFollow: async (username: string): Promise<ApiResponse<{ following: boolean }>> => {
    return fetchAPI<ApiResponse<{ following: boolean }>>(
      `/api/profile/${username}/follow`,
      { method: "POST" }
    );
  },

  getFollowers: async (username: string): Promise<ApiResponse<ProfileData["user"][]>> => {
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `/api/profile/${username}/followers`
    );
  },

  getFollowing: async (username: string): Promise<ApiResponse<ProfileData["user"][]>> => {
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `/api/profile/${username}/following`
    );
  },

  search: async (
    query: string,
    options: {
      role?: "founder" | "investor";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<ProfileData["user"][]>> => {
    const params = new URLSearchParams({ search: query });
    if (options.role) params.set("role", options.role);
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `/api/profile/search?${params.toString()}`
    );
  },

  verifyProfile: async (
    username: string,
    verified: boolean
  ): Promise<ApiResponse<{ verified: boolean }>> => {
    return fetchAPI<ApiResponse<{ verified: boolean }>>(
      `/api/profile/${username}/verify`,
      { method: "POST", body: JSON.stringify({ verified }) }
    );
  },
};