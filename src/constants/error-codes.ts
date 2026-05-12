import { AxiosError } from 'axios';

interface ErrorCodeMap {
  title: string;
  message: string;
}

type ErrorCodeMappings = Record<string, ErrorCodeMap>;

const ERROR_CODE_MAP: ErrorCodeMappings = {
  // Health
  HEC001: { title: 'Health Check Failed', message: 'Service health check failed.' },

  // Auth — Registration / Login
  ACR009: { title: 'Registration Failed', message: 'Email is already registered.' },
  ACR010: { title: 'Registration Failed', message: 'Username is already taken.' },
  ACR011: { title: 'Login Failed', message: 'Invalid email or password.' },
  ACR012: { title: 'Account Disabled', message: 'Account is disabled or deleted.' },
  ACR013: { title: 'Session Expired', message: 'Refresh token is invalid or expired.' },
  ACR014: { title: 'Reset Failed', message: 'Account is disabled. Cannot reset password.' },
  ACR015: { title: 'Email Already Sent', message: 'A reset email has already been sent. Please wait before requesting again.' },

  // Auth — Reset Password
  ARP001: { title: 'Reset Password Failed', message: 'New password is required.' },
  ARP002: { title: 'Reset Password Failed', message: 'Invalid reset token.' },
  ARP003: { title: 'Reset Password Failed', message: 'Reset token has expired. Please request a new one.' },
  ARP004: { title: 'Reset Password Failed', message: 'Password reset not available for this account.' },
  ARP005: { title: 'Reset Password Failed', message: 'New password cannot be the same as your current password.' },

  // Auth — Change Password
  ACP001: { title: 'Change Password Failed', message: 'Account not found.' },
  ACP002: { title: 'Change Password Failed', message: 'Account is disabled. Cannot change password.' },
  ACP003: { title: 'Change Password Failed', message: 'Password change is not available for OAuth accounts.' },
  ACP004: { title: 'Change Password Failed', message: 'Current password is incorrect.' },
  ACP005: { title: 'Change Password Failed', message: 'New password cannot be the same as your current password.' },

  // Auth — JWT Strategy
  AUTH013: { title: 'Session Expired', message: 'Access token is invalid or expired.' },
  AUTH005: { title: 'Account Disabled', message: 'Account is disabled or deleted.' },

  // Users / Profile
  USER001: { title: 'Profile Error', message: 'User not found.' },

  // Links — Service errors
  LNK001: { title: 'Link Creation Failed', message: 'A link with this URL already exists.' },
  LNK003: { title: 'Link Not Found', message: 'Link not found or you do not have permission.' },
  LNK005: { title: 'Link Not Found', message: 'Link not found or you do not have permission.' },
  LNK007: { title: 'Link Restore Failed', message: 'Link not found or is not deleted.' },
  LNK009: { title: 'Link Not Found', message: 'Link not found or you do not have permission.' },
  LNK012: { title: 'Reorder Failed', message: 'No links provided for reordering.' },
  LNK014: { title: 'Reorder Failed', message: 'Failed to reorder links.' },
  LNK015: { title: 'Link Not Found', message: 'Link not found or you do not have permission.' },
  LNK017: { title: 'Bulk Operation Failed', message: 'No valid links found for bulk operation.' },

  // Analytics — Service errors
  ANC001: { title: 'Tracking Failed', message: 'Link not found or inactive.' },
  ANC003: { title: 'Analytics Failed', message: 'Link not found or you do not have permission.' },

  // Storage — Service errors
  STG001: { title: 'Upload Failed', message: 'No file provided.' },
  STG002: { title: 'Upload Failed', message: 'File size exceeds the maximum allowed size.' },
  STG003: { title: 'Upload Failed', message: 'Upload failed. Please try again.' },
  STG004: { title: 'Upload Failed', message: 'No files provided.' },
  STG005: { title: 'Upload Failed', message: 'File exceeds the maximum allowed size.' },
  STG006: { title: 'Upload Failed', message: 'Maximum number of files exceeded.' },
  STG007: { title: 'Upload Failed', message: 'Bulk upload failed.' },
  STG008: { title: 'File Not Found', message: 'File not found.' },
  STG009: { title: 'Delete Failed', message: 'Delete failed. Please try again.' },
  STG010: { title: 'Download Failed', message: 'File ID is required.' },
  STG011: { title: 'Download Failed', message: 'Failed to generate download URL.' },
  STG012: { title: 'Upload Failed', message: 'File type not allowed. Only JPEG, PNG, WebP, and PDF files are accepted.' },
  STG013: { title: 'Upload Failed', message: 'File extension not allowed.' },
  STG014: { title: 'Upload Failed', message: 'No files provided.' },

  // Validation
  VAL001: { title: 'Validation Error', message: 'Please check your input and try again.' },

  // HTTP Errors
  ERR401: { title: 'Unauthorized', message: 'Your session has expired. Please login again.' },
  ERR403: { title: 'Forbidden', message: 'You do not have permission to perform this action.' },
  ERR404: { title: 'Not Found', message: 'The requested resource was not found.' },
  ERR409: { title: 'Conflict', message: 'This resource already exists.' },
  ERR500: { title: 'Server Error', message: 'An unexpected server error occurred. Please try again later.' },
};

const SUCCESS_CODE_MAP: ErrorCodeMappings = {
  // Health
  HEC001: { title: 'Health Check', message: 'API is running.' },

  // Auth — Controller responses
  ACR001: { title: 'Welcome!', message: 'Your account has been created successfully.' },
  ACR002: { title: 'Welcome back!', message: 'You have been successfully logged in.' },
  ACR003: { title: 'Session Refreshed', message: 'Token refreshed successfully.' },
  ACR004: { title: 'Logged Out', message: 'You have been successfully logged out.' },
  ACR005: { title: 'Logged Out', message: 'All other sessions logged out successfully.' },
  ACR006: { title: 'Email Sent', message: 'Check your email for password reset instructions.' },
  ACR007: { title: 'Password Reset', message: 'Your password has been successfully reset.' },
  ACR021: { title: 'Password Changed', message: 'Your password has been successfully changed.' },

  // Auth — Service responses
  LNK002: { title: 'Link Created', message: 'Your link has been successfully created.' },
  LNK004: { title: 'Link Updated', message: 'Your link has been successfully updated.' },
  LNK006: { title: 'Link Deleted', message: 'Your link has been successfully deleted.' },
  LNK008: { title: 'Link Restored', message: 'Your link has been successfully restored.' },
  LNK013: { title: 'Links Reordered', message: 'Your links have been reordered.' },
  LNK016: { title: 'Status Updated', message: 'Link status has been updated.' },
  LNK018: { title: 'Bulk Operation Completed', message: 'Bulk operation completed successfully.' },

  // Users / Profile
  UCP001: { title: 'Profile Fetched', message: 'Profile fetched successfully.' },
  UCP002: { title: 'Profile Updated', message: 'Your profile has been successfully updated.' },

  // Links — Controller responses
  LNC001: { title: 'Link Created', message: 'Your link has been successfully created.' },
  LNC002: { title: 'Link Updated', message: 'Your link has been successfully updated.' },
  LNC003: { title: 'Link Deleted', message: 'Your link has been successfully deleted.' },
  LNC004: { title: 'Link Restored', message: 'Your link has been successfully restored.' },
  LNC007: { title: 'Links Reordered', message: 'Your links have been reordered.' },
  LNC008: { title: 'Status Updated', message: 'Link status has been updated.' },
  LNC009: { title: 'Bulk Operation Completed', message: 'Bulk operation completed successfully.' },

  // Analytics
  ANC002: { title: 'Click Tracked', message: 'Click tracked successfully.' },
  ANC006: { title: 'Click Tracked', message: 'Click tracked successfully.' },

  // AI
  AIC002: { title: 'Bio Applied', message: 'AI bio has been applied to your profile.' },

  // Storage — Controller responses
  STC001: { title: 'Upload Successful', message: 'File uploaded successfully.' },
  STC002: { title: 'Upload Successful', message: 'Some files were uploaded successfully.' },
  STC003: { title: 'File Deleted', message: 'File deleted successfully.' },
};

export function getErrorCodeMessage(errorCode: string): ErrorCodeMap | undefined {
  return ERROR_CODE_MAP[errorCode];
}

export function getSuccessCodeMessage(errorCode: string): ErrorCodeMap | undefined {
  return SUCCESS_CODE_MAP[errorCode];
}

export interface BackendError {
  message: string;
  errorCode: string;
  data: Record<string, unknown>;
  error: string;
}

export function extractBackendError(error: unknown): BackendError | null {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as Record<string, unknown>;
    if (
      typeof data.message === 'string' &&
      typeof data.errorCode === 'string' &&
      typeof data.error === 'string'
    ) {
      return {
        message: data.message,
        errorCode: data.errorCode,
        data: (data.data as Record<string, unknown>) || {},
        error: data.error,
      };
    }
  }
  return null;
}

export function getToastFromError(error: unknown): { title: string; description: string; isValidation: boolean } {
  const backendError = extractBackendError(error);
  if (!backendError) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { title: 'Error', description: message, isValidation: false };
  }

  const { errorCode, error: errorDetail, message } = backendError;
  const mapped = getErrorCodeMessage(errorCode);

  if (errorCode === 'VAL001' && errorDetail) {
    return { title: mapped?.title || 'Validation Error', description: errorDetail, isValidation: true };
  }

  return {
    title: mapped?.title || 'Error',
    description: mapped?.message || message || 'An unexpected error occurred.',
    isValidation: false,
  };
}
