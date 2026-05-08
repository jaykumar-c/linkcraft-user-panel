import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from './use-toast';
import * as settingsApi from '../services/settings.service';
import { ChangePasswordRequest } from '../types';

// Change password hook
export const useChangePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => settingsApi.changePassword(data),
    onSuccess: () => {
      toast({
        title: 'Password changed',
        description: 'Your password has been successfully changed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Change failed',
        description: error.message || 'Unable to change password.',
        variant: 'destructive',
      });
    },
  });
};

// Get sessions hook
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: settingsApi.getSessions,
  });
};

// Revoke session hook
export const useRevokeSession = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => settingsApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Session revoked',
        description: 'The session has been successfully revoked.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Revoke failed',
        description: error.message || 'Unable to revoke session.',
        variant: 'destructive',
      });
    },
  });
};

// Revoke all sessions hook
export const useRevokeAllSessions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsApi.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'All sessions revoked',
        description: 'All sessions have been successfully revoked.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Revoke failed',
        description: error.message || 'Unable to revoke sessions.',
        variant: 'destructive',
      });
    },
  });
};

// Delete account hook
export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsApi.deleteAccount(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted.',
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Unable to delete account.',
        variant: 'destructive',
      });
    },
  });
};
