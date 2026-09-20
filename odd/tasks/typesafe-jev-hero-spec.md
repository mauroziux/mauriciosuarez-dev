# TypeSafe Jev Article Hero — Binding Worker Spec

Read first:

- `src/components/ArticleDetail.astro`
- `src/styles/global.css`
- `src/content/articles/typesafe-jev-es.md`
- `src/content/articles/typesafe-jev-en.md`
- `odd/tasks/typesafe-jev-english.md`

## Goal

Make `ogImage` serve two purposes for articles that provide it: social metadata (existing behavior) and an optional wide editorial hero in the article page. The current Spanish and English TypeSafe Jev OG images are designed as poster-like hero assets.

## Required implementation

### Shared hero

Update `src/components/ArticleDetail.astro`:

- Immediately after the article `header` and before the translation notice/prose content, conditionally render a semantic hero only when `data.ogImage` exists.
- Use a `figure` with class `article-hero` and an `<img>` whose `src` is `data.ogImage` and `alt` is the article title. Make it eager/high-priority if supported without causing Astro type issues.
- Preserve all existing behavior for articles without an `ogImage`.
- Use existing fade-up vocabulary only if it does not duplicate/conflict with the header animation.

Update `src/styles/global.css`:

- Add restrained shared `.article-hero` styling that matches the dark editorial system: full width, overflow hidden, stable border/radius, background fallback, no decorative gradient, responsive image display.
- Do not route the hero image through the article-body mobile horizontal-scroll treatment: the hero stays full width and crops/scales normally.

### Copy correction

In **both** `src/content/articles/typesafe-jev-es.md` and `src/content/articles/typesafe-jev-en.md`:

- Remove every reference to a provider/legal gate being pending.
- Preserve the privacy factual statement with neutral wording: no real customer data was used; the evaluation ran on synthetic data.
- Do not alter other evidence, metrics or caveats.

## Verification (run synchronously and report exact results)

```bash
npm run build
python3 - <<'PY'
from pathlib import Path
for path, og in [
    ('dist/es/articulos/typesafe-jev/index.html', '/articles/typesafe-jev/og.png'),
    ('dist/en/writing/typesafe-jev/index.html', '/articles/typesafe-jev/og-en.png'),
]:
    html = Path(path).read_text()
    assert 'article-hero' in html, path
    assert og in html, path
for path in ['src/content/articles/typesafe-jev-es.md', 'src/content/articles/typesafe-jev-en.md']:
    text = Path(path).read_text().lower()
    assert 'gate legal' not in text and 'legal gate' not in text, path
print('Article hero and privacy wording: PASS')
PY
git diff --check
```

Do not commit, publish, push, alter `.gitignore`, or write outside the exact allowed surfaces.
