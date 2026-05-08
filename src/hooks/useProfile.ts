import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import * as profileApi from '../services/profile.service';
import { useAuthStore } from '../store/authStore';
import type { UpdateProfileRequest } from '../types';

// Get profile hook
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });
};

// Update profile hook
export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({ ...currentUser, ...data });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Unable to update profile.',
        variant: 'destructive',
      });
    },
  });
};

// Upload avatar hook - uses Cloudinary storage API
export const useUploadAvatar = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Upload to Cloudinary
      const result = await profileApi.uploadAvatar(file);
      // Update profile with avatar_url
      await profileApi.updateProfile({ avatar_url: result.avatar });
      return result;
    },
    onSuccess: (data) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({ ...currentUser, avatar: data.avatar, avatar_url: data.avatar });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Avatar uploaded',
        description: 'Your avatar has been successfully updated.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Unable to upload avatar.',
        variant: 'destructive',
      });
    },
  });
};