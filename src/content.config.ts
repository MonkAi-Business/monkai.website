import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    tool: z.enum(['claude', 'chatgpt', 'copilot', 'gemini', 'overig']),
    description: z.string(),
    file: z.string(),
    type: z.string(),
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

const usecases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/usecases' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    video: z.object({
      type: z.enum(['file', 'youtube', 'vimeo']),
      src: z.string(),
      poster: z.string().optional(),
    }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, usecases, resources };
