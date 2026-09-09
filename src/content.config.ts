import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(["en", "es"]),
    routeSlug: z.string(),
    tags: z.array(z.string()).default([]),
    publishedDate: z.coerce.date(),
    repoUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    anonymized: z.boolean().default(false),
    featured: z.boolean().default(true),
    featuredOrder: z.number().default(999),
    screenshots: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),
    // ── Showcase (prototype) ──
    cover: z.string().optional(),
    timeline: z.array(z.object({
      date: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
    })).default([]),
    highlights: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).default([]),
  }),
});

export const collections = { projects };
