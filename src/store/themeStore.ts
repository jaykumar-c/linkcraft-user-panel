import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemePalette {
  name: string;
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  border: string;
  muted: string;
  mode: 'light' | 'dark';
}

export const THEME_PALETTES: Record<string, ThemePalette> = {
  // Light Mode Palettes
  default: {
    name: 'Classic Blue',
    primary: '#3b82f6',
    accent: '#60a5fa',
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    border: '#e2e8f0',
    muted: '#f1f5f9',
    mode: 'light',
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    accent: '#38bdf8',
    background: '#f0f9ff',
    foreground: '#0c4a6e',
    card: '#ffffff',
    border: '#bae6fd',
    muted: '#e0f2fe',
    mode: 'light',
  },
  emerald: {
    name: 'Emerald',
    primary: '#10b981',
    accent: '#34d399',
    background: '#ecfdf5',
    foreground: '#064e3b',
    card: '#ffffff',
    border: '#a7f3d0',
    muted: '#d1fae5',
    mode: 'light',
  },
  purple: {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    accent: '#a78bfa',
    background: '#f5f3ff',
    foreground: '#4c1d95',
    card: '#ffffff',
    border: '#ddd6fe',
    muted: '#ede9fe',
    mode: 'light',
  },
  rose: {
    name: 'Rose Pink',
    primary: '#f43f5e',
    accent: '#fb7185',
    background: '#fff1f2',
    foreground: '#881337',
    card: '#ffffff',
    border: '#fecdd3',
    muted: '#ffe4e6',
    mode: 'light',
  },
  amber: {
    name: 'Warm Amber',
    primary: '#f59e0b',
    accent: '#fbbf24',
    background: '#fffbeb',
    foreground: '#78350f',
    card: '#ffffff',
    border: '#fde68a',
    muted: '#fef3c7',
    mode: 'light',
  },
  slate: {
    name: 'Slate Gray',
    primary: '#64748b',
    accent: '#94a3b8',
    background: '#f8fafc',
    foreground: '#1e293b',
    card: '#ffffff',
    border: '#cbd5e1',
    muted: '#f1f5f9',
    mode: 'light',
  },
  teal: {
    name: 'Teal',
    primary: '#14b8a6',
    accent: '#2dd4bf',
    background: '#f0fdfa',
    foreground: '#134e4a',
    card: '#ffffff',
    border: '#99f6e4',
    muted: '#ccfbf1',
    mode: 'light',
  },
  // Dark Mode Palettes
  midnight: {
    name: 'Midnight',
    primary: '#6366f1',
    accent: '#818cf8',
    background: '#0f0d1a',
    foreground: '#e2e8f0',
    card: '#1a1625',
    border: '#312e4a',
    muted: '#252136',
    mode: 'dark',
  },
  oceanDark: {
    name: 'Deep Ocean',
    primary: '#0ea5e9',
    accent: '#38bdf8',
    background: '#031b29',
    foreground: '#e0f2fe',
    card: '#0c2440',
    border: '#164d6a',
    muted: '#0a1929',
    mode: 'dark',
  },
  emeraldDark: {
    name: 'Forest Night',
    primary: '#10b981',
    accent: '#34d399',
    background: '#031b0f',
    foreground: '#d1fae5',
    card: '#052e1f',
    border: '#145240',
    muted: '#021a12',
    mode: 'dark',
  },
  purpleDark: {
    name: 'Venom',
    primary: '#a855f7',
    accent: '#c084fc',
    background: '#150a20',
    foreground: '#f3e8ff',
    card: '#1f1030',
    border: '#3b1a5a',
    muted: '#10081a',
    mode: 'dark',
  },
  roseDark: {
    name: 'Ruby Dark',
    primary: '#f43f5e',
    accent: '#fb7188',
    background: '#1f080d',
    foreground: '#ffe4e6',
    card: '#2c0e16',
    border: '#5c1a24',
    muted: '#15040a',
    mode: 'dark',
  },
  crimsonDark: {
    name: 'Crimson',
    primary: '#dc2626',
    accent: '#ef4444',
    background: '#1a0505',
    foreground: '#fef2f2',
    card: '#260b0b',
    border: '#4c1010',
    muted: '#0f0303',
    mode: 'dark',
  },
  slateDark: {
    name: 'Charcoal',
    primary: '#94a3b8',
    accent: '#64748b',
    background: '#0f172a',
    foreground: '#e2e8f0',
    card: '#1e293b',
    border: '#334155',
    muted: '#0f172a',
    mode: 'dark',
  },
  // Universal Palettes (work in both light and dark mode)
  cosmic: {
    name: 'Cosmic Purple',
    primary: '#8b5cf6',
    accent: '#c084fc',
    background: '#090812',
    foreground: '#f1f5f9',
    card: '#12121c',
    border: '#2e2a4a',
    muted: '#1e1a2e',
    mode: 'dark',
  },
  sunsetGlow: {
    name: 'Sunset Glow',
    primary: '#f97316',
    accent: '#fb923c',
    background: '#0c0a0a',
    foreground: '#fafaf9',
    card: '#161616',
    border: '#2e2a2a',
    muted: '#1e1a1a',
    mode: 'dark',
  },
  aurora: {
    name: 'Aurora Green',
    primary: '#22d3ee',
    accent: '#67e8f9',
    background: '#071a1f',
    foreground: '#ecfeff',
    card: '#0d1f26',
    border: '#1e3a47',
    muted: '#162d38',
    mode: 'dark',
  },
  roseGlow: {
    name: 'Rose Gold',
    primary: '#f43f5e',
    accent: '#fb7185',
    background: '#120b0d',
    foreground: '#fef2f2',
    card: '#1a1012',
    border: '#2e1f22',
    muted: '#1e1518',
    mode: 'dark',
  },
  // Universal Light Palettes
  arctic: {
    name: 'Arctic White',
    primary: '#0284c7',
    accent: '#0ea5e9',
    background: '#f8fafc',
    foreground: '#0f172a',
    card: '#ffffff',
    border: '#e2e8f0',
    muted: '#f1f5f9',
    mode: 'light',
  },
  nordic: {
    name: 'Nordic Gray',
    primary: '#475569',
    accent: '#64748b',
    background: '#f1f5f9',
    foreground: '#1e293b',
    card: '#ffffff',
    border: '#cbd5e1',
    muted: '#e2e8f0',
    mode: 'light',
  },
};

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  palette: string;
  setPalette: (palette: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      palette: 'default',
      setPalette: (palette) => set({ palette }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
