import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, HTTP_STATUS, TOKEN_KEYS } from '../constants/api';
import { extractBackendError, getErrorCodeMessage } from '../constants/error-codes';

export interface RetryConfig {
  retries: number;
  retryDelay: (retryCount: number) => number;
  retryCondition?: (error: AxiosError) => boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  retries: 3,
  retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
  retryCondition: (error) => {
    if (!error.response) return true;
    const status = error.response.status;
    return status === 0 || status === 408 || status === 429 || status >= 500;
  },
};

export interface AxiosClientConfig {
  baseURL?: string;
  timeout?: number;
  retryConfig?: Partial<RetryConfig>;
}

function createAxiosClient(config?: AxiosClientConfig) {
  const axiosInstance = axios.create({
    baseURL: config?.baseURL ?? API_BASE_URL,
    timeout: config?.timeout ?? 30000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false,
  });

  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config?.retryConfig };

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = sessionStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers['X-CSRF-Token'] = getCsrfToken();

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        originalRequest._retryCount = 0;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          isRefreshing = false;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          isRefreshing = false;

          sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);

          window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));

          return Promise.reject(refreshError);
        }
      }

      if (retryConfig.retryCondition?.(error) && originalRequest) {
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

        if (originalRequest._retryCount <= retryConfig.retries) {
          const delay = retryConfig.retryDelay(originalRequest._retryCount);

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(axiosInstance(originalRequest));
            }, delay);
          });
        }
      }

      const backendError = extractBackendError(error);
      if (backendError) {
        const mapped = getErrorCodeMessage(backendError.errorCode);
        if (backendError.errorCode === 'VAL001' && backendError.error) {
          error.message = backendError.error;
        } else if (mapped) {
          error.message = mapped.message;
        } else {
          error.message = backendError.error || backendError.message;
        }
        (error as any).errorCode = backendError.errorCode;
        (error as any).errorDetail = backendError.error;
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

function getCsrfToken(): string | null {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') ?? null;
}

export const axiosClient = createAxiosClient();

export const httpClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return axiosClient.get<T>(url, config);
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosClient.post<T>(url, data, config);
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosClient.put<T>(url, data, config);
  },
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosClient.patch<T>(url, data, config);
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return axiosClient.delete<T>(url, config);
  },
};

export function createCancelToken() {
  return axios.CancelToken.source();
}

export function isCancel(error: unknown): boolean {
  return axios.isCancel(error);
}

export default axiosClient;