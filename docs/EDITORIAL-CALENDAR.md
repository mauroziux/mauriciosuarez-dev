# Editorial Calendar — "Diario de un SaaS en producción"

Single source of truth for the series' article backlog, blog publication
schedule, and X/LinkedIn distribution. Update it on every publish/promo cycle.

## Series concept

Incident-driven postmortems from real SaaS production work (Mantto and other
projects). Format per entry: hook → symptom → autopsy → fix → transferable
lessons → honest caveats → epilogue teasing the next entry. Bilingual ES/EN,
visual system from day one (hero banner + 1–2 diagrams, subject's brand color).

## Published

| # | Slug | Live ES/EN | Social promo | Teases |
|---|------|-----------|--------------|--------|
| 1 | `endpoint-29-seconds` | 2026-09-26 ✅ | **pending** | #2 (linked) |
| 2 | `the-30-second-wall` | 2026-09-26 ✅ | **pending** | #3 (not yet linked) |

## Upcoming articles (briefs)

Each brief carries its verified source material from the Mantto repo
(`~/projects/mantto-org/repos/mantto`) so any session can pick one up cold.

### #3 — "6 deploys, 1 release: el misterio del Sentry congelado" (slug: `frozen-sentry-release`)

- **Status**: next up · teased by #2's epilogue · **must link back when published**
- **Sources**: `docs/solutions/sentry-release-tracking.md` (incidente real 2026-08-31); commits `d403303`, `6d34165`, `c68351b`; ADR-0008.
- **Data**: all Sentry events attributed to release `68f50f6` (Jul 31) regardless of deployed commit — 6 deploys shared one release, "what deploy broke this?" triage impossible. Root-cause chain: static `SENTRY_RELEASE` runtime env in Coolify **overrides** image `ENV`; then baking `ENV` with `ARG SOURCE_COMMIT` fallback arrived **empty** because Coolify 4.1.0 injects `SOURCE_COMMIT` as runtime env, not build-arg. Definitive fix in `config/sentry.php`. Bonus regression: 500-on-duplicate (UNIQUE → 422 pattern, `docs/solutions/entity-duplicate-code-validation.md`).
- **Diagrams plan**: (1) the env-precedence chain (runtime env > image ENV > build-arg) as a detective board; (2) 6 deploys → 1 release funnel.
- **Series bridges**: opens as "the mystery #2's epilogue promised"; its fix is why #2's incident was attributable to the right deploy.

### #4 — "Cada 'hola' por WhatsApp leía toda mi base de datos" (slug: `whatsapp-full-scan`)

- **Sources**: `docs/solutions/concierge-lookup-expression-indexes.md`; commit `5c2b4c1`; docs/whatsapp-bot-onboarding.md.
- **Data**: `GlobalResidentResolver` runs on **every inbound WhatsApp webhook**; phone/document matching via `regexp_replace(...)` can't use b-tree → full table scans on `owners` + `tenants` per message; plus N+1 (`properties()->get()` per matched person). Fix: PostgreSQL **expression indexes textually identical** to the query expressions (PG only matches textually) + batch property loading.
- **Diagrams plan**: (1) one message → scan-all-rows flow; (2) expression index vs b-tree anatomy.

### #5 — "Borré los WebSockets y no me arrepiento" (slug: `polling-over-websockets`)

- **Sources**: ADR-0014 (HTTP polling only); TanStack Query `refetchInterval`.
- **Data/pattern**: adaptive polling 3s while an AI run is active / 30s general / `false` when finalized; no stateful runtime behind Cloudflare; "real-time" needs are usually "show me when this job finishes". Contrarian take — strongest X performer of the backlog.
- **Diagrams plan**: (1) polling cadence state machine; (2) what a WebSocket stack would add vs what polling costs.

### #6 — "El límite de 100 MB y los videos de iPhone" (slug: `r2-presigned-uploads`)

- **Sources**: ADR-0010; `docs/operations/` backup scripts.
- **Data**: Cloudflare proxy blocks >100 MB requests — inventory videos (HEVC from iPhones) routinely exceed it. Fix: browser → R2 direct via presigned PUT / multipart. R2 quirks hit in production: multipart `upload_id` >255 chars truncated by `string(255)`; 501 on `PutObjectAcl` → public access must be bucket-level.
- **Diagrams plan**: (1) proxy path vs presigned path; (2) the three R2 quirks as "gotcha cards".

### #7 (reserva) — "El gateway de IA con presupuesto por plan" (slug: `ai-gateway-tiers`)

- **Sources**: ADR-0005; `docs/solutions/ai-gateway-tiered-routing.md`; commit `13d1c1d` (Workers AI glm-5.3-flash route).
- **Data**: 9+ AI operations routed through one gateway; tiers economy/premium resolved from the org's plan (immutable, Octane-safe — no ambient state); capped fallbacks; smart routing by attachment capability; per-tier Cloudflare gateway ids for isolated billing.

### #8 (reserva) — "El motor SLA que no puede dormirse dos veces" (slug: `sla-idempotent-engine`)

- **Sources**: ADR-0004; commit `02ce869`.
- **Data**: partial unique index = exactly one open episode per request; in-row escalation 24h→48h→72h; backlog backfill; then the N+1 chapter: ~90 queries every 15 min (Sentry 7722333465) → 5 queries after batching.

## Blog publication schedule

Cadence: **1 artículo por semana, martes** (sweet spot para contenido dev;
deja lunes para preparación y fin de semana para revisión del usuario).

| Semana | Fecha (martes) | Artículo | Estado |
|--------|---------------|----------|--------|
| — | ya publicado 2026-09-26 | #1 endpoint-29-seconds | ✅ |
| — | ya publicado 2026-09-26 | #2 the-30-second-wall | ✅ |
| 1 | **2026-10-06** | #3 frozen-sentry-release | planificado |
| 2 | **2026-10-13** | #4 whatsapp-full-scan | planificado |
| 3 | **2026-10-20** | #5 polling-over-websockets | planificado |
| 4 | **2026-10-27** | #6 r2-presigned-uploads | planificado |
| 5 | **2026-11-03** | #7 ai-gateway-tiers (o #8) | reserva |

Production per article (pipeline ya validado, ~1–2 h por entrada):
draft ES + visual system → checkpoint usuario → publish ES → EN + assets -en
→ link-back desde la entrada anterior → verify (hreflang, og:image, RSS).

## Distribution protocol — X y LinkedIn

### X (estrategia nativa, no link-first)

Objetivo del usuario: **que lean en X y sigan** — no mandar tráfico al blog.
Por eso el post de X es contenido completo nativo, no un enlace.

- **Formato**: post largo nativo (la historia condensada: síntoma → giro →
  ley/número → 1 lección), con **una imagen** (el diagrama estrella o el
  hero). El link al artículo va en **reply** propio ("lo completo acá, ES+EN").
- **Hora**: mismo día del artículo, **8:00 COT** (9 ET, pico dev US Este).
- **Día+3**: repost/quote con la **cita monetizable** de la entrada
  ("el silencio no es salud, es normalización" / "no degrada: mata").
- **Hilo alternativo** para historias con pasos (#3): hilo detective de 5-6
  tweets, un paso por tw, diagrama de env-precedence como cierre.

### LinkedIn

- **Formato**: post con **hero banner** como imagen + hook de 3 líneas +
  pregunta final para comentarios; **link en el primer comentario**
  (alcance) y también al final del texto.
- **Hora**: **miércoles 7:30 COT** (día siguiente al artículo; LinkedIn
  rinde mañanas de martes a jueves).
- **Tono**: un escalón más "profesional/lesson-first", menos coloquial que X.

### Catch-up: promoción de #1 y #2 (ya publicadas, sin promoción)

| Fecha | Canal | Contenido |
|-------|-------|-----------|
| **Lun 2026-09-28, 8:00 COT** | X | Post nativo #1 (29 segundos, imagen del waterfall) + reply con links |
| **Mar 2026-09-29, 7:30 COT** | LinkedIn | #1 con hero + link en comentario |
| **Mié 2026-10-01, 8:00 COT** | X | Post nativo #2 (FatalError, imagen de la carrera) + reply |
| **Jue 2026-10-02, 7:30 COT** | LinkedIn | #2 con hero + link en comentario |
| Vie 2026-10-02 | X | Quote con cita monetizable del #1 |

### Ciclo semanal estable (desde la semana del 2026-10-06)

| Día | Acción |
|-----|--------|
| Lunes | Preparar/terminar el artículo de la semana + post X en borrador |
| **Martes 8:00 COT** | Publicar blog (ES+EN) + post nativo X + reply con links |
| **Miércoles 7:30 COT** | Post LinkedIn (hero + link en comentario) |
| Viernes | Quote X con la cita monetizable · responder comentarios ambos canales |
| Cada 3 artículos | Post "recap de la serie" (X + LinkedIn) con los números acumulados |

## Maintenance rules

- Al publicar un artículo: marcarlo ✅ arriba, mover el tease de la entrada
  anterior a link real, y actualizar la tabla de publicación.
- Al hacer la promo social: marcar la fila correspondiente con fecha y link
  al post (cuando exista URL pública).
- Si una semana se pierde: no apilar — desplazar todo una semana y conservar
  los martes.
- Los briefs son contratos con las fuentes: si un dato no está en el repo,
  no se publica (regla de honestidad de la serie).
