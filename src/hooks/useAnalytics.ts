import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from './use-toast';
import * as analyticsApi from '../services/analytics.service';
import { LinkAnalyticsQuery } from '../types';

// Get analytics overview hook
export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.getAnalyticsOverview,
  });
};

// Get link analytics hook
export const useLinkAnalytics = (linkId: string, params?: LinkAnalyticsQuery) => {
  return useQuery({
    queryKey: ['analytics', 'link', linkId, params],
    queryFn: () => analyticsApi.getLinkAnalytics(linkId, params),
    enabled: !!linkId,
  });
};

// Track link click (public)
export const useTrackLinkClick = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: { linkId: string; eventType?: string }) =>
      analyticsApi.trackLinkClick(data),
    onError: (error: Error) => {
      toast({
        title: 'Tracking failed',
        description: error.message || 'Unable to track click.',
        variant: 'destructive',
      });
    },
  });
};
