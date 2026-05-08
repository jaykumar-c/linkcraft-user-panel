import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import { AnalyticsOverview, LinkAnalytics, LinkAnalyticsQuery } from '../types';

// Get analytics overview
export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.OVERVIEW);
  const result = response.data;
  // Handle wrapped response
  if (result.data) {
    return result.data;
  }
  return result;
};

// Get link analytics with query params
export const getLinkAnalytics = async (linkId: string, params?: LinkAnalyticsQuery): Promise<LinkAnalytics> => {
  const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.LINK, {
    params: { linkId, ...params },
  });
  return response.data.data || response.data;
};

// Track link click (public endpoint)
export const trackLinkClick = async (data: {
  linkId: string;
  eventType?: string;
  userAgent?: string;
  referrer?: string;
  countryCode?: string;
  deviceType?: string;
}): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.ANALYTICS.TRACK, data);
};
