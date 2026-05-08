import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import * as linksApi from '../services/links.service';
import {
  CreateLinkRequest,
  UpdateLinkRequest,
  ReorderLinksRequest,
  BulkOperationRequest,
  LinkQuery,
} from '../types';

// Get links hook with pagination and filters
export const useLinks = (params?: LinkQuery) => {
  return useQuery({
    queryKey: ['links', params],
    queryFn: () => linksApi.getLinks(params),
  });
};

// Get link details
export const useLinkDetails = (linkId: string) => {
  return useQuery({
    queryKey: ['link', linkId],
    queryFn: () => linksApi.getLinkDetails({ linkId }),
    enabled: !!linkId,
  });
};

// Create link hook
export const useCreateLink = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLinkRequest) => linksApi.createLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Link created',
        description: 'Your link has been successfully created.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Creation failed',
        description: error.message || 'Unable to create link.',
        variant: 'destructive',
      });
    },
  });
};

// Update link hook
export const useUpdateLink = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLinkRequest) =>
      linksApi.updateLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Link updated',
        description: 'Your link has been successfully updated.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Unable to update link.',
        variant: 'destructive',
      });
    },
  });
};

// Delete link hook (soft delete)
export const useDeleteLink = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => linksApi.deleteLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Link deleted',
        description: 'Your link has been successfully deleted.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Unable to delete link.',
        variant: 'destructive',
      });
    },
  });
};

// Restore link hook
export const useRestoreLink = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => linksApi.restoreLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Link restored',
        description: 'Your link has been successfully restored.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Restore failed',
        description: error.message || 'Unable to restore link.',
        variant: 'destructive',
      });
    },
  });
};

// Reorder links hook
export const useReorderLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderLinksRequest) => linksApi.reorderLinks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
};

// Toggle link active status hook
export const useToggleLinkActive = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, isActive }: { linkId: string; isActive: boolean }) =>
      linksApi.toggleLinkStatus(linkId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Unable to update link status.',
        variant: 'destructive',
      });
    },
  });
};

// Bulk operation hook
export const useBulkOperation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkOperationRequest) => linksApi.bulkOperation(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Bulk operation completed',
        description: `${data.affected} links affected.`,
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Bulk operation failed',
        description: error.message || 'Unable to complete bulk operation.',
        variant: 'destructive',
      });
    },
  });
};
