import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import { User, UpdateProfileRequest } from '../types';
import * as storageService from './storage.service';

// Get profile
export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<{ data: User }>(API_ENDPOINTS.PROFILE.GET);
  return response.data.data;
};

// Update profile
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await axiosInstance.patch<{ data: User }>(API_ENDPOINTS.PROFILE.UPDATE, data);
  return response.data.data;
};

// Upload avatar
export const uploadAvatar = async (file: File): Promise<{ avatar: string; uploadId: string }> => {
  const result = await storageService.uploadFile(file);
  return { avatar: result.secureUrl, uploadId: result.id };
};

// Delete avatar file
export const deleteAvatar = async (mediaId: string): Promise<void> => {
  await storageService.deleteFile(mediaId);
};
