# Calendario editorial — 30 días

**Ventana:** 22 de septiembre–21 de octubre de 2026\
**Canal principal:** artículo en español en mauriciosuarez.dev.\
**Canal derivado:** post nativo de X que resume la tesis y enlaza al artículo después de su publicación.\
**Estado al 24 de septiembre:** artículos 1, 2 y 3 publicados; próximo artículo propuesto para el 16 de octubre. Las fechas propuestas no sustituyen las fechas reales de publicación. Nada de esta agenda publica contenido por sí solo.

## Tesis de la serie

La adopción útil de IA en empresas no empieza por un chatbot. Empieza por datos y procesos confiables; automatiza lo verificable; reserva la IA para interpretar ambigüedad; y mide el resultado completo, incluida la intervención humana.

MaltaClean es el caso principal. Las comparaciones con Mantto y AutoSentry sirven como ilustración de patrones, no como evidencia cuantitativa transferible.

## Reglas de publicación

- Diferenciar siempre **fundación de software**, **automatización determinista** e **IA**. iCal, recordatorios, GPS puntual, fotos, reportes y reglas de precios no se presentan como IA.
- Las métricas de MaltaClean son observaciones de auditorías semanales, no un experimento causal, ROI ni una estimación de ingresos recuperados.
- No incluir chats, teléfonos, direcciones, nombres, identificadores ni capturas privadas de clientes.
- No usar la disponibilidad pública de MaltaClean como prueba de que una capacidad interna está activa.
- Publicar primero en español. Traducir al inglés sólo después de aprobar la versión española y reutilizando el mismo `routeSlug`.

## Agenda

| Fecha propuesta → real | Artículo | Tesis y audiencia | Evidencia base | Entregable y estado |
| --- | --- | --- | --- | --- |
| **25 sep → 23 sep** | **[El modelo acertó. Igual perdimos al cliente.](https://mauriciosuarez.dev/es/articulos/modelo-acerto-cliente-perdido/)** | Un clasificador puede ser correcto y aun así fallar la experiencia si la excepción no llega a una persona. Para líderes de operaciones y producto. | Auditorías 5 y 15 sep: respuestas manuales, turnos sin respuesta, fallos de clasificación y cola de operadores. | **ES publicado.** Tabla comparativa y hero; sin versión EN. X: sin enlace de publicación registrado. |
| **2 oct → 23 sep** | **[El modelo entiende; el código decide si tiene permiso.](https://mauriciosuarez.dev/es/articulos/modelo-entiende-codigo-decide-permiso/)** | Separar intención semántica de precios, permisos, confirmaciones y efectos evita amplificar un error del modelo. Para equipos de producto/ingeniería. | Auditoría 5 ago; commit `afa05194`; V2 y adapters canónicos. | **ES y [EN](https://mauriciosuarez.dev/en/writing/modelo-entiende-codigo-decide-permiso/) publicados.** Hero y dos gráficos localizados. X: sin enlace de publicación registrado. |
| **9 oct → 24 sep** | **[Probamos modelos más baratos y decidimos no migrar.](https://mauriciosuarez.dev/es/articulos/modelos-baratos-no-migrar/)** | No cambiar de modelo también puede ser una decisión de producto correcta cuando el benchmark no supera los criterios de seguridad. Para audiencia técnica. | ADR 0003: en el spike del 7 ago, el mejor Workers AI logró 4/8 en el indicador conjunto de formato, decisión y categoría; no alcanzó los criterios de promoción. | **ES y [EN](https://mauriciosuarez.dev/en/writing/modelos-baratos-no-migrar/) publicados.** Heroes y gráficos localizados; X: sin enlace de publicación registrado. |
| **16 oct** | **La IA empezó después de las partes aburridas.** | Reservas, catálogo, pagos, iCal, evidencia de servicio y métricas hicieron posible usar IA sin inventar la realidad operativa. Para dueños de empresa y operadores. | Commits de reservas/D1, P&L, iCal, evidencia y snapshots; ADR 0006. | Brief pendiente. Visual: cronología «datos → automatización → IA → supervisión». |

## Lecciones documentadas del artículo 3 · 24 de septiembre

**Mensaje central:** decidir no migrar fue una decisión de producto: el ahorro potencial no compensaba los fallos críticos observados en el clasificador evaluado.

- El spike del **7 de agosto de 2026**, documentado en ADR 0003, se presenta como decisión histórica, no como descripción garantizada del enrutamiento actual.
- El mejor modelo Workers AI obtuvo **4/8** en la medida conjunta de formato, decisión y categoría. Ocho fixtures no permiten inferir una tasa de error poblacional ni prometer ahorros actuales.
- El benchmark distingue validez de JSON y calidad semántica: imponer `json_schema` no resolvió las decisiones incorrectas.
- Ambas versiones usan `publishedDate: 2026-09-24`; un eventual post de X debe enlazar al artículo ya publicado.

## Fuentes internas de verificación

- `src/content/articles/typesafe-jev-es.md`
- `src/content/projects/maltacleaners-es.md`
- `/Users/mauriciosuarez/projects/malta-cleaners/docs/audits/concierge-quality-2026-09-05.md`
- `/Users/mauriciosuarez/projects/malta-cleaners/docs/audits/concierge-quality-2026-09-15.md`
- `/Users/mauriciosuarez/projects/malta-cleaners/docs/adr/0003-text-classifier-no-workers-ai-migration.md`
- `/Users/mauriciosuarez/projects/malta-cleaners/docs/reviews/2026-08-07-workers-ai-spike-results.md`
- `/Users/mauriciosuarez/projects/malta-cleaners/docs/adr/0006-service-evidence-and-gps-privacy.md`
