import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APP_EVENTS } from '@/constants/app';

export function GlobalErrorHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      const reason = event.reason as { response?: { status?: number }; code?: string; message?: string };
      
      if (reason?.response?.status === 503) {
        toast({
          title: 'Service Unavailable',
          description: 'The server is temporarily unavailable. Please try again later.',
          variant: 'destructive',
        });
      } else if (reason?.code === 'ERR_NETWORK' || reason?.message === 'Network Error') {
        toast({
          title: 'Network Error',
          description: 'Please check your internet connection and try again.',
          variant: 'destructive',
        });
      }
    };

    const handleAuthLogout = (event: Event) => {
      const customEvent = event as CustomEvent<{ reason?: string }>;
      const reason = customEvent.detail?.reason;
      
      if (reason !== 'manual') {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please login again.',
          variant: 'destructive',
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener(APP_EVENTS.authLogout, handleAuthLogout);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener(APP_EVENTS.authLogout, handleAuthLogout);
    };
  }, [toast]);

  return null;
}