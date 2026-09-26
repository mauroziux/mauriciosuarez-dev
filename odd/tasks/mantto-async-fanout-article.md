# Feature: Mantto async fan-out article (series #1)

Parent session orchestrates. Blog repo: `~/projects/mauriciosuarez-dev` (branch: check at
write time; work-unit commits on a feature branch if on main).

## Goal

First article of the "Diario de un SaaS en producción" series, mined from the Mantto
repo (`~/projects/mantto-org/repos/mantto`): the 29-second maintenance-completion
endpoint and its async fan-out fix (commit `7ab0816`, 2026-08-14;
docs/solutions/async-maintenance-completion-fanout.md).

## Editorial contract

- Style: incident narrative → autopsy → fix → transferable lesson, with real verified
  numbers and honest caveats (matches `typesafe-jev-es.md` precedent).
- ES first (`draft: true`), editorial checkpoint with user before publish/translate.
- EN translation later shares the same `routeSlug`. Hero/OG proposed as options.
- Never publish without explicit user authorization (standing user rule).

## Verified facts (from repo evidence)

- `POST /api/v1/maintenance-requests/{id}/complete` ≈ 29s TTFB in production.
- Synchronous fan-out inside the request: AI executive report (OpenAI/Gemini, 5–15s),
  DomPDF render + R2 upload (1–3s), two MaintenanceCompletedMail sends whose build()
  did one R2 GET per evidence attachment (~10 images × 2 recipients ≈ 20 sequential
  R2 GETs) + sync Resend call (5–15s), satisfaction-survey email + WhatsApp.
- WhatsApp notifications were already async (not the bottleneck).
- Fix: ShouldQueue mailables; GenerateMaintenanceExecutiveReportJob (idempotent,
  tries=3, org locale at execution time); SendMaintenanceCompletionNotificationsJob
  (graceful PDF omission); decoupled jobs (NOT chained) so a report failure never
  blocks the essential email; dispatch wrapped in try/catch+report so a Redis outage
  can't crash a committed state change. Result: <500ms, ~29s of work on redis queue.
- Testing gotchas: Mail::assertQueued vs assertSent; phpunit.xml `<env>` does not
  populate $_SERVER so container QUEUE_CONNECTION=redis wins in tests.
- Deploy note: docker compose restart api worker + php artisan queue:restart.
- Caveats to keep: internal registry measurement, not a benchmark; single-operator
  production at the time.

## Tasks

1. [x] Feature doc created (this file).
2. [x] Draft ES article `src/content/articles/endpoint-29-seconds-es.md` (draft: true).
3. [x] `npm run build` passes (41 pages; draft renders nowhere per ARTICLES.md).
4. [ ] Editorial checkpoint with user (tone, structure, numbers, caveats).
5. [ ] EN translation `endpoint-29-seconds-en.md` (same routeSlug; -en asset variants).
6. [x] Hero/OG image in the established article visual system (user directive:
   match existing style incl. hero banner; one faithful proposal produced,
   iteration on request).

## Series backlog (from memory obs 2655)

sentry frozen release · whatsapp full-scan · no-websockets contrarian · iPhone HEVC vs
100MB R2 · AI gateway tiers · SLA idempotent engine · 20 photos silent bounce ·
analytics LATERAL · UNIQUE→422 · magic links.

## Evidence log

- 2026-09-26: feature doc created; source material verified (solution doc + commit
  7ab0816 full message + ARTICLES.md conventions).
- 2026-09-26: ES draft written (title 56 chars; tags laravel/rendimiento/colas/
  saas/postmortem; mantto project cross-link; epilogue teasers the Octane-timeout
  sequel). Build 41 pages OK. Work-unit commit: see git log (not pushed).
- 2026-09-26: visual pass per user directive (match article visual system):
  public/articles/endpoint-29-seconds/ — hero-29s-es.svg→png (1200×630 design,
  retina 2400×1260 @83KB via sharp density 192), autopsia-endpoint.svg (antes/
  después waterfall), criminal-email.svg (email anatomy). Mantto brand purple
  #6D71F0→#9B9EF7 accent replaces TypeSafe crimson; layout copied from
  hero-typesafe-es.svg. ogImage wired in frontmatter; 2 figures embedded with
  italic captions. Build 41 pages OK. Pending: user visual review.
