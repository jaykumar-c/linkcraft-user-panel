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
  // ── Light Mode ──────────────────────────────────────────────
  default: {
    name: 'Azure',
    primary: '#2563eb',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    border: '#e2e8f0',
    muted: '#f1f5f9',
    mode: 'light',
  },
  indigo: {
    name: 'Indigo',
    primary: '#4f46e5',
    accent: '#6366f1',
    background: '#f8faff',
    foreground: '#1e1b4b',
    card: '#ffffff',
    border: '#e0e7ff',
    muted: '#eef2ff',
    mode: 'light',
  },
  sage: {
    name: 'Sage',
    primary: '#059669',
    accent: '#10b981',
    background: '#f0fdf4',
    foreground: '#022c22',
    card: '#ffffff',
    border: '#bbf7d0',
    muted: '#dcfce7',
    mode: 'light',
  },
  coral: {
    name: 'Coral',
    primary: '#e11d48',
    accent: '#f43f5e',
    background: '#fff8f8',
    foreground: '#881337',
    card: '#ffffff',
    border: '#fecdd3',
    muted: '#ffe4e6',
    mode: 'light',
  },
  amber: {
    name: 'Amber',
    primary: '#d97706',
    accent: '#f59e0b',
    background: '#fffdf5',
    foreground: '#451a03',
    card: '#ffffff',
    border: '#fde68a',
    muted: '#fef3c7',
    mode: 'light',
  },
  violet: {
    name: 'Violet',
    primary: '#7c3aed',
    accent: '#8b5cf6',
    background: '#f8f6ff',
    foreground: '#3b0764',
    card: '#ffffff',
    border: '#ddd6fe',
    muted: '#ede9fe',
    mode: 'light',
  },
  sky: {
    name: 'Sky Blue',
    primary: '#0284c7',
    accent: '#0ea5e9',
    background: '#f0f9ff',
    foreground: '#082f49',
    card: '#ffffff',
    border: '#bae6fd',
    muted: '#e0f2fe',
    mode: 'light',
  },
  blush: {
    name: 'Blush',
    primary: '#db2777',
    accent: '#ec4899',
    background: '#fdf2f8',
    foreground: '#831843',
    card: '#ffffff',
    border: '#fbcfe8',
    muted: '#fce7f3',
    mode: 'light',
  },

  // ── Dark Mode ───────────────────────────────────────────────
  midnight: {
    name: 'Midnight Blue',
    primary: '#3b82f6',
    accent: '#60a5fa',
    background: '#080c18',
    foreground: '#e2e8f0',
    card: '#0f1729',
    border: '#1e2a45',
    muted: '#131d33',
    mode: 'dark',
  },
  obsidian: {
    name: 'Obsidian',
    primary: '#818cf8',
    accent: '#6366f1',
    background: '#0b0b14',
    foreground: '#e4e4e7',
    card: '#13131f',
    border: '#23233a',
    muted: '#181828',
    mode: 'dark',
  },
  ember: {
    name: 'Ember',
    primary: '#f97316',
    accent: '#fb923c',
    background: '#0d0806',
    foreground: '#fafaf9',
    card: '#16100c',
    border: '#2e1f18',
    muted: '#1d1510',
    mode: 'dark',
  },
  forest: {
    name: 'Forest',
    primary: '#22c55e',
    accent: '#4ade80',
    background: '#060e08',
    foreground: '#f0fdf4',
    card: '#0c1a10',
    border: '#1a3622',
    muted: '#122618',
    mode: 'dark',
  },
  plum: {
    name: 'Plum',
    primary: '#a855f7',
    accent: '#c084fc',
    background: '#0e0818',
    foreground: '#f3e8ff',
    card: '#1a0f2e',
    border: '#2e1a4a',
    muted: '#1e1230',
    mode: 'dark',
  },
  steel: {
    name: 'Steel',
    primary: '#94a3b8',
    accent: '#64748b',
    background: '#0b0e14',
    foreground: '#e2e8f0',
    card: '#12171f',
    border: '#1e2736',
    muted: '#181f2a',
    mode: 'dark',
  },
  ruby: {
    name: 'Ruby',
    primary: '#ef4444',
    accent: '#f87171',
    background: '#0f0808',
    foreground: '#fef2f2',
    card: '#1a0d0d',
    border: '#301818',
    muted: '#201010',
    mode: 'dark',
  },
  nebula: {
    name: 'Nebula',
    primary: '#06b6d4',
    accent: '#22d3ee',
    background: '#070e13',
    foreground: '#ecfeff',
    card: '#0c1a22',
    border: '#16303d',
    muted: '#12222b',
    mode: 'dark',
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
