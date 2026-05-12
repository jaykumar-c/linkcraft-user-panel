export const APP_CONFIG = {
  name: 'LinkCraft AI',
  version: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  environment: import.meta.env.MODE ?? 'development',
  apiUrl: import.meta.env.VITE_API_URL,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  dashboard: '/dashboard',
  links: '/dashboard/links',
  aiBio: '/dashboard/ai-bio',
  analytics: '/dashboard/analytics',
  preview: '/dashboard/preview',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

export const VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
  },
  displayName: {
    minLength: 1,
    maxLength: 50,
  },
  linkTitle: {
    maxLength: 200,
  },
  linkUrl: {
    maxLength: 2048,
  },
  bio: {
    maxLength: 500,
  },
} as const;

export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

export const CACHE_TIME = {
  short: 60 * 1000,
  medium: 5 * 60 * 1000,
  long: 10 * 60 * 1000,
  veryLong: 30 * 60 * 1000,
} as const;

export const ERROR_MESSAGES = {
  network: 'Please check your internet connection and try again.',
  server: 'Server error. Please try again later.',
  unauthorized: 'Your session has expired. Please login again.',
  forbidden: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  unknown: 'An unexpected error occurred. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  created: 'Successfully created.',
  updated: 'Successfully updated.',
  deleted: 'Successfully deleted.',
  saved: 'Successfully saved.',
  copied: 'Copied to clipboard.',
} as const;

export const APP_EVENTS = {
  authLogout: 'auth:logout',
  themeChange: 'theme:change',
  languageChange: 'language:change',
  sessionExpired: 'session:expired',
} as const;