# Feature: Mantto Octane FatalError article (series #2)

Parent session orchestrates. Blog repo: `~/projects/mauriciosuarez-dev`
(branch `feat/articles-infrastructure`; work-unit commits, never push without
explicit user authorization).

## Goal

Second article of the "Diario de un SaaS en producción" series: the
uncatchable FatalError — SDK timeout 60s vs PHP/Octane wall 30s vs fix 20s.
Source: mantto repo docs/solutions/octane-php-timeout-ai-prompts.md +
commit f8c4678 (2026-09-25) + Sentry issue 7753074600 (2026-09-24) + ADR-0008.

## Editorial contract

- Same style/quality bar as article #1 (endpoint-29-seconds): incident
  narrative → autopsy → fix → transferable lessons; real numbers; honest
  caveats; visual system from day one (user directive from #1).
- ES draft first, user review checkpoint, then EN + publish on authorization.
- Series continuity: #1 epilogue promised this story; this one teases #3
  (Sentry frozen release — organically connected via deploy attribution).

## Verified facts

- Sentry 7753074600 (2026-09-24): FatalError "Maximum execution time of 30
  seconds exceeded" on POST /api/v1/ai/improve-description; stack through
  Prism → Guzzle (CurlFactory::createHeaderFn); dead Octane worker + restart
  noise ("ERROR unknown error" ×6).
- Causal chain: NoteImprovementService::improveDescription() called
  TextGateway::prompt() with no timeout → Laravel AI SDK default 60s
  (Promptable::getTimeout()) → Octane HTTP worker fatals at PHP
  max_execution_time 30s → uncapturable engine FatalError; a hung Gemini
  call killed the worker before the SDK timeout could fire.
- Law: client timeout ≥ max_execution_time ⇒ PHP always wins, kills instead
  of degrading. try/catch and gateway failover cannot act on a dead process.
- Fix: TextGateway::prompt(?int $timeout = null) → Prism
  withClientOptions(['timeout']); 3 sync endpoints (improve-note,
  improve-description, classify-maintenance) pass
  config('ai.gateway.http_prompt_timeout') — env AI_HTTP_PROMPT_TIMEOUT,
  default 20s, strictly below 30. Queue context keeps SDK default 60s
  (PHP CLI has no max_execution_time).
- A fired timeout = normal route failure → gateway failover advances to the
  next route or clean 5xx contract.
- Regression: tests/Feature/AI/HttpPromptTimeoutTest.php (106 lines, spy on
  TextGateway asserting bounded timeout + 3 operations). Gotcha: the SDK
  default (60s) is a trap for NEW HTTP callers — explicit timeout required.
- 7 files, 146 insertions in the fix commit.
- Bridge: deploy attribution worked because sentry release tracking was
  fixed 2026-08-31 (before, 6 deploys shared one frozen release).

## Tasks

1. [x] Feature doc (this file).
2. [ ] ES draft `src/content/articles/the-30-second-wall-es.md` (draft: true)
   + slug the-30-second-wall + visual assets (hero + 2 diagrams) + build OK.
3. [ ] User review checkpoint (text + visuals).
4. [ ] Publish ES on authorization; EN version (same slug, -en assets).

## Series plan (post-#2)

#3 Sentry frozen release (teased here) · #4 WhatsApp full-scan ·
#5 no-WebSockets contrarian · #6 R2 100MB/iPhone HEVC.

## Evidence log

- 2026-09-26: feature doc created; source verified (solution doc complete,
  commit f8c4678 message + stat, ADR-0008).
- 2026-09-26: PUBLISHED bilingual per user authorization ("ok hazlo"):
  ES https://mauriciosuarez.dev/es/articulos/the-30-second-wall/ (54a2918,
  workflow success), EN https://mauriciosuarez.dev/en/writing/the-30-second-wall/
  (f2515a5, workflow success; hero-fatal-en.png 77KB retina). hreflang pair +
  x-default verified; og:image per language; RSS both; all assets 200.
  Series chaining: #1 epilogue now links #2 in both langs (68344c7, deployed).
  Feature COMPLETE.
