import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  AuthTokens,
  User,
} from '../types';

// Login
export const login = async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
  const response = await axiosInstance.post<{ data: { accessToken: string; refreshToken: string; user: User } }>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  const { accessToken, refreshToken, user } = response.data.data;
  return { user, tokens: { accessToken, refreshToken } };
};

// Register
export const register = async (credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
  const response = await axiosInstance.post<{ data: { accessToken: string; refreshToken: string; user: User } }>(API_ENDPOINTS.AUTH.REGISTER, credentials);
  const { accessToken, refreshToken, user } = response.data.data;
  return { user, tokens: { accessToken, refreshToken } };
};

// Logout
export const logout = async (refreshToken: string): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
};

// Refresh token
export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await axiosInstance.post<{ data: AuthTokens }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  return response.data.data;
};

// Forgot password
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
};

// Reset password
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};

// Verify email
export const verifyEmail = async (data: VerifyEmailRequest): Promise<{ user: User }> => {
  const response = await axiosInstance.post<{ data: { user: User } }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
  return response.data.data;
};

// Check username availability
export const checkUsername = async (username: string): Promise<{ available: boolean; message: string }> => {
  const response = await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK_USERNAME, {
    params: { username },
  });
  return response.data.data;
};
