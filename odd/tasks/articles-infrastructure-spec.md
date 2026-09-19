# Articles Infrastructure — Implementation Spec (worker-facing)

Repo: /home/dev/projects/mauriciosuarez-dev, branch feat/articles-infrastructure (checked out, node_modules installed).
Astro 6 + Tailwind 4, static, bilingual es/en. site https://mauriciosuarez.dev, trailingSlash always.
Parent ODD doc: odd/tasks/articles-infrastructure.md (tasks T1–T6). Do NOT git commit.

## Exemplar files (read first)
- src/content.config.ts (projects schema pattern); src/content/projects/cerebro-es.md (frontmatter style)
- src/pages/es/proyectos/[slug].astro (getStaticPaths + render + detail component)
- src/pages/es/articulos.astro, src/pages/en/writing.astro (placeholders to replace; keep visual style)
- src/layouts/BaseLayout.astro (head SEO); src/i18n/ui.ts (add keys to BOTH lang sections)
- Visual vocabulary: glass-card, text-(--color-text-primary|secondary), animate-fade-up(-delay-N), section-padding, max-w-4xl

## Design constraints (advisor-reviewed, mandatory)
1. Flexible bilingual: an article may exist in one language only. Missing translation must NOT produce broken SEO: no hreflang/x-default to 404s; nav language switch falls back to the alternate writing index.
2. BaseLayout changes ADDITIVE optional props, defaults preserve current HTML exactly:
   - languageSwitchUrl?: string — overrides nav switch href
   - alternateUrl?: string | null — undefined = current getAlternateUrl behavior; string = emit hreflang en/es/x-default against it; null = emit NO hreflang links
   - ogType?: "website" | "article" (default "website"); article emits article:published_time (ISO) + article:modified_time when provided
   - articlePublishedTime?: Date, articleModifiedTime?: Date
   - ogImage?: string — local "/..." prefix site origin; absolute http(s) as-is; default /og-image.png
3. Drafts never rendered anywhere (list, getStaticPaths, RSS, sitemap). Shared helper is the single filter source, dev and prod.
4. Dates: z.coerce.date(); display via Intl with timeZone "UTC"; JSON-LD/RSS use ISO. Schema refine: updatedDate >= publishedDate.
5. routeSlug schema regex: ^[a-z0-9]+(?:-[a-z0-9]+)*$ . Duplicate (lang, routeSlug) throws at build in shared helper.
6. JSON-LD BlogPosting in detail pages: @context, @type, headline, description, datePublished, dateModified (if any), inLanguage, mainEntityOfPage {@type:"WebPage", @id: canonical}, author {@type:"Person", name:"Mauricio Suárez", url: site origin}, image absolute, keywords from tags. Serialize JSON.stringify(...).replace(/</g,"\\u003c") in <script type="application/ld+json" set:html={...}>.
7. Reading time: Math.max(1, Math.ceil(words/200)), tolerant to missing body.
8. i18n keys: minimal, both languages, near existing writing.* keys. Needed concepts: reading time ("{n} min read"/"{n} min de lectura"), published, updated, back link ("← All articles"/"← Todos los artículos"), translation-coming notice, optional RSS label. Interpolation via simple replace.

## Tasks
- T1: src/content.config.ts articles collection (title, description, lang, routeSlug, tags default [], publishedDate, updatedDate?+refine, draft default false, ogImage?, experimentUrl?) + NEW src/lib/articles.ts: getPublishedArticles(lang) (filter !draft+lang, sort desc, dup (lang,routeSlug) assertion across ALL entries), getArticleTranslationMap(routeSlug) (routeSlug → lang→entry), readingTimeMinutes(body?), formatDateUTC(date, lang), toISODate(date).
- T2: es/articulos.astro + en/writing.astro: keep hero + pillars; when published articles exist render list cards (title, description, date, reading time, tags, link) + subtle RSS link; when zero, keep existing empty-state card exactly.
- T3: NEW src/components/ArticleDetail.astro shared by both langs (header: title, lede description, dates, reading time, tags, experimentUrl button; prose Content; translation-missing notice; back link; JSON-LD). NEW detail pages src/pages/es/articulos/[slug].astro + src/pages/en/writing/[slug].astro: getStaticPaths from getPublishedArticles, render(article), sibling-aware BaseLayout props per constraint 2 (translation missing → alternateUrl={null} + languageSwitchUrl={getRoute(alternateLang,"writing")}).
- T4: dep @astrojs/rss; NEW src/pages/en/rss.xml.js + src/pages/es/rss.xml.js (per-language, absolute URLs, pubDate, channel language); BaseLayout head: static <link rel="alternate" type="application/rss+xml"> for /en/rss.xml + /es/rss.xml with title attrs.
- T5: NEW scripts/new-article.mjs: `npm run new:article -- "Title" [--lang es|en] [--slug custom]`; slug from title (NFD accent-strip, lowercase, invalid → dash, collapse, trim) or override; validate regex; refuse overwrite; write src/content/articles/<slug>-<lang>.md (YAML-safe quoted title, placeholder description, today UTC, draft: true, empty tags, routeSlug); print next steps (translation reuses same routeSlug, example command, set draft:false to publish). package.json script "new:article". NEW docs/ARTICLES.md (English): quickstart, frontmatter reference, draft→publish workflow, translation workflow, per-article SEO checklist, automatic hreflang/RSS/sitemap/JSON-LD notes.
- T6 self-verification (evidence required): temp fixtures src/content/articles/example-experiment-es.md + -en.md (published, routeSlug example-experiment) + one draft-only fixture. Add devDeps @astrojs/check + typescript. Run npx astro check + npm run build. Assert on dist: draft absent (routes/HTML/sitemap/feeds); both published present; reciprocal hreflang on detail; then delete en fixture, rebuild, assert single-language case (no hreflang emitted, switch → writing index); JSON-LD JSON.parse-able; RSS well-formed XML; list descending order. Then delete ALL fixtures, rebuild, assert fixture routes gone + empty state back. Leave tree WITHOUT fixtures.

## Allowed edit surfaces
src/content.config.ts; src/lib/articles.ts (new); src/pages/es/articulos.astro; src/pages/en/writing.astro; src/pages/es/articulos/[slug].astro (new); src/pages/en/writing/[slug].astro (new); src/components/ArticleDetail.astro (new); src/layouts/BaseLayout.astro; src/i18n/ui.ts (six writing.* keys in BOTH lang sections); src/pages/en/rss.xml.js (new); src/pages/es/rss.xml.js (new); scripts/new-article.mjs (new); docs/ARTICLES.md (new); package.json + package-lock.json; src/content/articles/** (fixtures only, delete before returning); odd/tasks/articles-infrastructure.md (progress notes only).
Do NOT touch .gitignore (pre-existing user change), public/, projects content, or anything else. Do NOT git commit.
