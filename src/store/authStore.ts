import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens } from '../types';
import { TOKEN_KEYS } from '../constants/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateTokens: (tokens: AuthTokens) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, tokens) => {
        sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      },
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      updateTokens: (tokens) => {
        sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
