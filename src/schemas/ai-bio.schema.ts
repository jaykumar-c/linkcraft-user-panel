import { z } from 'zod';

export const generateBioSchema = z.object({
  tone: z.enum(['professional', 'casual', 'humorous', 'minimalist']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  keywords: z.array(z.string()).max(10).optional(),
  includeLinks: z.boolean().optional(),
  customPrompt: z.string().max(500).optional(),
});

export type GenerateBioFormData = z.infer<typeof generateBioSchema>;