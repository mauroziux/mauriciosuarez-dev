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
  }),
});

export const collections = { projects };
