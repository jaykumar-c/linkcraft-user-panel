import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import * as authApi from '../services/auth.service';

interface UsernameCheckState {
  isChecking: boolean;
  isAvailable: boolean;
  message: string;
}

export function useUsernameCheck(username: string) {
  const [state, setState] = useState<UsernameCheckState>({ isChecking: false, isAvailable: false, message: '' });
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setState({ isChecking: false, isAvailable: false, message: '' });
      return;
    }

    let cancelled = false;
    setState(prev => ({ ...prev, isChecking: true }));

    authApi.checkUsername(debouncedUsername)
      .then((result) => {
        if (!cancelled) {
          setState({ isChecking: false, isAvailable: result.available, message: result.message });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ isChecking: false, isAvailable: false, message: '' });
        }
      });

    return () => { cancelled = true; };
  }, [debouncedUsername]);

  return state;
}
