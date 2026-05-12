import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string | null;
}

const SLOW_CONNECTION_THRESHOLD = 5000;

interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    if (typeof navigator === 'undefined') {
      return { isOnline: true, isSlowConnection: false, connectionType: null };
    }
    return { isOnline: navigator.onLine, isSlowConnection: false, connectionType: null };
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    const nav = navigator as Navigator & { connection?: NetworkInformation };
    const connection = nav.connection;

    if (connection) {
      const handleConnectionChange = () => {
        const isSlow = connection.downlink < 1 || connection.rtt > SLOW_CONNECTION_THRESHOLD;
        setStatus({
          isOnline: navigator.onLine,
          isSlowConnection: isSlow,
          connectionType: connection.effectiveType,
        });
      };

      connection.addEventListener('change', handleConnectionChange);

      const isSlow = connection.downlink < 1 || connection.rtt > SLOW_CONNECTION_THRESHOLD;
      setStatus({
        isOnline: navigator.onLine,
        isSlowConnection: isSlow,
        connectionType: connection.effectiveType,
      });

      return () => {
        connection.removeEventListener('change', handleConnectionChange);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}