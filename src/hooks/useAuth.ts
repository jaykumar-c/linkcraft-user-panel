import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from './use-toast';
import * as authApi from '../services/auth.service';
import { LoginCredentials, RegisterCredentials, ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from '../types';
import { TOKEN_KEYS } from '../constants/api';

// Login hook
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApi.login(credentials),

    onSuccess: (response) => {
      const { user, tokens } = response;
      setAuth(user, tokens);

      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });

      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
        variant: 'success',
      });

      navigate('/dashboard');
    },

    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    },
  });
};

// Register hook
export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),

    onSuccess: (response) => {
      const { user, tokens } = response;
      setAuth(user, tokens);

      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      toast({
        title: 'Welcome!',
        description: 'Your account has been created successfully.',
        variant: 'success',
      });

      navigate('/dashboard');
    },

    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Unable to create account.',
        variant: 'destructive',
      });
    },
  });
};

// Logout hook
export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
      return authApi.logout(refreshToken || '');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
        variant: 'success',
      });
      navigate('/login');
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
};

// Forgot password hook
export const useForgotPassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast({
        title: 'Email sent',
        description: 'Check your email for password reset instructions.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send email',
        description: error.message || 'Unable to send reset email.',
        variant: 'destructive',
      });
    },
  });
};

// Reset password hook
export const useResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast({
        title: 'Password reset',
        description: 'Your password has been successfully reset.',
        variant: 'success',
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      toast({
        title: 'Reset failed',
        description: error.message || 'Unable to reset password.',
        variant: 'destructive',
      });
    },
  });
};

// Verify email hook
export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: (data) => {
      setAuth(data.user, { accessToken: '', refreshToken: '' });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: 'Email verified',
        description: 'Your email has been successfully verified.',
        variant: 'success',
      });
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: 'Verification failed',
        description: error.message || 'Unable to verify email.',
        variant: 'destructive',
      });
    },
  });
};
