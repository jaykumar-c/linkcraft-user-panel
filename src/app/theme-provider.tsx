import { useLayoutEffect } from 'react';
import { useThemeStore, THEME_PALETTES } from '../store/themeStore';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const DEFAULT_PALETTES = {
  light: 'default',
  dark: 'midnight',
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, palette, setPalette } = useThemeStore();

  const applyTheme = (themeValue: string) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeValue);
  };

  const applyPalette = (paletteKey: string) => {
    const pal = THEME_PALETTES[paletteKey];
    if (!pal) return;

    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(pal.primary));
    root.style.setProperty('--accent', hexToHsl(pal.accent));
    root.style.setProperty('--background', hexToHsl(pal.background));
    root.style.setProperty('--foreground', hexToHsl(pal.foreground));
    root.style.setProperty('--card', hexToHsl(pal.card));
    root.style.setProperty('--border', hexToHsl(pal.border));
    root.style.setProperty('--muted', hexToHsl(pal.muted));
    root.style.setProperty('--muted-foreground', hexToHsl(pal.foreground));
    root.style.setProperty('--input', hexToHsl(pal.border));
  };

  useLayoutEffect(() => {
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(effectiveTheme);
    
    const currentPalette = THEME_PALETTES[palette];
    if (!currentPalette || currentPalette.mode !== effectiveTheme) {
      const newPalette = DEFAULT_PALETTES[effectiveTheme as 'light' | 'dark'];
      setPalette(newPalette);
    }
  }, [theme, palette, setPalette]);

  useLayoutEffect(() => {
    applyPalette(palette);
  }, [palette]);

  return <>{children}</>;
}