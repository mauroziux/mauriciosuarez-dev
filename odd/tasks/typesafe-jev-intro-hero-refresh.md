# Feature: TypeSafe Jev Introduction and Hero Proposals

Clarify Jev for non-specialist readers and compare two visual hero directions before replacing the published bilingual article hero.

## Tasks

- [x] T1: Add a concise plain-language Jev introduction to both language variants.
- [x] T2: Create two review-only hero proposals using the existing dark editorial system:
  - TypeSafe-led wordmark and structured-output motif.
  - Jev-led monogram and typed-decision motif.
- [x] T3: Present both rendered proposals for explicit human selection. Human selected Proposal A — TypeSafe.
- [x] T4: Integrate the selected hero in Spanish and English, then run production and visual checks.

## Constraints

- Preserve all published metrics, caveats, route slugs, and existing SEO metadata.
- Do not replace production hero assets until the human chooses a proposal.
- Use English technical artifacts and bilingual article copy.
- Keep the hero full-width; article graphics retain the existing mobile horizontal-scroll behavior.

## Evidence

- T1: Added a short plain-language paragraph after the System One thesis in both article variants; no metrics or caveats changed.
- T2: Rendered two 1200×630 review proposals in `/tmp` using the existing #0a0a0a grid, crimson accent, gold caveat, and editorial typography. Proposal A foregrounds the TypeSafe wordmark and a WhatsApp-to-typed-output panel. Proposal B foregrounds a Jev monogram and typed-decision chips.
- T3: Human selected Proposal A — TypeSafe, prioritizing the TypeSafe wordmark and the WhatsApp-to-typed-output explanation.
- T4: `npm run build` passed with 41 pages. Static assertions passed for both localized intro strings, hero paths, SVG role attributes, and 2400×1260 PNG output. Desktop English and iPhone 14 Spanish browser checks passed; the hero stayed viewport-width and article graphics retained the 520px horizontal-scroll fallback.
