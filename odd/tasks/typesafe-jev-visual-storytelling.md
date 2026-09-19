# Feature: TypeSafe Jev Article Visual Storytelling

Add data-led visual storytelling to the first Spanish article, preserving the site's dark editorial system and making the evaluation digestible on desktop and mobile.

## Tasks

- [x] T1: Design and create four accessible SVG infographics
  System 1 vs System 2 comparison, paired precision chart, mixed-intent question-design chart, and concierge cascade diagram. Use the existing palette (#0a0a0a, crimson accent, gold caveat) with descriptive alt text.
- [x] T2: Add social OG image and integrate visuals into narrative
  Create a 2× social image (2400×1260, 1200×630 ratio), declare it through article `ogImage`, place each visual at the explanatory section it supports, add captions, and link MaltaClean directly to https://malta-cleaners.com plus the internal case study.
- [x] T3: Visual QA and responsive adaptation
  Review individual graphics, desktop article composition, and mobile layout through agent-browser screenshots. Simplify clipped SVGs; on mobile preserve text legibility via a 520px horizontal-scroll visual viewport and explicit reader guidance.
- [x] T4: Final production build and SEO asset verification
  `npm run build` PASS (40 pages). Generated article route, four graphics, absolute OG image URL, canonical URL, absent missing-translation hreflang, and MaltaClean external URL all confirmed; SVG XML parses; OG PNG is 2400×1260 (2× social ratio).

## Evidence

- Initial desktop review exposed clipping in the cascade diagram and title/legend overlap in the precision chart; both were redesigned and re-rendered.
- Desktop contact-sheet review: visuals match the site’s dark editorial system, are legible at article width, and support rather than repeat the prose.
- Mobile check: each article graphic has `width: 520px`, `parentClientWidth: 358px`, `parentScrollWidth: 520px`, proving a readable horizontal-scroll fallback on iPhone 14 emulation.
- Pre-existing `.gitignore` change (local `.atl/` ignore) remains outside this feature commit.
- Completion review was requested from the Advisor twice; both attempts failed with a WebSocket transport error. No third retry was made. Build, static output, and browser visual evidence remain the verification record.
