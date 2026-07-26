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

// Materiaal voor de verborgen /inspiratie-pagina. De body van elk bestand is de
// tekst die de klant letterlijk kopieert (instructies, prompt, SKILL.md, ...),
// dus die wordt onbewerkt in een <pre> gezet en niet als markdown gerenderd.
const inspiratieSystem = z.enum(['claude', 'chatgpt', 'copilot', 'gemini', 'algemeen']);

const inspiratie = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/inspiratie' }),
  schema: z.object({
    title: z.string(),
    // Eén systeem of een lijst: dezelfde tekst kan onder meerdere tabs horen
    // (een expert-collega werkt in Claude, ChatGPT, Gemini en Copilot hetzelfde).
    system: z.union([inspiratieSystem, z.array(inspiratieSystem)]),
    category: z.enum(['instructies', 'agents', 'prompts', 'skills', 'naslag']),
    description: z.string(),
    file: z.string().optional(),
    // Documenten die bij dit item horen en die je in de tool aan het project,
    // de GPT, de Gem of de agent hangt. Bestanden staan in public/inspiratie/files/.
    documents: z.array(z.object({
      title: z.string(),
      file: z.string(),
      type: z.string().optional(),
      note: z.string().optional(),
    })).default([]),
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

export const collections = { blog, usecases, resources, inspiratie };
