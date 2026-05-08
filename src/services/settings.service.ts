import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import { ChangePasswordRequest } from '../types';

// Change password
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.SETTINGS.PASSWORD, data);
};

// Get active sessions
export const getSessions = async (): Promise<any[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.SETTINGS.SESSIONS);
  return response.data;
};

// Revoke session
export const revokeSession = async (sessionId: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.SETTINGS.SESSIONS}/${sessionId}`);
};

// Revoke all sessions
export const revokeAllSessions = async (): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AUTH_LOGOUT.LOGOUT_ALL);
};

// Delete account
export const deleteAccount = async (): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.SETTINGS.DELETE_ACCOUNT);
};
