# Feature: TypeSafe Jev English Article and Visual Localisation

Create the English counterpart of the published Spanish TypeSafe Jev article, preserving the shared `routeSlug` and all evidence/caveats. Correct the Spanish System 2 infographic to replace the vague `$$$` with the documented current-chain cost.

## Evidence constraints

- Current concierge chain: **~$0.002–0.006 per turn**, an estimate based on a ~6–15k input token and 0.5–0.8k output token path. This is not directly equivalent to Jev's semantic classification unit.
- Jev: **~$0.000062 per decision** in the Phase 1 result.
- Source: `/home/dev/.herdr/worktrees/malta-cleaners/worktree-calm-stone-34f1/docs/experiments/2026-09-18-typesafe-jev-shadow-classifier.md`, lines 106–109 and 355.
- Reuse all public claims already present in `src/content/articles/typesafe-jev-es.md`; do not introduce customer data or unverified metrics.

## Tasks

- [x] T1: Correct Spanish System 1 vs System 2 cost comparison
      Replaced the vague System 2 `$$$` label in `public/articles/typesafe-jev/sistema-1-vs-sistema-2.svg` with the documented current-chain cost, accurately labeled per turn, and clarified the distinct Jev semantic-decision unit.
- [x] T2: Create English article and localised visual assets
      Added `src/content/articles/typesafe-jev-en.md` with `routeSlug: typesafe-jev`, English title/description/prose, factual evidence/caveats, direct MaltaClean link, and `/en/work/maltacleaners/` case link. Added English versions of all four SVGs and the social OG SVG/PNG while retaining the dark editorial visual system and accessible English descriptions.
- [x] T3: Add reusable optional article hero and revise privacy wording
      Render `ogImage` as a wide editorial hero beneath the article title/lede through the shared `ArticleDetail` component, with responsive styling that belongs to the existing dark editorial system. In both article variants, retain the fact that the evaluation used synthetic data but remove all references to a pending legal/provider gate.
- [x] T4: Validate and visually review both language variants
      Automated production validation passed. Desktop English and mobile English/Spanish browser checks confirmed hero framing, no document overflow, and a 520px horizontal-scroll fallback for each text-heavy graphic.
- [x] T5: Commit the work units without publishing
      Committed content/assets/tracking on `feat/articles-infrastructure` as `f2566c2`. Did not push, fast-forward `main`, or deploy: publication of this new translation remains a separate user decision.

## Evidence

- `npm run build`: PASS — generated 41 pages, including `/en/writing/typesafe-jev/` and both Spanish article routes.
- English article SEO/assets assertion script: PASS — canonical URL, OG image URL, MaltaClean link, three hreflang values, and all five English SVG assets validated with XML parsing.
- Article hero/privacy assertion script: PASS — both built detail pages contain their hero and correct OG asset, and neither article contains `legal gate`/`gate legal` wording.
- `git diff --check`: PASS.
- Browser visual review (parent fallback; `gentle-ai-verify` launch was rejected by the harness before execution): desktop English screenshot reviewed; mobile English and Spanish screenshots reviewed; hero stayed full width, document width equaled viewport width, and each article graphic reported `overflow-x: auto`, `scrollWidth: 520`, `clientWidth: 358` on iPhone 14 emulation.
- Pre-commit status inspection: `.gitignore` contains the pre-existing local `.atl/` ignore change and remains intentionally excluded.
- Work-unit commit: `f2566c2 feat(articles): add English TypeSafe Jev article`.

## Notes

- Current `origin/main` equals feature branch base `87a2df9`; local `.gitignore` change is pre-existing and must remain uncommitted.
- Spanish article is live already at `/es/articulos/typesafe-jev/`; its asset correction will not reach production until this feature is explicitly published.
