import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3,   'Title must be at least 3 characters')
    .max(500, 'Title too long')
    .trim(),

  content: z
    .string({ required_error: 'Content is required' })
    .min(10, 'Content must be at least 10 characters')
    .trim(),

  status: z
    .enum(['draft', 'published'])
    .default('draft'),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .trim()
    .optional(),

  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .trim()
    .optional(),

  status: z
    .enum(['draft', 'published'])
    .optional(),
});