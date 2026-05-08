import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';

export interface UploadedFile {
  publicId: string;
  secureUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  extension: string;
  uploadedAt: string;
}

export interface BulkUploadResponse {
  uploaded: UploadedFile[];
  failed: { originalName: string; error: string }[];
}

// Single file upload
export const uploadFile = async (file: File): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post(API_ENDPOINTS.STORAGE.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// Bulk file upload
export const uploadFiles = async (files: File[]): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  const response = await axiosInstance.post(API_ENDPOINTS.STORAGE.UPLOAD_BULK, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// Delete file
export const deleteFile = async (publicId: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.STORAGE.DELETE, { data: { publicId } });
};

// Generate download URL
export const generateDownloadUrl = async (publicId: string, expiresIn?: string): Promise<string> => {
  const response = await axiosInstance.get(API_ENDPOINTS.STORAGE.DOWNLOAD, {
    params: { publicId, expiresIn },
  });
  return response.data.data.url;
};