import { z } from 'zod';

// Link type options
export const LINK_TYPES = [
  'social',
  'website',
  'portfolio',
  'other',
] as const;

// Create link schema
export const createLinkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must be at most 150 characters'),
  url: z.string().url('Invalid URL'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  iconUrl: z.string().optional().or(z.literal('')),
  thumbnailUrl: z.string().optional().or(z.literal('')),
  linkType: z.enum(LINK_TYPES).default('other'),
  category: z
    .string()
    .max(50, 'Category must be at most 50 characters')
    .optional(),
  displayOrder: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  scheduleStartAt: z.number().optional(),
  scheduleEndAt: z.number().optional(),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

// Update link schema
export const updateLinkSchema = z.object({
  linkId: z.string().min(1, 'Link ID is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must be at most 150 characters')
    .optional(),
  url: z.string().url('Invalid URL').optional(),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  iconUrl: z.string().optional().or(z.literal('')),
  thumbnailUrl: z.string().optional().or(z.literal('')),
  linkType: z.enum(LINK_TYPES).optional(),
  category: z
    .string()
    .max(50, 'Category must be at most 50 characters')
    .optional(),
  displayOrder: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  scheduleStartAt: z.number().optional(),
  scheduleEndAt: z.number().optional(),
});

export type UpdateLinkFormData = z.infer<typeof updateLinkSchema>;
