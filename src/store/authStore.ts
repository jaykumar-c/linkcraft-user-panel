import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens } from '../types';
import { TOKEN_KEYS } from '../constants/api';
import { APP_EVENTS } from '../constants/app';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: (reason?: string) => void;
  updateTokens: (tokens: AuthTokens) => void;
  updateLastActivity: () => void;
  checkSessionExpiry: () => boolean;
}

const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: Date.now(),

      setAuth: (user, tokens) => {
        sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false, 
          lastActivity: Date.now() 
        });
        
        localStorage.setItem('auth_state', JSON.stringify({
          isAuthenticated: true,
          lastActivity: Date.now(),
        }));
        
        window.dispatchEvent(new Event('storage'));
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: (reason = 'manual') => {
        sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem('auth_state');
        
        set({ user: null, isAuthenticated: false, isLoading: false });
        
        window.dispatchEvent(new CustomEvent(APP_EVENTS.authLogout, { 
          detail: { reason } 
        }));
        
        window.dispatchEvent(new Event('storage'));
      },

      updateTokens: (tokens) => {
        sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        
        set({ lastActivity: Date.now() });
        
        localStorage.setItem('auth_state', JSON.stringify({
          isAuthenticated: true,
          lastActivity: Date.now(),
        }));
      },

      updateLastActivity: () => {
        set({ lastActivity: Date.now() });
        localStorage.setItem('auth_state', JSON.stringify({
          isAuthenticated: true,
          lastActivity: Date.now(),
        }));
      },

      checkSessionExpiry: () => {
        const state = get();
        const timeSinceLastActivity = Date.now() - state.lastActivity;
        return timeSinceLastActivity > SESSION_EXPIRY_MS;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
      }),
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth_state') {
      const authState = localStorage.getItem('auth_state');
      
      if (!authState) {
        const currentAuth = useAuthStore.getState();
        if (currentAuth.isAuthenticated) {
          currentAuth.logout('session_expired');
        }
      }
    }
  });

  window.addEventListener(APP_EVENTS.authLogout, () => {
    window.location.href = '/login';
  });

  const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;

  const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    
    const auth = useAuthStore.getState();
    if (auth.isAuthenticated) {
      idleTimer = setTimeout(() => {
        auth.logout('idle_timeout');
      }, IDLE_TIMEOUT_MS);
    }
  };

  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  events.forEach((event) => {
    window.addEventListener(event, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
}