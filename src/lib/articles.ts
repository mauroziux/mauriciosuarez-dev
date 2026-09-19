import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n";

export type Article = CollectionEntry<"articles">;

const ROUTE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Build-time guard: the same (lang, routeSlug) pair would produce two pages at
 * the same URL. Runs across ALL entries (drafts included) so a duplicate is
 * caught even while one side is still a draft.
 */
function assertNoDuplicateRouteSlugs(articles: Article[]): void {
  const seen = new Map<string, string>();
  for (const article of articles) {
    const key = `${article.data.lang}:${article.data.routeSlug}`;
    const first = seen.get(key);
    if (first) {
      throw new Error(
        `[articles] duplicate (lang, routeSlug) "${key}" found in both "${first}" and "${article.id}". Rename one of them.`,
      );
    }
    seen.set(key, article.id);
  }
}

/** Every article entry, with the duplicate-slug build guard applied. */
export async function getAllArticles(): Promise<Article[]> {
  const all = await getCollection("articles");
  assertNoDuplicateRouteSlugs(all);
  return all;
}

/**
 * Single source of the publish filter: not a draft, matching language,
 * newest first. Drafts never reach lists, detail routes, RSS or sitemap
 * because every consumer goes through this helper.
 */
export async function getPublishedArticles(lang: Lang): Promise<Article[]> {
  return (await getAllArticles())
    .filter((article) => !article.data.draft && article.data.lang === lang)
    .sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}

/**
 * Sibling lookup across languages for a routeSlug. Only published entries are
 * considered, so a draft translation never produces hreflang links to pages
 * that will not be rendered.
 */
export async function getArticleTranslationMap(
  routeSlug: string,
): Promise<Partial<Record<Lang, Article>>> {
  const published = (await getAllArticles()).filter((article) => !article.data.draft);
  const map: Partial<Record<Lang, Article>> = {};
  for (const article of published) {
    if (article.data.routeSlug === routeSlug) {
      map[article.data.lang] = article;
    }
  }
  return map;
}

/** ~200 wpm, tolerant to a missing body (never below 1 minute). */
export function readingTimeMinutes(body?: string): number {
  const words = body?.trim() ? body.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

/** Human date display, pinned to UTC so the rendered date never shifts. */
export function formatDateUTC(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "es" ? "es" : "en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** ISO 8601 timestamp for JSON-LD, Open Graph article times and RSS. */
export function toISODate(date: Date): string {
  return date.toISOString();
}

export { ROUTE_SLUG_RE };
