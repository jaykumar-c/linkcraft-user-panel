import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode } from 'react';

export interface QueryConfig {
  staleTime?: number;
  gcTime?: number;
  retry?: number | false;
  retryDelay?: (retryCount: number) => number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  enabled?: boolean;
}

export interface MutationConfig {
  retry?: number | false;
  retryDelay?: (retryCount: number) => number;
}

const DEFAULT_QUERY_CONFIG: QueryConfig = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 3,
  retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
};

const DEFAULT_MUTATION_CONFIG: MutationConfig = {
  retry: 0,
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...DEFAULT_QUERY_CONFIG,
      },
      mutations: {
        ...DEFAULT_MUTATION_CONFIG,
      },
    },
  });
}

let globalQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!globalQueryClient) {
    globalQueryClient = createQueryClient();
  }
  return globalQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => ['auth', 'user'] as const,
    profile: () => ['auth', 'profile'] as const,
  },
  links: {
    all: ['links'] as const,
    lists: () => ['links', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['links', 'list', params] as const,
    details: (linkId: string) => ['links', 'details', linkId] as const,
    public: (username: string) => ['links', 'public', username] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    overview: () => ['analytics', 'overview'] as const,
    link: (linkId: string) => ['analytics', 'link', linkId] as const,
  },
  ai: {
    all: ['ai'] as const,
    history: () => ['ai', 'history'] as const,
    generations: () => ['ai', 'generations'] as const,
  },
  settings: {
    all: ['settings'] as const,
    sessions: () => ['settings', 'sessions'] as const,
  },
} as const;

export const queryClient = getQueryClient();