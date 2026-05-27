import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Edit2, Trash2, Copy, Loader2, Search, Upload, X, ChevronRight, ExternalLink, AlertTriangle } from 'lucide-react';
import moment from 'moment';
import { useLinks, useCreateLink, useUpdateLink, useDeleteLink, useToggleLinkActive, useRestoreLink, useBulkOperation, useReorderLinks } from '../../hooks/useLinks';
import { useUploadFile } from '../../hooks/useStorage';
import { useToast } from '../../hooks/use-toast';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { copyToClipboard } from '../../lib/utils';
import { createLinkSchema, updateLinkSchema, type CreateLinkFormData, type UpdateLinkFormData, LINK_TYPES } from '../../schemas/link.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinkQuery } from '../../types';

const formatDate = (date: string | number | null | undefined) => {
  if (!date) return 'N/A';
  const num = typeof date === 'string' ? Number(date) : date;
  const ts = num < 1000000000000 ? num * 1000 : num;
  const m = moment(ts);
  return m.isValid() ? m.format('DD-MM-YYYY') : 'N/A';
};

// Link item component
function LinkItem({ link, onEdit, onDelete, onToggleActive, onRestore, onCopy, dragHandleProps, isExpanded, onToggleExpand }: {
  link: any;
  onEdit: (link: any) => void;
  onDelete: (link: any) => void;
  onToggleActive: (link: any) => void;
  onRestore?: (link: any) => void;
  onCopy?: (url: string) => void;
  dragHandleProps?: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={`border-2 ${link.isDeleted ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Drag handle */}
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing pt-2 opacity-50 hover:opacity-100">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Link content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{link.title}</h3>
                {!link.isDeleted && (
                  <Switch
                    checked={link.isActive}
                    onCheckedChange={() => onToggleActive(link)}
                    className="ml-auto"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate mb-1">{link.url}</p>
              {(link.linkType || link.platformDetected || link.category) && (
                <div className="flex gap-1 mb-1">
                  {link.linkType && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{link.linkType}</span>
                  )}
                  {link.platformDetected && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">{link.platformDetected}</span>
                  )}
                  {link.category && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">{link.category}</span>
                  )}
                </div>
              )}
              {link.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{link.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{link.clickCount || link.clicks || 0} clicks</span>
                {link.isDeleted && (
                  <span className="text-destructive">Deleted</span>
                )}
                {link.scheduleStartAt && (
                  <span>Scheduled</span>
                )}
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {isExpanded ? 'Less' : 'More'} <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Expanded detail view */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Display Order:</span>
                      <span className="ml-2 font-medium">{link.displayOrder ?? link.orderIndex ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-2 font-medium">{formatDate(link.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="ml-2 font-medium">{formatDate(link.updatedAt)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Featured:</span>
                      <span className="ml-2 font-medium">{link.isFeatured ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {(link.iconUrl || link.thumbnailUrl) && (
                    <div className="grid grid-cols-2 gap-4">
                      {link.iconUrl && (
                        <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg border">
                          <span className="text-xs text-muted-foreground mb-2">Icon</span>
                          <div className="relative group">
                            <img src={link.iconUrl} alt="Icon" className="h-12 w-12 object-contain rounded-md border bg-background p-1" />
                          </div>
                        </div>
                      )}
                      {link.thumbnailUrl && (
                        <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg border">
                          <span className="text-xs text-muted-foreground mb-2">Thumbnail</span>
                          <div className="relative group">
                            <img src={link.thumbnailUrl} alt="Thumbnail" className="h-24 w-full object-cover rounded-md border bg-background" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCopy?.(link.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {link.isDeleted ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore?.(link)}
                  className="text-green-600"
                >
                  Restore
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(link)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {!link.isDeleted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(link)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Create/Edit Link Dialog
function LinkDialog({ link, onClose, nextOrder }: { link?: any; onClose: () => void; nextOrder?: number }) {
  const createLink = useCreateLink();
  const updateLink = useUpdateLink();
  const uploadFile = useUploadFile();
  const { toast } = useToast();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const isEdit = !!link;
  const schema = isEdit ? updateLinkSchema : createLinkSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateLinkFormData | UpdateLinkFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      linkType: 'custom',
      isActive: true,
    },
  });

  // Reset form when link changes (edit mode)
  useEffect(() => {
    if (link) {
      reset({
        linkId: link.id,
        title: link.title || '',
        url: link.url || '',
        description: link.description || '',
        linkType: link.linkType || 'custom',
        iconUrl: link.iconUrl || '',
        thumbnailUrl: link.thumbnailUrl || '',
        displayOrder: link.displayOrder ?? link.orderIndex ?? 0,
        isActive: link.isActive !== false,
      });
    } else {
      reset({
        title: '',
        url: '',
        description: '',
        linkType: 'custom',
        isActive: true,
      });
    }
  }, [link, reset]);

  // Set displayOrder when dialog opens or nextOrder changes
  useEffect(() => {
    if (!isEdit && nextOrder) {
      setValue('displayOrder', nextOrder);
    }
  }, [isEdit, nextOrder, setValue]);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    try {
      const result = await uploadFile.mutateAsync(file);
      setValue('iconUrl', result.secureUrl);
    } catch (err) {
      toast({ title: 'Upload failed', description: 'Failed to upload icon', variant: 'destructive' });
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumbnail(true);
    try {
      const result = await uploadFile.mutateAsync(file);
      setValue('thumbnailUrl', result.secureUrl);
    } catch (err) {
      toast({ title: 'Upload failed', description: 'Failed to upload thumbnail', variant: 'destructive' });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const selectedLinkType = watch('linkType');

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await updateLink.mutateAsync(data as UpdateLinkFormData);
      } else {
        await createLink.mutateAsync(data as CreateLinkFormData);
      }
      reset();
      onClose();
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Link' : 'Create New Link'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Update your link details below.' : 'Add a new link to your profile.'}
        </DialogDescription>
      </DialogHeader>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700">
          Only public links allowed. Private links won't be AI-scannable for your bio.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm">Title *</Label>
              <Input
                id="title"
                placeholder="My Website"
                {...register('title')}
                className={`h-9 ${errors.title ? 'border-destructive' : ''}`}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="url" className="text-sm">URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                {...register('url')}
                className={`h-9 ${errors.url ? 'border-destructive' : ''}`}
              />
              {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkType" className="text-sm">Link Type</Label>
            <Select
              value={selectedLinkType || 'custom'}
              onValueChange={(value: string) => setValue('linkType', value as any)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                {LINK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="A brief description of your link"
              {...register('description')}
              className={`min-h-[80px] resize-none ${errors.description ? 'border-destructive' : ''}`}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Icon (optional)</Label>
              <div className="border border-dashed rounded-lg p-2 text-center hover:bg-muted/30 transition-colors">
                <input
                  type="file"
                  ref={iconInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconUpload}
                />
                {watch('iconUrl') ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={watch('iconUrl')} alt="Icon" className="h-8 w-8 object-contain rounded border bg-background p-0.5" />
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">Icon uploaded</span>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={() => iconInputRef.current?.click()} disabled={uploadingIcon}>
                        {uploadingIcon ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Edit'}
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => setValue('iconUrl', '')}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => iconInputRef.current?.click()}
                    disabled={uploadingIcon}
                    className="w-full h-9 gap-1.5 text-xs text-muted-foreground"
                  >
                    {uploadingIcon ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploadingIcon ? 'Uploading...' : 'Upload icon'}
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Thumbnail (optional)</Label>
              <div className="border border-dashed rounded-lg p-2 text-center hover:bg-muted/30 transition-colors">
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
                {watch('thumbnailUrl') ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={watch('thumbnailUrl')} alt="Thumbnail" className="h-8 w-12 object-cover rounded border bg-background" />
                      <span className="text-xs text-muted-foreground truncate max-w-[80px]">Thumbnail</span>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={() => thumbnailInputRef.current?.click()} disabled={uploadingThumbnail}>
                        {uploadingThumbnail ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Edit'}
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => setValue('thumbnailUrl', '')}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={uploadingThumbnail}
                    className="w-full h-9 gap-1.5 text-xs text-muted-foreground"
                  >
                    {uploadingThumbnail ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploadingThumbnail ? 'Uploading...' : 'Upload thumbnail'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={watch('isActive') !== false}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <Label htmlFor="isActive" className="text-sm">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="displayOrder" className="text-sm text-muted-foreground">Order</Label>
              <Input
                id="displayOrder"
                type="number"
                min="0"
                {...register('displayOrder', { valueAsNumber: true })}
                className="w-16 h-8 text-center"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={createLink.isPending || updateLink.isPending}>
            {createLink.isPending || updateLink.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? 'Update' : 'Create'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function LinksPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [_page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<any>(null);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('orderIndex');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

   const queryParams: LinkQuery = {
    page: 1,
    limit: 100,
    search: debouncedSearch || undefined,
    isActive: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
    sortBy: 'orderIndex',
    sortOrder: 'ASC',
  };

  const { data: linksData, isLoading } = useLinks(queryParams);
  const links = linksData?.links || [];
  const totalLinks = linksData?.total || 0;
  
  // Calculate next display order based on all links
  const nextOrder = links.length > 0 ? Math.max(...links.map((l: any) => l.orderIndex ?? l.displayOrder ?? 0)) + 1 : 1;

  const deleteLink = useDeleteLink();
  const toggleLinkActive = useToggleLinkActive();
  const restoreLink = useRestoreLink();
  const bulkOperation = useBulkOperation();
  const reorderLinks = useReorderLinks();

  const [isReordering, setIsReordering] = useState(false);

  // Handle drag end for reordering - only send to API
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination || isReordering) return;
    
    // Only invalidate and let React Query refetch - don't reorder UI locally
    const linkOrders = links.map((link, index) => ({
      linkId: link.id,
      displayOrder: index,
    }));
    
    setIsReordering(true);
    reorderLinks.mutate({ links: linkOrders }, {
      onSettled: () => setIsReordering(false),
    });
  }, [links, reorderLinks, isReordering]);

  // Toggle detail view
  const toggleExpand = useCallback((linkId: string) => {
    setExpandedLinkId(prev => prev === linkId ? null : linkId);
  }, []);

  const handleEdit = (link: any) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleDelete = (link: any) => {
    setLinkToDelete(link);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (linkToDelete) {
      deleteLink.mutate(linkToDelete.id);
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  const handleToggleActive = (link: any) => {
    toggleLinkActive.mutate({ linkId: link.id, isActive: !link.isActive });
  };

  const handleRestore = (link: any) => {
    restoreLink.mutate(link.id);
  };

  const handleCopy = async (url: string) => {
    await copyToClipboard(url);
    toast({
      title: 'Link copied',
      description: 'Link URL copied to clipboard',
      variant: 'success',
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLink(null);
  };

  const handleBulkAction = () => {
    if (selectedLinks.length > 0 && bulkAction) {
      bulkOperation.mutate({ linkIds: selectedLinks, action: bulkAction as any });
      setSelectedLinks([]);
      setBulkDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Links</h1>
        <p className="text-muted-foreground">Manage your profile links</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select value={selectedStatus || "all"} onValueChange={(v) => { setSelectedStatus(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orderIndex">Order</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="updatedAt">Date Updated</SelectItem>
            <SelectItem value="clickCount">Clicks</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v as 'ASC' | 'DESC'); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Ascending</SelectItem>
            <SelectItem value="DESC">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {selectedLinks.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedLinks.length} selected
              </span>
              <AlertDialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                <Button variant="outline" onClick={() => setBulkDialogOpen(true)}>
                  Bulk Actions
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bulk Operation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select an action to perform on {selectedLinks.length} links.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="archive">Archive</SelectItem>
                        <SelectItem value="activate">Activate</SelectItem>
                        <SelectItem value="deactivate">Deactivate</SelectItem>
                        <SelectItem value="restore">Restore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkAction}>
                      Apply
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLink(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <LinkDialog
            link={editingLink}
            onClose={handleCloseDialog}
            nextOrder={nextOrder}
          />
        </Dialog>
      </div>

      {/* Links list */}
      {links.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold mb-2">No links yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || selectedStatus
                ? 'No links match your filters.'
                : 'Add your first link to get started.'}
            </p>
            {!searchQuery && !selectedStatus && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Link
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                <AnimatePresence>
                  {links.map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLinks.includes(link.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLinks([...selectedLinks, link.id]);
                              } else {
                                setSelectedLinks(selectedLinks.filter((id) => id !== link.id));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <div className="flex-1">
                            <LinkItem
                              link={link}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onToggleActive={handleToggleActive}
                              onRestore={handleRestore}
                              onCopy={handleCopy}
                              dragHandleProps={provided.dragHandleProps}
                              isExpanded={expandedLinkId === link.id}
                              onToggleExpand={() => toggleExpand(link.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Total count */}
      {totalLinks > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-sm text-muted-foreground">
            {totalLinks} link{totalLinks !== 1 ? 's' : ''} total
          </span>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{linkToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
