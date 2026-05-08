import { useMutation } from '@tanstack/react-query';
import { useToast } from './use-toast';
import * as storageApi from '../services/storage.service';

export const useUploadFile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => storageApi.uploadFile(file),
    onSuccess: () => {
      toast({
        title: 'Upload successful',
        description: 'File uploaded to Cloudinary',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Unable to upload file',
        variant: 'destructive',
      });
    },
  });
};

export const useUploadFiles = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (files: File[]) => storageApi.uploadFiles(files),
    onSuccess: (data) => {
      const successCount = data.uploaded.length;
      const failedCount = data.failed.length;
      
      if (failedCount > 0) {
        toast({
          title: 'Upload partially successful',
          description: `${successCount} files uploaded, ${failedCount} failed`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Upload successful',
          description: `${successCount} files uploaded`,
          variant: 'success',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Unable to upload files',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteFile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (publicId: string) => storageApi.deleteFile(publicId),
    onSuccess: () => {
      toast({
        title: 'File deleted',
        description: 'File removed from Cloudinary',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Unable to delete file',
        variant: 'destructive',
      });
    },
  });
};