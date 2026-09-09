---
title: "MaltaCleaners — Plataforma de Operación de Servicios con Concierge de IA"
description: "Plataforma full-stack para una operación real de limpieza en Malta: reservas, concierge por WhatsApp con aprobación humana, portales de administración/empleado/reprogramación, módulo financiero devengo y sincronización iCal con Airbnb — construida de extremo a extremo sobre Cloudflare."
lang: "es"
routeSlug: "maltacleaners"
tags: ["ingenieria-producto", "saas", "integracion-ia", "cloudflare"]
publishedDate: 2025-07-01
featuredOrder: 3
liveUrl: "https://malta-cleaners.com"
screenshots:
  - src: "/projects/maltacleaners/homepage.jpg"
    alt: "Sitio de MaltaCleaners con reservas integradas para limpieza de hogares y servicios de turnover para anfitriones"
    caption: "Sitio con reservas integradas — malta-cleaners.com"
---

MaltaCleaners es la plataforma operativa de un servicio de limpieza en Malta que atiende hogares y anfitriones de alquiler corto: sitio de marketing, reservas, concierge por WhatsApp, portales de personal y finanzas — un sistema que cubre el ciclo completo del primer contacto al pago mensual.

## Contexto y mi rol

El negocio opera con restricciones reales: personal de campo sin estación de trabajo, clientes en WhatsApp, anfitriones sincronizando calendarios de Airbnb y Booking.com. Diseñé y construí la plataforma completa como único desarrollador — arquitectura, modelo de datos (57 migraciones), integraciones y despliegue — trabajando directamente contra las necesidades de la operación.

## Qué hace

- **Reservas con precio autoritativo en el servidor** — selector de fecha, slots y duración; dedup, verificaciones anti-bot (origen, timing, honeypot) y precio calculado solo server-side
- **Concierge por WhatsApp** — auto-respuesta con IA sobre una cadena de fallback multi-modelo (texto y visión), creación y cancelación autónoma de reservas vía tokens firmados, difusión de disponibilidad al personal, auto-bloqueo cuando un humano toma el control y comandos `/pause`/`/unpause`
- **Tres portales** — un SPA React de administración detrás de Cloudflare Access (reservas, clientes, finanzas, gastos, supervisión del concierge, auditoría de emails); un portal de empleados con agenda, desglose de ingresos, subida de fotos antes/después a R2 y disponibilidad semanal; un flujo de auto-servicio de reprogramación para clientes vía tokens firmados
- **Finanzas en base devengo** — P&L con ingreso reconocido al completar, distribuciones entre socios, snapshots mensuales inmutables, ROI por canal y margen por servicio
- **Operación de alquiler corto** — matriz de precios planos de turnover, gestión de propiedades con borrado suave y cascada, y sincronización iCal horaria con auto reserva/cancelación desde feeds de Airbnb, Booking y Vrbo
- **Notificaciones** — email (SendEmail) y plantillas de WhatsApp: confirmaciones, recordatorios, solicitudes de reseña, informes de servicio

## Decisiones que vale la pena notar

- **Cloudflare-native de extremo a extremo**: Pages Functions para la API, D1 para almacenamiento, R2 para fotos, cuatro Workers (cron de reservas, email de reservas, forwarder de email, sincronización iCal) — una plataforma, sin servidores que atender
- **Tokens firmados en lugar de cuentas** para clientes y reprogramaciones — acceso sin fricción donde las contraseñas matarían la adopción
- **Humano en el ciclo por diseño**: el concierge puede actuar, pero la administración aprueba, toma el control y pausa. La autonomía de la IA la delimita la confianza de la operación, no al revés

## Evidencia y límites

La plataforma está en producción en [malta-cleaners.com](https://malta-cleaners.com). Esta página no publica métricas de adopción ni throughput — el alcance honesto es el sistema entregado, su arquitectura y su operación en producción, no resultados de negocio medidos.
