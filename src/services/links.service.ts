import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import {
  Link,
  CreateLinkRequest,
  UpdateLinkRequest,
  ReorderLinksRequest,
  BulkOperationRequest,
  LinkDetailsQuery,
  LinkQuery,
  LinkAnalytics,
} from '../types';

// Get all links with pagination and filters
export const getLinks = async (params?: LinkQuery): Promise<{ links: Link[]; total: number }> => {
  const response = await axiosInstance.get(API_ENDPOINTS.LINKS.LIST, { params });
  const result = response.data;
  // Handle both raw array and wrapped response
  if (Array.isArray(result)) {
    return { links: result, total: result.length };
  }
  // Handle wrapped response { message, errorCode, data, total }
  if (result.data) {
    return { links: result.data, total: result.total || result.data.length };
  }
  return { links: [], total: 0 };
};

// Create link
export const createLink = async (data: CreateLinkRequest): Promise<Link> => {
  const response = await axiosInstance.post(API_ENDPOINTS.LINKS.CREATE, data);
  return response.data.data;
};

// Get link details
export const getLinkDetails = async (params: LinkDetailsQuery): Promise<Link> => {
  const response = await axiosInstance.get(API_ENDPOINTS.LINKS.DETAILS, { params });
  return response.data.data;
};

// Update link
export const updateLink = async (data: UpdateLinkRequest): Promise<Link> => {
  const response = await axiosInstance.patch(API_ENDPOINTS.LINKS.UPDATE, data);
  return response.data.data;
};

// Delete link (soft delete)
export const deleteLink = async (linkId: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.LINKS.DELETE, { data: { linkId } });
};

// Restore deleted link
export const restoreLink = async (linkId: string): Promise<Link> => {
  const response = await axiosInstance.post(API_ENDPOINTS.LINKS.RESTORE, { linkId });
  return response.data.data;
};

// Reorder links
export const reorderLinks = async (data: ReorderLinksRequest): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.LINKS.REORDER, data);
};

// Toggle link status (activate/deactivate)
export const toggleLinkStatus = async (linkId: string, isActive: boolean): Promise<Link> => {
  const response = await axiosInstance.patch(API_ENDPOINTS.LINKS.TOGGLE_STATUS, {
    linkId,
    isActive,
  });
  return response.data.data;
};

// Bulk operations
export const bulkOperation = async (data: BulkOperationRequest): Promise<{ affected: number }> => {
  const response = await axiosInstance.post(API_ENDPOINTS.LINKS.BULK_OPERATION, data);
  return response.data.data;
};

// Get public links by username
export const getPublicLinks = async (username: string): Promise<Link[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.LINKS.PUBLIC, {
    params: { username },
  });
  return response.data.data;
};

// Get link analytics
export const getLinkAnalytics = async (linkId: string): Promise<LinkAnalytics> => {
  const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.LINK, {
    params: { linkId },
  });
  return response.data.data;
};
