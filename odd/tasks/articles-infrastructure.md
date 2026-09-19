# Feature: Articles Infrastructure

Flexible-bilingual articles system (option B: publish in one language, translate later).
User goal: easy experiment-based article authoring with solid SEO baked in.

## Decisions

- Bilingual-flexible: an article may exist in only one language; missing translation
  must not produce broken SEO (no hreflang pair to 404s; lang switch falls back to
  the alternate writing index).
- Reuse the `projects` collection pattern: `src/content/articles/<slug>-<lang>.md`,
  shared `routeSlug` across translations, `lang` field.
- Advisor-reviewed: explicit BaseLayout URL overrides (not booleans), shared article
  helper, slug/date schema validation, UTC date formatting, conditional empty state,
  reproducible fixture validation, `astro check` + production build + dist assertions.

## Tasks

- [x] T1: Articles collection schema + shared helpers
      `src/content.config.ts` (articles collection: title, description, lang,
      routeSlug w/ slug regex, tags, publishedDate, updatedDate? w/ >= publishedDate
      refine, draft default false, ogImage?, experimentUrl?) and
      `src/lib/articles.ts` (publish filter, sort desc, reading time, UTC date
      format, duplicate (lang, routeSlug) build-time assertion, sibling lookup).
- [x] T2: Article list pages (conditional empty state)
      `src/pages/es/articulos.astro`, `src/pages/en/writing.astro`: real list when
      published articles exist (cards: title, description, date, reading time, tags),
      keep existing pillars section, keep empty state when zero published articles.
- [x] T3: Detail pages + ArticleDetail component + BaseLayout SEO props
      `src/pages/es/articulos/[slug].astro`, `src/pages/en/writing/[slug].astro`,
      `src/components/ArticleDetail.astro` (typography, JSON-LD BlogPosting with
      headline/description/datePublished/dateModified/inLanguage/mainEntityOfPage/
      author/absolute image, `<`-escaped serialization, experiment link,
      translation-missing notice), BaseLayout additive props: `languageSwitchUrl?`,
      `alternatePageUrl?`, `ogType?`, `articlePublishedTime?`, `articleModifiedTime?`,
      `ogImage?` (local → absolute, absolute → as-is); hreflang/x-default emitted
      only for existing pages.
- [x] T4: RSS feeds + head discovery
      `src/pages/en/rss.xml.js`, `src/pages/es/rss.xml.js` via @astrojs/rss (lockfile
      updated), per-language, absolute URLs, same publish filter;
      `<link rel="alternate" type="application/rss+xml">` in BaseLayout head.
- [x] T5: Article scaffolding + authoring guide
      `scripts/new-article.mjs` (args title/lang; accent-normalized slug, rejects
      invalid, refuses overwrite, YAML-safe title quoting, today's date, draft:true,
      prints routeSlug reuse note for translations), `npm run new:article`,
      `docs/ARTICLES.md` (frontmatter reference, authoring workflow, per-article SEO
      checklist, translation workflow).
- [x] T6: Verification
      `astro check`, production build, dist assertions with a temporary bilingual
      fixture article (drafts absent from routes/HTML/sitemap/feeds, reciprocal
      hreflang when translation exists, no broken SEO links when missing, JSON-LD
      parseable, feeds parseable, descending order, empty state after fixture removal).
      Fixture is temporary and removed before close.

## Evidence

Work-unit commits on feat/articles-infrastructure (feature closed 2025-09-19):

- T1: 012e7db feat(articles): add articles collection schema with shared helpers
- T2: 25d4762 feat(articles): replace writing empty state with conditional article lists
- T3: 3b6313c feat(articles): add bilingual detail pages with article SEO
- T4: 7a153d6 feat(articles): add per-language RSS feeds with head discovery
- T5: ba1f7b4 feat(articles): add article scaffolding script and authoring guide

Parent spot check: re-ran `npm run build` — OK, 39 pages; hreflang legacy behavior confirmed on existing pages.
Independent verifier (gentle-ai-verify): PASS — astro check shows exactly the 5 pre-existing base errors and zero
errors in feature files; build 39 pages; empty-state indexes, well-formed empty feeds (0 items), sitemap without
article detail routes or fixture slugs, legacy hreflang preserved, src/content/articles empty, .gitignore diff only
the pre-existing .atl/ lines, git status matches the expected file set.
native assess: unassessable (empty output) → treated as high → separate verifier run satisfied by the PASS above.

- T6 fixture verification observed (worker, 2025-09-19 session; no commits made per
  parent instruction — evidence is build/assertion output, commits pending user action):
  - Phase A (es+en published fixtures + draft fixture present): `npm run build` OK
    (41 pages). Draft absent from routes/HTML/sitemap/feeds; both published routes
    built and listed; reciprocal hreflang en/es + x-default on detail pages; nav
    switch to sibling detail; JSON-LD BlogPosting parseable with correct fields and
    `<`-escaping; og:type=article with article:published_time/modified_time; lists
    descending; feeds absolute links + pubDate + channel language; RSS discovery
    links present. 44/44 assertions passed + XML well-formed (ElementTree parse).
  - Phase B (en fixture removed): rebuild OK (40 pages). es detail emits NO hreflang
    <link> elements, nav switch falls back to /es/articulos/, translation-coming
    notice shown; en route/sitemap/feed/list clean, empty state restored. 17/17.
  - Phase C (all fixtures removed): plain rebuild retained stale entries from the
    Astro content-layer store (node_modules/.astro/data-store.json) because the
    collection dir was EMPTY (deletion detection needs surviving entries). After
    documented `npx astro sync --force` + rebuild: 39 pages, all fixture routes gone
    from dist/sitemap/feeds, both empty states restored. 7/7. Tree left without
    fixtures (src/content/articles/ empty).
  - `new:article` smoke test: accent-stripped slug ("Café Ñandú: Guía Rápida" →
    cafe-nandu-guia-rapida), YAML-quoted title, draft:true, overwrite refused
    (exit 1). Smoke file removed.
  - `npx astro check` (final tree): 0 errors in all articles-infrastructure files;
    5 PRE-EXISTING base errors in files outside the delegated edit surfaces:
    src/components/CinematicHero.astro ×4 (ts2339 clientX/clientY/style on
    Event/Element) and src/i18n/utils.ts ×1 (ts6053 `/// <reference path="astro" />`
    resolution). Those files are untouched by this feature; surfaced now because
    this task introduced the @astrojs/check toolchain.
  - `npm run build` (final tree): OK, 39 pages, sitemap generated.
- Deps added per spec: @astrojs/rss (dep), @astrojs/check + typescript (devDeps).

## Notes

- On `main` before start → feature branch `feat/articles-infrastructure`.
- Pre-existing user change `.gitignore` (adds `.atl/`) must not be committed with this feature.
