import type {
  ApiResponse,
  ProfileResponse,
  ProfileData,
} from "@/lib/types/api";


const getBaseUrl = () => {

  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return "";
};

const API_BASE_URL = getBaseUrl();

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
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/api/profile/${Id}`);
  },


  getFounderByUsername: async (Id: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/api/profile/${Id}`);
  },


  getInvestorByUsername: async (Id: string): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/api/profile/${Id}`);
  },


  updateProfile: async (
    data: Partial<ProfileData["user"]>
  ): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/api/profile/update`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },


  getCurrentProfile: async (): Promise<ProfileResponse> => {
    return fetchAPI<ProfileResponse>(`${API_BASE_URL}/api/profile/me`);
  },


  uploadProfileImage: async (formData: FormData): Promise<ApiResponse<{ imageUrl: string }>> => {
    return fetchAPI<ApiResponse<{ imageUrl: string }>>(`${API_BASE_URL}/api/profile/upload-image`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
      },
    });
  },


  toggleFollow: async (
    username: string
  ): Promise<ApiResponse<{ following: boolean }>> => {
    return fetchAPI<ApiResponse<{ following: boolean }>>(
      `${API_BASE_URL}/api/profile/${username}/follow`,
      {
        method: "POST",
      }
    );
  },


  getFollowers: async (username: string): Promise<ApiResponse<ProfileData["user"][]>> => {
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `${API_BASE_URL}/api/profile/${username}/followers`
    );
  },


  getFollowing: async (username: string): Promise<ApiResponse<ProfileData["user"][]>> => {
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(
      `${API_BASE_URL}/api/profile/${username}/following`
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
    const params = new URLSearchParams();
    params.set("search", query);
    
    if (options.role) params.set("role", options.role);
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/profile/search${queryString ? `?${queryString}` : ""}`;
    
    return fetchAPI<ApiResponse<ProfileData["user"][]>>(url);
  },


  verifyProfile: async (
    username: string,
    verified: boolean
  ): Promise<ApiResponse<{ verified: boolean }>> => {
    return fetchAPI<ApiResponse<{ verified: boolean }>>(
      `${API_BASE_URL}/api/profile/${username}/verify`,
      {
        method: "POST",
        body: JSON.stringify({ verified }),
      }
    );
  },
};