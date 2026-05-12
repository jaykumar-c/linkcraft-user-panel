// User types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  display_name: string;
  avatar: string | null;
  avatarUrl: string | null;
  avatar_url: string | null;
  avatarMediaId: string | null;
  bio: string | null;
  bioText: string | null;
  bio_text: string | null;
  profession: string | null;
  themeSettings: Record<string, any>;
  theme_settings: Record<string, any>;
  plan: string;
  totalProfileViews: number;
  total_profile_views: number;
  totalAiTokensUsed: number;
  total_ai_tokens_used: number;
  lastLoginAt: string;
  last_login_at: string;
  isActive: boolean;
  is_active: boolean;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  isVerified: boolean;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// Link types - Updated to match backend
export interface Link {
  id: string;
  title: string;
  url: string;
  description: string | null;
  iconUrl: string | null;
  thumbnailUrl: string | null;
  linkType: string;
  platformDetected: string | null;
  category: string | null;
  orderIndex: number;
  displayOrder: number;
  clickCount: number;
  isActive: boolean;
  isDeleted: boolean;
  scheduleStartAt: number | null;
  scheduleEndAt: number | null;
  isFeatured: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  userId: string;
  createdAt: number;
  updatedAt: number | null;
  deletedAt: number | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface CreateLinkRequest {
  title: string;
  url: string;
  description?: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  linkType?: string;
  category?: string;
  displayOrder?: number;
  isActive?: boolean;
  scheduleStartAt?: number;
  scheduleEndAt?: number;
}

export interface UpdateLinkRequest {
  linkId: string;
  title?: string;
  url?: string;
  description?: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  linkType?: string;
  category?: string;
  displayOrder?: number;
  isActive?: boolean;
  scheduleStartAt?: number;
  scheduleEndAt?: number;
}

export interface ReorderLinksRequest {
  links: Array<{
    linkId: string;
    displayOrder: number;
  }>;
}

export interface BulkOperationRequest {
  linkIds: string[];
  action: 'delete' | 'archive' | 'activate' | 'deactivate' | 'restore';
}

export interface LinkDetailsQuery {
  linkId: string;
}

export interface LinkQuery {
  page?: number;
  limit?: number;
  search?: string;
  linkType?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  dateFrom?: number;
  dateTo?: number;
}

// AI Bio types
export interface GenerateBioRequest {
  tone?: 'professional' | 'casual' | 'humorous' | 'minimalist';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  includeLinks?: boolean;
  customPrompt?: string;
}

export interface GenerateBioResponse {
  text: string;
  tokensUsed: number;
  generationId: string;
}

export interface AiGeneration {
  id: string;
  userId: string;
  prompt: string;
  response: string | null;
  model: string;
  tokensInput: number | null;
  tokensOutput: number | null;
  tokensTotal: number | null;
  costUsd: number | null;
  tone: string | null;
  length: string | null;
  status: string;
  wasApplied: boolean;
  createdAt: number;
  updatedAt: number | null;
}

export interface AiHistoryResponse {
  generations: AiGeneration[];
  summary: {
    totalBios: number;
    totalTokensUsed: number;
  };
}

// Analytics types
export interface LinkAnalytics {
  linkId: string;
  clicks: number;
  views: number;
  clickRate: number;
  analytics?: any[];
  stats?: {
    total_clicks: number;
    unique_clicks: number;
    unique_countries: number;
    device_types_count: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LinkAnalyticsQuery {
  linkId: string;
  page?: number;
  limit?: number;
  eventType?: string;
  countryCode?: string;
  deviceType?: string;
  dateFrom?: number;
  dateTo?: number;
}

export interface AnalyticsOverview {
  totalViews: number;
  totalClicks: number;
  clickRate: number;
  topLinks: {
    linkId: string;
    title: string;
    url: string;
    clicks: number;
  }[];
}

// Settings types
export interface UpdateProfileRequest {
  displayName?: string;
  username?: string;
  bio?: string;
  bioText?: string;
  avatar?: File;
  avatar_url?: string;
  profession?: string;
}

export interface UpdateProfileResponse {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio_text: string | null;
  profession: string | null;
  theme_settings: Record<string, any>;
  plan: string;
  total_profile_views: number;
  last_login_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ThemePreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
