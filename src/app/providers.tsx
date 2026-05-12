import { QueryProvider } from '../lib/react-query';
import { ThemeProvider } from '../app/theme-provider';
import { Toaster } from '../components/ui/toaster';
import { GlobalErrorHandler } from '../components/GlobalErrorHandler';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <Toaster />
        <GlobalErrorHandler />
      </QueryProvider>
    </ThemeProvider>
  );
}