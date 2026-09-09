---
title: "Mantto — Evidencia, IA y operación inmobiliaria"
description: "Conectar evidencia de inspección, análisis asistido por IA, revisión de hallazgos y mantenimiento: permisos por organización, enrutamiento compartido de IA y reportes en segundo plano."
lang: "es"
routeSlug: "mantto"
tags: ["Laravel", "IA aplicada", "operación inmobiliaria", "colas"]
# Fecha de revisión editorial, no de inicio ni lanzamiento del producto.
publishedDate: 2026-09-09
featuredOrder: 3
liveUrl: "https://mantto.app"
screenshots:
  - src: "/projects/mantto/dashboard.png"
    alt: "Panel de operaciones inmobiliarias de Mantto"
    caption: "Vista del producto — operaciones inmobiliarias."
  - src: "/projects/mantto/ai-flow-es.svg"
    alt: "Diagrama de flujo de Mantto: inspección en campo, IA que propone hallazgos en borrador, revisión humana de evidencia y estado, mantenimiento aprobado con evidencia y trabajo lento en segundo plano"
    caption: "La IA propone; la revisión y el estado son de la aplicación. Reconstrucción documentada."
  - src: "/projects/mantto/inventories.png"
    alt: "Interfaz de inventarios de Mantto con hallazgos y evidencia de inspección"
    caption: "Hallazgos de inspección y su evidencia."
  - src: "/projects/mantto/maintenance.png"
    alt: "Interfaz de solicitudes de mantenimiento de Mantto"
    caption: "El mantenimiento sigue a la revisión de los hallazgos."
  - src: "/projects/mantto/inspector-mobile.webp"
    alt: "Interfaz móvil del inspector accesible desde el navegador"
    caption: "Inspección en campo desde el navegador."
timeline:
  - date: "Mar 2026"
    title: "Arranca el historial disponible"
    description: "El primer commit visible ya contiene una aplicación de gestión de mantenimiento en funcionamiento."
  - title: "Integridad de la evidencia en campo"
    description: "Identificadores únicos en las rutas de almacenamiento: dos fotos con el mismo nombre dejan de sobrescribirse. Pruebas de regresión incluidas."
  - title: "De la inspección al mantenimiento aprobado"
    description: "Transiciones de revisión con bloqueo transaccional: la evidencia se comprueba contra su organización, inventario y tipo de medio antes de finalizar."
  - title: "Gateway de IA con contexto de organización"
    description: "La configuración de proveedores se resuelve desde la organización y su plan; los intentos de fallback tienen límite y el contexto viaja con el objeto de negocio."
  - title: "Finalización asíncrona"
    description: "La transición de estado se separa del trabajo lento: reportes, PDFs y notificaciones continúan en segundo plano."
highlights:
  - value: "29 s → <500 ms"
    label: "respuesta del endpoint al separar la finalización del trabajo lento (registro interno; no es un benchmark)"
  - value: "~70 %"
    label: "ahorro de tiempo de inventario estimado (estimación informal, no medida verificada)"
  - value: "4 h → <1 h"
    label: "duración de algunos inventarios según estimación informal del autor"
---

Mantto reúne procesos de mantenimiento e inspección inmobiliaria. Mi trabajo conectó captura de evidencia, análisis asistido por IA, revisión de hallazgos y ejecución de mantenimiento con las necesidades de un sistema utilizado por distintas organizaciones.

## Contexto y contribución

El primer commit visible, de marzo de 2026, ya contiene una aplicación de gestión de mantenimiento. Es un punto del historial disponible, no una fecha de lanzamiento verificada. Su evolución muestra problemas de campo y de operación además de la incorporación de IA.

Mis contribuciones abarcan el almacenamiento de evidencia, las transiciones de revisión, el enrutamiento compartido de IA y la separación entre un cambio de estado y el trabajo lento que desencadena. No basta con generar un hallazgo útil: debe pertenecer a la inspección y organización correctas, conservar su evidencia y llegar a mantenimiento mediante revisión explícita.

## Preservar la evidencia en campo

La integridad de la evidencia fue uno de los primeros problemas. Dos fotografías con el mismo nombre podían acabar utilizando la misma ruta de almacenamiento. Incorporé identificadores únicos a esas rutas y añadí pruebas de regresión.

Es un detalle pequeño de implementación con una consecuencia importante: cada hallazgo depende del material que lo respalda. Generar un reporte sirve de poco si un adjunto sobrescribió otro antes de la revisión.

## De la inspección al mantenimiento aprobado

Reforcé las transiciones de revisión para comprobar la evidencia enviada contra su organización, inventario y tipo de medio esperado. El envío utiliza bloqueo transaccional y la finalización administrativa exige el estado de revisión.

El recorrido conecta:

1. **Captura** — el inspector registra evidencia desde el navegador.
2. **Borrador** — el análisis asistido por IA propone hallazgos, no toma decisiones administrativas.
3. **Revisión** — se comprueban evidencia y estado antes de finalizar.
4. **Mantenimiento** — los hallazgos aprobados se convierten en solicitudes, conservando su relación con la evidencia y evitando conversiones duplicadas.

La salida de IA es una parte del flujo. Los permisos y las transiciones siguen siendo responsabilidad de la aplicación; ni una captura ni un hallazgo de IA constituyen una certificación jurídica o un diagnóstico estructural.

## Un gateway de IA con contexto de organización

Al crecer las capacidades de IA, cada servicio no podía tomar por separado todas las decisiones de proveedor. Trabajé en un gateway común: la configuración se resuelve desde la organización y su plan, las capacidades de los adjuntos orientan el enrutamiento y los intentos de fallback tienen un límite.

El contexto se pasa desde el objeto de negocio en lugar de modificar estado compartido del gateway. Esto importa entre peticiones y trabajos en cola: una tarea no debe reutilizar por accidente la configuración de otra organización.

## Separar la finalización del trabajo posterior

El endpoint de completar mantenimiento esperaba la generación de un reporte con IA, la creación de un PDF, la lectura de adjuntos y el envío de comunicaciones. Separé la transición de estado de ese trabajo posterior.

Los reportes y las notificaciones se despachan de forma independiente. Reintentar un reporte no crea una dependencia que impida procesar las notificaciones. La actualización de estado puede terminar mientras continúa el trabajo lento en segundo plano.

El registro interno del incidente reporta aproximadamente **29 segundos de espera en el endpoint antes del cambio y una respuesta inferior a 500 milisegundos después**. El commit y la documentación respaldan esa observación histórica de un recorrido; esta revisión del portfolio no repitió la medición ni aporta distribución de muestra o percentiles. No es un benchmark de toda la plataforma y el reporte sigue tardando en generarse.

Hay una contrapartida explícita: una notificación puede salir antes de que el PDF esté disponible. Los fallos de generación quedan visibles para reintentos y recuperación, mientras el estado del mantenimiento se gestiona por separado.

## Evidencia, estimaciones personales y límites

La historia se apoya en commits inspeccionados, diffs seleccionados, servicios actuales y notas técnicas sobre rutas de evidencia, transiciones, gateway y finalización asíncrona. Describe decisiones de implementación, no adopción ni impacto de negocio medidos de forma independiente.

**Estimaciones personales, no mediciones verificadas:** he estimado un ahorro de tiempo de inventario cercano al 70% y descrito algunos inventarios que pasan de unas cuatro horas a menos de una. Son estimaciones informales sin periodo, muestra ni método documentados. No forman un único cálculo coherente de antes y después, y no deben leerse como benchmark ni confundirse con la observación separada de latencia del endpoint.

Mantto muestra cómo conecto capacidades de modelos con evidencia, permisos, estados y controles de coste, definiendo qué ocurre cuando alguna pieza falla.
