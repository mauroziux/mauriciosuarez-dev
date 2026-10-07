# Writing Articles

Articles live in `src/content/articles/` as bilingual markdown files. An article can
exist in one language only — publishing in Spanish today and translating to English
later is a first-class workflow. All SEO plumbing (hreflang, RSS, sitemap, JSON-LD)
adapts automatically.

## Quickstart

```sh
npm run new:article -- "My New Article"
```

This creates `src/content/articles/my-new-article-en.md` with today's UTC date and
`draft: true`. Write the body, then set `draft: false` to publish.

Options:

```sh
npm run new:article -- "Título en Español" --lang es
npm run new:article -- "Custom Title" --slug my-custom-slug
```

- `--lang es|en` — target language (default `en`).
- `--key <articleKey>` — stable filename key shared by translations (defaults to the first slug).
- `--slug <slug>` — override the localized route slug derived from the title. Slugs are
  lowercased, accents stripped (NFD), and anything invalid becomes a dash.
  Valid: `^[a-z0-9]+(?:-[a-z0-9]+)*$` (e.g. `ai-code-review`).

The script refuses to overwrite an existing file.

## File naming

`<articleKey>-<lang>.md`, e.g. `ai-code-review-en.md` and `ai-code-review-es.md`.
Translations share the stable **filename key**, not the public URL slug. The locale
suffix must match frontmatter `lang`. Keep filenames/keys unchanged when translating
or changing a URL; hreflang and the language switch pair entries by this identity.
`routeSlug` is localized: e.g. `ai-code-review` in EN and `revision-de-codigo-con-ia` in ES.

## Frontmatter reference

```yaml
title: "Article title"            # required
description: "One-sentence lede"  # required — listings, meta description, RSS
lang: "en"                        # required — "en" | "es"
routeSlug: "ai-code-review"       # required — localized URL, not translation identity
tags: ["ai", "code-review"]       # optional — defaults to []
publishedDate: 2025-06-01         # required — handled as a UTC date
updatedDate: 2025-06-15           # optional — must be >= publishedDate
draft: false                      # optional — defaults to false
ogImage: "/articles/my-cover.png" # optional — local /path or absolute https URL
experimentUrl: "https://..."      # optional — renders a demo/experiment button
```

Body is standard markdown rendered inside the article prose layout.

## Draft → publish workflow

1. Scaffold with `npm run new:article` (created as `draft: true`).
2. Drafts never render anywhere: not in the lists, not as detail routes, not in
   RSS, not in the sitemap. You can build and preview safely at any time.
3. To publish, change `draft: true` to `draft: false` and rebuild.

## Translation workflow

1. Create the sibling with the original filename key and a translated title:

   ```sh
   npm run new:article -- "Mi nuevo artículo" --lang es --key my-new-article
   ```

   This creates `my-new-article-es.md` with `routeSlug: "mi-nuevo-articulo"`.
   Use `--slug` only to choose a different localized URL explicitly.

2. Translate the body and set `draft: false` when ready.

Until the translation publishes, the original article shows a "translation on its
way" notice, the nav language switch falls back to the alternate writing index, and
**no hreflang links are emitted** (so search engines never see a pointer to a 404).

## Per-article SEO checklist

- [ ] `title` ≤ ~60 characters, human-readable.
- [ ] `description` is a real one-sentence summary (it doubles as the meta
      description and RSS text).
- [ ] `routeSlug` is stable, lowercase, hyphenated — it becomes the public URL
      (`/en/writing/<routeSlug>/`, `/es/articulos/<routeSlug>/`). If a published
      slug changes, preserve its old URL with a permanent redirect.
- [ ] `publishedDate` is the true first-publication date (UTC).
- [ ] `updatedDate` set only when the content materially changes.
- [ ] `tags` use the existing lowercase, hyphenated vocabulary.
- [ ] `ogImage` (optional) is a local `/...` path under `public/` or an absolute
      `https://` URL; falls back to `/og-image.png`.
- [ ] Translations share the filename key, have locale-matching suffixes, and use localized slugs.

Duplicate `(lang, routeSlug)` / `(lang, articleKey)` pairs and mismatched filename languages fail the build.

## URL migration and verification

`public/_redirects` is the authoritative Cloudflare Pages 301 mapping. Define both
old `/path` and `/path/` variants. Astro reads the slash-terminated article rules
from that file for local redirects and static HTML fallbacks; these aliases are
excluded from the sitemap and never appear in RSS. Do not redirect to drafts or
chain aliases. Updating slugs rebuilds lists, canonical, Open Graph, JSON-LD and
RSS automatically; update inline markdown/social copy links separately.

```sh
npm run check  # typecheck, build, article routes and portfolio smoke; also used by CI
```

The route check covers every published article, reciprocal translations, missing
translations, metadata, RSS/sitemap, old URL fallback/301 parity and scaffold key
safety. It initially failed for the Spanish slug in the English permission article.
The October 2026 audit localized 2 EN URLs, 2 published ES URLs and 1 ES draft;
TypeSafe/Jev identifiers stay unchanged. Article filenames and media directories
remain stable. The redirects were verified in preview and production before an
explicitly approved URL-only update of three existing social pieces: LinkedIn on
October 8/9 and X on October 10. Their text otherwise, message IDs, images and
schedules stayed unchanged. The draft uploader never rewrites queued posts automatically.

## What's automatic

- **hreflang / x-default** — emitted on detail pages only when the sibling
  translation exists; x-default always points to the English page.
- **JSON-LD** — every detail page ships a `BlogPosting` object (headline,
  description, dates, `inLanguage`, canonical `mainEntityOfPage`, author, image,
  keywords from tags).
- **RSS** — `/en/rss.xml` and `/es/rss.xml`, filtered and ordered by the same
  publish rules; discovery `<link rel="alternate" type="application/rss+xml">`
  tags are in every page head.
- **Sitemap** — published article routes only (drafts never appear).
- **Reading time** — word count / 200 wpm, minimum 1 minute.
- **Dates** — stored as dates, displayed via `Intl` in UTC, serialized as ISO in
  JSON-LD, Open Graph article times and RSS.
