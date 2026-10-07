---
title: "6 deploys, 1 release: el misterio del Sentry congelado"
description: "Semanas de deploys reportando el mismo release de julio en Sentry. Tres falsos finales y la cadena de precedencias de env vars que casi nadie entiende."
lang: "es"
routeSlug: "release-sentry-congelado"
tags: ["sentry", "docker", "devops", "laravel", "postmortem"]
publishedDate: 2026-09-26
draft: true
ogImage: "/articles/frozen-sentry-release/hero-sentry-es.png"
---

Durante semanas, cada error de producción tenía la misma firma: release `68f50f6`. Un commit del 31 de julio. Seis deploys después —con features, fixes y hasta un incidente resuelto en el medio— Sentry seguía mostrando ese SHA como el release vigente. ¿Cómo puede un deploy de septiembre reportar un release de julio?

Esta es la historia de ese misterio. Tiene tres falsos finales, una cadena de precedencias que casi nadie puede dibujar de memoria, y una lección incómoda sobre herramientas de observabilidad.

El sistema es [Mantto](/es/proyectos/mantto/), el SaaS de mantenimiento inmobiliario de [esta serie](/es/articulos/endpoint-29-segundos/). Para entender por qué esto importa: el release de Sentry es el contrato que responde "¿qué deploy introdujo este error?". Es la herramienta con la que atribuí el [FatalError de la entrada anterior](/es/articulos/barrera-de-los-30-segundos/) al deploy correcto. Un release congelado no es un problema cosmético — es el triage muerto.

## El síntoma: triage imposible

El 31 de agosto lo formalicé: seis deploys posteriores al 31 de julio compartían el mismo release en Sentry. La pregunta operativa más básica —"¿esto lo introdujo el deploy del martes o venía de antes?"— no tenía respuesta. Los eventos mentían sobre su origen, con la tranquilidad de quien mide mal sin saberlo.

Y acá va la parte que me costó aceptar: **el sistema no estaba roto de una forma visible**. Los errores llegaban, los stack traces eran perfectos, los tags impecables. Solo el atributo más importante para el triage era ficción. Una herramienta de observabilidad que miente es peor que no tenerla: te da confianza para responder preguntas equivocadas.

## Acto 1: el env estático (falso final #1)

La investigación empezó donde empiezan todas: buscando el valor en todos los lugares donde puede vivir. Y ahí estaba: `SENTRY_RELEASE=68f50f6`, seteado como **env estático de la app en Coolify**. Alguien —yo, en un build local, con la mejor intención— había dejado ese valor en la configuración de la aplicación.

Primer malentendido destapado, y es el que ordena todo lo que sigue:

> **El env de runtime de Coolify siempre pisa al `ENV` de la imagen Docker.** No importa cuán correcto sea tu Dockerfile: si existe un env estático en la plataforma, tu build está anulado.

Lo borré vía API de Coolify. Deploy de verificación. Y durante un instante creí que había terminado. No.

## Acto 2: el fallback vacío (falso final #2)

El mecanismo "correcto" ya existía en el Dockerfile: hornear `ENV SENTRY_RELEASE` con un `ARG SENTRY_RELEASE` y un fallback a `ARG SOURCE_COMMIT`. Elegante: el valor viaja con la imagen desde el build.

Deploy. El release seguía mal — ahora vacío. ¿Cómo puede llegar *vacío* un `ARG` con fallback?

Porque **Coolify 4.1.0 inyecta `SOURCE_COMMIT` como env de runtime del contenedor, no como build-arg de `docker build`**. El dashboard te hace creer una cosa; la inyección hace otra. Mi Dockerfile esperaba un argumento de build que nunca llegó: Coolify se lo guardaba para el runtime, donde el env estático ya no existía.

Segundo malentendido: **el mismo valor vive en dos mundos con reglas distintas** (build-time vs runtime) y las plataformas no son explícitas sobre en cuál lo ponen.

![Diagrama de la cadena de precedencias: el env de runtime de Coolify siempre pisa al ENV de la imagen Docker, que a su vez pisa al ARG de build; el fix definitivo resuelve el release en la config de la app leyendo el SOURCE_COMMIT que Coolify inyecta en runtime](/articles/frozen-sentry-release/cadena-precedencias.svg)

*La jerarquía que casi nadie puede dibujar de memoria — y el camino del valor hasta su lugar correcto. En celular, deslizá el gráfico para verlo completo.*

## Acto 3: resolver en config, donde vive la verdad (final real)

La solución definitiva no vive en el Dockerfile ni en la plataforma. Vive en `config/sentry.php`, que se evalúa en runtime — el único lugar donde todos los caminos convergen:

```php
'release' => env('SENTRY_RELEASE') ?: env('SOURCE_COMMIT'),
```

Dos detalles que hacen que esta línea sea la correcta:

- `SENTRY_RELEASE` (opcional) sigue ganando si existe — útil para builds locales: `SENTRY_RELEASE=$(git rev-parse --short HEAD) docker compose build api`.
- Es `?:`, no `??`: un string **vacío** también cae al fallback. Con `??`, un `SENTRY_RELEASE=""` reinyectado congelaría el release otra vez.

El env estático quedó eliminado de Coolify vía API. Deploy de verificación: `php artisan about` reportó `Release = d4033036fc51…` — el SHA completo, exacto, del commit recién desplegado.

![Línea de tiempo de los tres actos: el env estático eliminado parecía el final, el fallback del Dockerfile llegó vacío porque Coolify inyecta SOURCE_COMMIT en runtime, y el fix en config con verificación de SHA exacto](/articles/frozen-sentry-release/falsos-finales.svg)

*Tres actos, dos falsos finales: cada fix destapaba el siguiente malentendido de la cadena. El final real resolvió donde todos los caminos convergen.*

## El ritual de los 10 segundos

El fix sin verificación es una promesa. Así que quedó institucionalizado un smoke post-deploy que toma 10 segundos:

```bash
docker exec "$container" php artisan about --no-ansi | grep Release
```

El valor debe ser el SHA del commit recién desplegado. Si ves un SHA viejo repetido → alguien volvió a setear el env estático. La memoria institucional no es "acordarse de no hacerlo"; es un check que lo detecta en el próximo deploy. `SERVER.md` documenta la advertencia y el smoke.

## Los gotchas, en corto

- **Nunca setear `SENTRY_RELEASE` como env estático en la plataforma.** Ya pasó una vez; la advertencia quedó escrita y el smoke lo detecta. (Los regresiones de config no se arreglan con memoria: se arreglan con detección.)
- **Los releases históricos cortos (`68f50f6`) y los nuevos (40 chars) no se unifican.** El mecanismo viejo reportaba SHAs cortos; el nuevo, completos. Aceptar la frontera en los datos es parte del fix.
- **Operar Coolify por API tiene sus propias trampas:** el endpoint negocia HTTP plano (el dashboard dice https, pero el puerto no hace TLS) — pendiente habilitarlo. El runbook quedó documentado con las tres operaciones necesarias: listar envs, eliminar, redeploy.

## Lo transferible

1. **Una herramienta de observabilidad que miente es peor que no tenerla.** El atributo que da contexto al triage es un contrato: si no podés confiar en él, desconfiás de todo lo demás también.
2. **La precedencia de env vars es una cadena, no una caja.** Runtime de la plataforma > `ENV` de imagen > `ARG` de build. Cuando depurás "por qué mi valor no llega", dibuja la cadena antes de tocar código.
3. **Las plataformas inyectan valores en el mundo (build/runtime) que menos esperás.** Coolify hace runtime con algo que parece build-time. Verificá dónde aterriza el valor antes de diseñar alrededor.
4. **`?:` y `??` no son lo mismo.** Un string vacío es un valor presente para `??` y ausente para `?`. En configs que humanos editan, esa diferencia es un release congelado esperando pasar.
5. **Los rituales de 10 segundos le ganan a la buena memoria.** La prevención que depende de acordarse falla justo cuando el equipo está distraído. La que depende de un comando en el runbook, no.

Dos honestidades de cierre: este incidente no generó ni un error de usuario — fue invisible por diseño, que es lo que lo hace peligroso. Y el fix final es una línea de config; lo difícil no fue escribirla, fue reconstruir la cadena de precedencias que la justificaba. El debugging de configuración es arqueología, no cirugía.

---

*El próximo misterio de la serie ni siquiera parece un problema: cada vez que un inquilino escribía "hola" por WhatsApp, mi servidor leía todas las filas de dos tablas. Sin error, sin alerta, sin nadie quejándose — solo una base de datos trabajando mucho más de lo que debería, un mensaje a la vez. Esa es la siguiente entrada.*
