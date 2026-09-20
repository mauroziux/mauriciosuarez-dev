# TypeSafe Jev English Localisation — Binding Worker Spec

Read first:

1. `src/content/articles/typesafe-jev-es.md` — source article; preserve every factual claim and caveat.
2. `public/articles/typesafe-jev/*.svg` + `og.svg` — source visual layouts and palette.
3. `/home/dev/.herdr/worktrees/malta-cleaners/worktree-calm-stone-34f1/docs/experiments/2026-09-18-typesafe-jev-shadow-classifier.md`, especially lines 1–17, 84–109, 324–355, 453–477 — evidence for business framing and costs.
4. `odd/tasks/typesafe-jev-english.md` — parent task contract.

## Required changes

### Spanish price correction

Update `public/articles/typesafe-jev/sistema-1-vs-sistema-2.svg`:

- Replace the vague System 2 `$$$` with the documented **`~$0.002–0.006 / turno`** (or a two-line Spanish layout that means exactly that).
- Preserve Jev as **`~$0.000062 / decisión`**.
- Keep the current layout visually balanced; do not claim that a full current-chain turn and a Jev semantic decision are identical units.

### English article

Create `src/content/articles/typesafe-jev-en.md`:

```yaml
title: "The AI Model That Can't Write (and Why I Want It in Production)"
description: "I tested Jev, TypeSafe's first System One model: no text generation, just typed decisions. 292 cases, blind review, and 94.2% accuracy classifying a real cleaning company's WhatsApp."
lang: "en"
routeSlug: "typesafe-jev"
tags: ["integracion-ia", "llm", "evaluacion", "arquitectura", "automatizacion"]
publishedDate: 2026-09-19
draft: false
ogImage: "/articles/typesafe-jev/og-en.png"
```

- Write natural, technically precise English — translate the meaning, not Spanish syntax.
- Use `https://malta-cleaners.com` for the external business link and `/en/work/maltacleaners/` for the internal case study.
- Preserve metrics, caveats, source attribution framing, business impact, and long-form order of the Spanish source.
- Explain the cost-unit caveat in the business section: current full chain **per turn** versus Jev semantic classification **per decision** are not interchangeable; the business argument is reliability, calibrated routing, and correctness, not simple cost savings.
- Reference English visual filenames and English alt text/captions. Retain the mobile guidance, translated: readers can swipe charts horizontally on small screens.

### English visual assets

Create these English-localised visual equivalents, preserving the dark editorial visual system, exact data, proportions, accessible English `role="img"` and `aria-label`:

- `public/articles/typesafe-jev/sistema-1-vs-sistema-2-en.svg`
- `public/articles/typesafe-jev/precision-comparada-en.svg`
- `public/articles/typesafe-jev/intencion-mezcla-en.svg`
- `public/articles/typesafe-jev/cascada-concierge-en.svg`
- `public/articles/typesafe-jev/og-en.svg`
- `public/articles/typesafe-jev/og-en.png`

English wording guide:

- System 2 · LLM / System 1 · Jev
- reads · reasons · writes / decides with types
- free text → parse and validate / choice + probability · yes/no · score
- `~$0.002–0.006 / turn` / `~$0.000062 / decision`
- Current-chain per turn; Jev semantic decision (if space is needed to clarify units).
- WhatsApp message, Concierge, Jev · first decision layer, High confidence, Automatic reply, Ambiguous or low confidence, LLM · reasoning, Human only when needed, Jev also verifies the LLM.
- Chart title: `Accuracy comparison — same corpus, 292 cases`; legend Jev / Production classifier; labels Overall, Clean subset*, With context, Ambiguous; gold note `↳ only segment where production wins`.
- Mixed-intent title: `Mixed intent: the question design, not the model`; `v1 · exclusive choice`; `v2 · yes/no by family`; `gate 70%`.
- OG image text: `EXPERIMENT · MALTA CLEANERS`, `The AI model that can't write`, `Jev: typed decisions for the concierge`, `SYSTEM ONE`, `94.2% / overall intent`, `$0.000062 / per decision`, `457 ms / p95 on production path`, `mauriciosuarez.dev · writing`.

Generate the English PNG OG from the English SVG with sharp at 2× social dimensions (2400×1260, 1200×630 ratio), matching the existing process. No new dependencies.

## Verification (run synchronously and report exact results)

```bash
npm run build
python3 - <<'PY'
from pathlib import Path
from xml.etree import ElementTree as ET
html = Path('dist/en/writing/typesafe-jev/index.html').read_text()
assert 'https://mauriciosuarez.dev/en/writing/typesafe-jev/' in html
assert 'https://mauriciosuarez.dev/articles/typesafe-jev/og-en.png' in html
assert 'https://malta-cleaners.com' in html
assert html.count('hreflang=') == 3
for name in ['sistema-1-vs-sistema-2-en.svg', 'precision-comparada-en.svg', 'intencion-mezcla-en.svg', 'cascada-concierge-en.svg', 'og-en.svg']:
    ET.parse(Path('public/articles/typesafe-jev') / name)
print('English article SEO/assets: PASS')
PY
git diff --check
```

Do not commit, publish, push, alter `.gitignore`, or modify files outside the exact allowed surfaces.
