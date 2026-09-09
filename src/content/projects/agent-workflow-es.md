---
title: "Trabajo con agentes — Contexto, herramientas y continuidad"
description: "Una práctica de ingeniería basada en contexto de repositorio, una biblioteca de skills mantenida y extensiones de Pi, distinguiendo código propio, adaptaciones y herramientas de terceros."
lang: "es"
routeSlug: "agent-workflow"
tags: ["herramientas de desarrollo", "Pi", "skills", "búsqueda semántica"]
# Fecha de revisión editorial, no de inicio de esta práctica de ingeniería.
publishedDate: 2026-09-09
featured: false
---

Mi trabajo con agentes incluye la configuración y extensión del entorno en el que desarrollo software. He trabajado en herramientas para explorar repositorios, instrucciones reutilizables y mecanismos que mantienen continuidad cuando falla un modelo o una tarea pasa por distintas etapas. Este caso describe una práctica de ingeniería que complementa los productos.

## Contexto del repositorio antes de ejecutar

MCP-groomer recoge una parte de ese trabajo: automatización alrededor de tickets, repositorios y preparación de cambios. Su historial de enero de 2026 muestra indexación de código y búsqueda semántica; cambios posteriores añaden herramientas de ejecución.

El reto era aportar contexto relevante del repositorio y herramientas de trabajo, en lugar de esperar que el modelo dedujera el código solo desde un ticket. El nombre del proyecto no acredita que implementara un servidor MCP. La existencia del código de indexación y búsqueda tampoco establece la calidad de recuperación ni un despliegue actualmente activo.

## Una biblioteca mantenida, no copias divergentes

Mantener instrucciones en varios entornos introdujo otra dificultad. Las copias independientes podían divergir, algunos enlaces simbólicos apuntaban en la dirección equivocada y el descubrimiento duplicado podía cargar una skill dos veces.

Consolidé la biblioteca compartida en un repositorio con historial preservado y documenté cómo descubre instrucciones cada herramienta. La sincronización contempla copias de respaldo y skills específicas de cada entorno. Esto permite inspeccionar mejor el origen de una instrucción y el camino por el que se carga.

El historial recoge curación, eliminación de duplicados, mejoras de instrucciones y sincronización con fuentes originales. La biblioteca combina creación propia, adaptación y material de terceros. Mi contribución incluye mantener esas relaciones e integrar el entorno entre herramientas, no atribuirme la autoría de todas las skills instaladas.

## Continuidad cuando falla un proveedor

Las extensiones locales de Pi muestran trabajo sobre continuidad de ejecución. Una cambia de proveedor ante fallos y retoma desde la sesión existente, conservando resultados de herramientas e instrucciones para evitar efectos repetidos. Otra conecta una tarea aprobada con un objetivo persistente y un presupuesto de ejecución.

Estas extensiones adaptan un entorno de agentes existente; no implican haber creado Pi ni los modelos utilizados. Su comportamiento requiere verificación. Una instrucción para no repetir una acción no es una garantía de ejecución exactamente una vez.

## De una tarea a evidencia revisable

Un recorrido representativo conecta:

1. **Tarea y alcance** — definir el cambio solicitado y sus límites.
2. **Contexto** — recuperar información del repositorio e instrucciones mantenidas relevantes.
3. **Ejecución** — usar herramientas dentro de ese alcance, conservando resultados entre etapas.
4. **Revisión** — registrar hallazgos para poder discutirlos y comprobarlos.
5. **Verificación** — examinar el cambio propuesto y sus controles antes de considerarlo terminado.

Los artefactos de Mantto muestran trabajo asistido por agentes aplicado a problemas de límites por organización, importaciones y concurrencia. Un hallazgo registrado es evidencia para investigar, no una prueba automática de corrección ni una reparación ya cerrada.

## Evidencia y límites

La historia se basa en los historiales de skills y MCP-groomer, cambios seleccionados, código de extensiones locales de Pi y artefactos de revisión. La revisión de fuentes no ejecutó esas extensiones ni midió éxito de tareas, calidad de recuperación, coste o velocidad. El historial preservado anterior a la extracción de la biblioteca no fija la creación de su repositorio independiente.

Esta práctica complementa mi ingeniería de producto: preparar contexto, conectar herramientas y supervisar agentes conservando procedencia y límites explícitos. No afirma superioridad frente a herramientas comerciales de programación.
