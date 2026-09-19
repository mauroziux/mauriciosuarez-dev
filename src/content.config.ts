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

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      lang: z.enum(["en", "es"]),
      routeSlug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "routeSlug must be a lowercase slug: lowercase letters and digits separated by single hyphens",
        ),
      tags: z.array(z.string()).default([]),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      ogImage: z.string().optional(),
      experimentUrl: z.string().optional(),
    })
    .refine(
      (data) => data.updatedDate === undefined || data.updatedDate >= data.publishedDate,
      {
        message: "updatedDate must be on or after publishedDate",
        path: ["updatedDate"],
      },
    ),
});

export const collections = { projects, articles };
