---
title: "DonMerge — Revisión de Código con IA y Controles"
description: "Una herramienta open-source de revisión de código con IA para pull requests de GitHub: Cloudflare Workflows durables, validación de salida estructurada, fallback de modelos y una puerta de calidad que solo deja pasar hallazgos concretos."
lang: "es"
routeSlug: "donmerge"
tags: ["herramientas-developer", "revision-codigo", "integracion-ia", "cloudflare"]
publishedDate: 2025-05-01
featuredOrder: 1
repoUrl: "https://github.com/mauroziux/donmerge"
screenshots:
  - src: "/projects/donmerge/sentry-integrations.png"
    alt: "Configuración de DonMerge mostrando flujos de revisión disparados por Sentry"
    caption: "Los flujos de triage disparados por Sentry comparten la misma base de ejecución durable"
---

DonMerge es una herramienta de revisión de código con IA que corre sobre pull requests de GitHub y publica sus hallazgos como check runs y comentarios línea a línea — con validación, fallbacks y una puerta de calidad diseñada para que solo hallazgos concretos y argumentados puedan bloquear un merge.

## Contexto y mi rol

Las esperas de revisión ralentizan a los equipos, y la primera pasada es donde un asistente más ayuda sin reemplazar el criterio. Diseñé y construí DonMerge de extremo a extremo como único desarrollador — arquitectura, model runner, puerta de calidad, integración con GitHub y despliegue — y lo validé contra un codebase real en producción.

## Cómo funciona

Cuando se dispara una revisión (webhook del PR, o un comentario `@donmerge` para re-ejecutar), un Cloudflare Workflow ejecuta un pipeline durable de cuatro pasos:

1. Obtener los datos del PR y crear el check run
2. Preparar archivos — filtros y contexto
3. Ejecutar la revisión LLM en un sandbox
4. Publicar la revisión — emparejar y deduplicar hallazgos

Dos decisiones de diseño cargan con la mayor parte del peso:

- **Un model runner dedicado** gestiona el orden de modelos, la validación de salida estructurada, un reintento de reparación de formato y fallback a proveedores directos. Si un modelo agota sus opciones, el paso durable no se repite completo; los errores de infraestructura sin clasificar siguen siendo reintentables por el Workflow.
- **Una puerta de calidad** filtra los hallazgos antes de publicar. Solo los problemas con un mecanismo de fallo descrito pueden bloquear un merge; los comentarios vagos o de estilo se descartan o degradan a sugerencias no bloqueantes. Los hallazgos usan claves estables, así que las re-ejecuciones deduplican en lugar de repetirse, y los comentarios atendidos se resuelven automáticamente.

## Evidencia de una validación en producción documentada

El 2026-08-21, tras un incidente de timeouts y un refactor de la política de reintentos, se registró una validación contra un repositorio privado en vivo:

- Una revisión re-disparada sobre el PR del incidente completó en **7m15s** y reportó correctamente un bypass real de la máquina de estados en el código objetivo
- De quince PRs abiertos re-disparados en ráfaga, seis checks fallaron inicialmente (`DM-E005`); **los seis completaron exitosamente al re-ejecutar** sin cambio de código — tratados como fallos transitorios bajo carga en ráfaga, no como causa raíz probada
- Verificación pre-despliegue: `typecheck`, `npm test -- --run` (1.096 tests), `git diff --check` y `wrangler deploy --dry-run`

Son observaciones documentadas de una validación, no un benchmark.

## Límites

- Un humano decide el merge; DonMerge comprime el análisis de primera pasada, no aprueba código
- Los flujos de triage disparados por Sentry que existen en el codebase comparten la base de ejecución durable; no afirmo resolución autónoma de errores
- Las cifras anteriores provienen de un registro de validación único y fechado, publicado con el proyecto
