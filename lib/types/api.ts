
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  errors?: Record<string, string[]>;
}

interface ErrorResponse extends Omit<ApiResponse<null>, 'data'> {
  success: false;
  message: string;
}

interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
}

interface User {
  _id: string;
  userName: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface EquityRange {
  range: string;
  equity: number;
}

type StartupStatus = 'active' | 'inactive' | 'pending' | 'closed';


interface Startup {
  _id: string;
  title: string;
  description: string;
  pitch: string[];
  founders: User[];
  investors: User[];
  badges: string[];
  categoryType: string;
  industry: string;
  socialLinks: SocialLinks;
  followers: string[];
  status: StartupStatus;
  ratingCount: number;
  avgRating: number;
  equityRange: EquityRange[];
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateStartupData {
  title: string;
  description: string;
  pitch?: string[];
  badges?: string[];
  categoryType: string;
  industry: string;
  socialLinks?: SocialLinks;
  equityRange?: EquityRange[];
  profilePic?: string;
}

interface StartupFilters {
  page?: number;
  limit?: number;
  categoryType?: string;
  industry?: string;
  status?: StartupStatus;
  search?: string;
}


type StartupResponse = ApiResponse<Startup>;
type StartupListResponse = ApiResponse<Startup[]>;


export type {
  ApiResponse,
  ErrorResponse,
  Pagination,
  SocialLinks,
  User,
  EquityRange,
  StartupStatus,
  Startup,
  CreateStartupData,
  StartupFilters,
  StartupResponse,
  StartupListResponse,
};