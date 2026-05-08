// API base URL - configure based on environment
const env = import.meta.env as { VITE_API_BASE_URL?: string };
export const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  // Profile endpoints
  PROFILE: {
    GET: '/users/profile',
    UPDATE: '/users/profile',
    UPLOAD_AVATAR: '/profile/avatar',
  },
  // Links endpoints - Updated to use body/query instead of params
  LINKS: {
    LIST: '/links/list',
    CREATE: '/links/create',
    DETAILS: '/links/details',
    UPDATE: '/links/update',
    DELETE: '/links/delete',
    RESTORE: '/links/restore',
    REORDER: '/links/reorder',
    TOGGLE_STATUS: '/links/toggle-status',
    BULK_OPERATION: '/links/bulk-operation',
    PUBLIC: '/links/public',
  },
  // AI Bio endpoints
  AI_BIO: {
    GENERATE: API_BASE_URL + '/api/v1/ai/generate',
    HISTORY: API_BASE_URL + '/api/v1/ai/history',
    APPLY: API_BASE_URL + '/api/v1/ai/apply',
  },
  // Analytics endpoints
  ANALYTICS: {
    TRACK: '/analytics/track',
    LINK: '/analytics/link',
    OVERVIEW: '/analytics/overview',
  },
  // Health endpoint (public)
  HEALTH: {
    CHECK: '/health',
  },
// Settings endpoints
  SETTINGS: {
    PROFILE: '/settings/profile',
    PASSWORD: '/settings/password',
    SESSIONS: '/settings/sessions',
    DELETE_ACCOUNT: '/settings/account',
  },
  // Auth endpoints for logout all
  AUTH_LOGOUT: {
    LOGOUT_ALL: '/auth/logout-all',
  },
  // Storage endpoints
  STORAGE: {
    UPLOAD: '/storage/upload',
    UPLOAD_BULK: '/storage/upload/bulk',
    DELETE: '/storage/file',
    DOWNLOAD: '/storage/download',
  },
} as const;

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
