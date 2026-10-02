---
title: "Jev en producción: 623 turnos después, complemento antes que reemplazo"
description: "Puse a Jev, el modelo de decisiones tipadas de TypeSafe, en shadow sobre el WhatsApp real de una empresa de limpieza: 623 turnos, 92 teléfonos. El acuerdo con el pipeline existente cayó a 34%, pero clasificó el 95% de los turnos donde el LLM no respondió. La conclusión honesta: complemento experimental, no reemplazo."
lang: "es"
routeSlug: "typesafe-jev-part-2"
tags: ["integracion-ia", "llm", "evaluacion", "arquitectura", "automatizacion"]
publishedDate: 2026-10-02
draft: false
---

En [la primera parte](/es/articulos/typesafe-jev/) probé Jev, el modelo de TypeSafe que devuelve decisiones estructuradas en vez de escribir respuestas. Después de 292 casos sintéticos, el resultado prometía: 94,2% de acierto de intención bajo nuestro criterio de evaluación y una latencia p95 de 457 ms en un probe de Workers AI.

Dejé una tarea pendiente: ponerlo junto al concierge de [MaltaClean](https://malta-cleaners.com) sobre conversaciones reales y contar qué pasaba.

Ya tenemos ese primer corte: **623 turnos de WhatsApp, de 92 teléfonos diferentes**. La conclusión es menos espectacular que la del laboratorio, pero más útil: **no tengo evidencia para reemplazar al LLM. Sí tengo razones para seguir evaluando Jev como complemento, especialmente cuando el pipeline principal falla.**

Y hay una advertencia que importa más que cualquier porcentaje: dos modelos que discrepan no te dicen, por sí solos, cuál tiene razón.

## Lo que pusimos en producción —y lo que no

Jev corrió en *shadow*: recibe una versión del contexto y clasifica en paralelo al sistema actual. Registramos etiquetas, probabilidades, latencia y errores. Su respuesta no cambia el mensaje que recibe el cliente, no crea reservas y no autoriza ninguna acción.

El LLM siguió atendiendo. Jev observó.

Eso permite estudiar discrepancias sin convertir al cliente en el sujeto de un experimento de routing. También limita lo que puedo concluir: **este ensayo no demuestra que Jev haya aumentado ventas, reducido esperas o evitado una mala respuesta. No le dimos la oportunidad de producir esos efectos.**

La tabla de comparación no guarda nombres, teléfonos ni mensajes; para contar los teléfonos distintos usamos un join interno y exportamos únicamente el agregado. No voy a publicar conversaciones de clientes para ilustrar el ensayo.

## El número que sería fácil contar mal

El 26 de septiembre corregimos las preguntas: aclaramos las fronteras entre precio, cotización y disponibilidad; endurecimos el requisito de confirmación de una propuesta; y añadimos una categoría para conversaciones dirigidas al negocio equivocado.

El modelo observado siguió siendo `jev-1.13.0`. Las preguntas, no.

Por eso separé los resultados:

| Medición | Filas anteriores, sin versión | Preguntas 2.2.0 |
| --- | ---: | ---: |
| Turnos registrados | 367 | 256 |
| Clasificaciones de Jev recibidas y parseadas | 343 | 246 |
| Coincidencia exacta con el pipeline principal | 52,2% | 34,1% |
| Coincidencia cuando el pipeline terminó como `provider_valid` | 51,5% | 43,9% |
| Latencia p50 / p95 de Jev, solo respuestas exitosas | 545 / 1119 ms | 541 / 1220 ms |

Sería tentador titular: «Jev pasó del 94% al 34%».

**Sería incorrecto.** El 94,2% del laboratorio mide acierto contra etiquetas del corpus sintético. El 34,1% real mide acuerdo con otro sistema. No son la misma métrica. Si Jev acierta donde el LLM falla, el acuerdo baja. Si ambos cometen el mismo error, el acuerdo sube.

Tampoco puedo decir que las preguntas nuevas empeoraron el modelo: cambió el tráfico y el comparador sufrió una degradación importante.

## Cuando el LLM no respondió, Jev muchas veces sí

Este es el hallazgo más interesante del corte nuevo.

Con las preguntas 2.2.0 hubo **61 turnos en los que el pipeline principal marcó que el proveedor no estaba disponible**. Jev entregó una clasificación en **58 de esos 61: 95,1% de disponibilidad en ese subconjunto**.

En esos casos el sistema principal caía en una respuesta de fallback con una etiqueta genérica. Jev proponía categorías más específicas: cotización, queja, cambio de reserva, pago o conversación mal dirigida, entre otras.

Eso explica parte del bajo acuerdo: estábamos comparando una decisión de Jev contra una etiqueta de contingencia, no contra una decisión real del LLM.

Pero responder no equivale a acertar. **No he demostrado que esas 58 clasificaciones fueran correctas**, ni que hubieran permitido atender mejor al cliente. En tres turnos fallaron ambos caminos. Y ambos usan infraestructura compartida de Cloudflare/Gateway: no es redundancia demostrada frente a cualquier tipo de caída.

Lo que sí cambia es dónde buscar valor. Quizá la pregunta no sea «¿puede Jev clasificar todo primero?», sino «¿puede aportar triage útil cuando el sistema principal se queda sin una clasificación válida?».

## Las preguntas pequeñas tienen más sentido que el router grande

### ¿Esta persona está buscando trabajo?

En el segmento actual, el pipeline etiquetó 26 turnos como reclutamiento. La pregunta binaria de Jev marcó los **26**. Marcó también cuatro turnos adicionales.

Es una corroboración fuerte de una distinción importante para una empresa de servicios: alguien que quiere trabajar para ti no es un lead que quiere comprar.

Pero esos cuatro adicionales todavía son discrepancias por revisar, no «falsos positivos» demostrados. El LLM no se convierte en verdad humana porque sea el sistema que ya teníamos.

### ¿Necesita una persona ahora?

Con un umbral de 0,7, Jev marcó 28 turnos. El pipeline ya escalaba **27 de ellos**.

Es decir: confirma mucho más de lo que descubre. Además, el pipeline escaló 95 turnos en ese segmento; la señal de Jev solo coincide con 27 de esos 95. No sirve para sustituir el mecanismo completo de handoff.

Al bajar el umbral a 0,5 aparecen doce turnos que el pipeline no escaló. Es ahí donde hace falta una revisión independiente: pueden ser problemas que se nos escaparon, o pueden ser alertas innecesarias.

**Una segunda opinión vale cuando distingue errores útiles de ruido, no solo cuando produce otra probabilidad.**

## Una lección que sí volvió a aparecer: la pregunta importa

La señal `ready_to_auto_propose` estaba demasiado abierta. Antes marcaba como positivos 152 de 343 turnos: **44,3%**, incluyendo turnos escalados o ignorados.

Después de exigir una confirmación explícita de una propuesta concreta, marca 16 de 246: **6,5%**.

El cambio es grande. No cambiamos el modelo; cambiamos lo que le pedimos decidir. No atribuyo toda esa diferencia a la redacción: también cambió el tráfico.

Eso todavía no prueba que la señal sea precisa: falta revisar las confirmaciones originales y también los casos que dejó de marcar. Pero muestra por qué un output perfectamente tipado puede seguir siendo semánticamente inadecuado.

«Quiere contratar» y «ha confirmado esta propuesta» no son la misma pregunta. Y ninguna probabilidad autoriza por sí sola una reserva.

## Lo que tuve que corregir en mi propia evaluación

El ensayo también expuso límites del instrumento, no solo de Jev.

**Las entradas no son totalmente equivalentes.** El shadow comparte historia textual y contexto de reservas, pero no recibe todo el contexto operacional ni los píxeles de las imágenes que procesa el LLM. Además, algunas categorías finales son decisiones de código que Jev ni siquiera puede emitir.

**Confianza no es calibración demostrada.** Una confianza más alta se relaciona con mayor acuerdo, pero para verificar calibración necesito etiquetas independientes sobre los mensajes reales, no coincidencia con el comparador.

**Tipado no es disponibilidad de extremo a extremo.** Registramos 34 errores: 20 fueron `missing_answers` asociados al bug documentado del adaptador durante el arranque; el resto fueron fallos de transporte o HTTP. El modelo puede prometer una forma de salida y mi integración puede leerla mal.

**Barato no significa gratis.** Cloudflare publica $0,042 por millón de tokens de entrada y salida gratuita. No guardamos el consumo de tokens del shadow, así que no tengo una factura medida para esta ventana. No voy a convertir el coste del corpus sintético en una cifra exacta del tráfico real.

**Paralelo no significa cero latencia añadida.** El runtime espera de forma acotada al shadow después del clasificador y también espera su escritura en D1. No registramos timeouts de esa espera, pero eso no prueba que nunca añadiera milisegundos. La latencia p95 real de Jev fue 1220 ms con las preguntas actuales; los 457 ms del artículo anterior eran otro benchmark, con estados sintéticos y un camino de ejecución distinto.

## Entonces: ¿sirve o no?

Mi decisión hoy es concreta:

- **Como reemplazo o router delante del LLM: no lo adopto con esta evidencia.**
- **Como segunda opinión para investigar errores: sí merece seguir en shadow.**
- **Como triage auxiliar durante fallos: es la hipótesis con mejor señal nueva, pero falta demostrar que clasifica correctamente.**

Tampoco enviaría cada desacuerdo a un humano: con las preguntas actuales sería el 65,9% de las respuestas comparables. Un verificador que convierte casi todo en revisión manual puede añadir trabajo en vez de quitarlo.

Tenemos aproximadamente diez días de observación, no las dos semanas y 700 turnos que habíamos fijado para cerrar la fase. Y las preguntas nuevas llevan menos de una semana. Pero esperar más días sin revisar los casos no resolverá la pregunta principal.

El paso que falta es un conjunto de evaluación real, revisado independientemente: acuerdos, desacuerdos, fallos del pipeline y preguntas binarias, con historia y hechos suficientes para juzgar. No solo los ejemplos más llamativos.

Después habrá que medir algo que le importe al negocio: triage correcto, menos alertas inútiles o menor tiempo hasta una atención efectiva. No solo una matriz de dos modelos que discuten.

## La tesis, ajustada

En la primera parte escribí que Jev podía completar el stack. Sigo viendo esa posibilidad, pero ahora con una condición más clara:

**Una salida tipada garantiza la forma de una decisión, no su verdad ni el valor de actuar sobre ella.**

El laboratorio me convenció de probarlo. El tráfico real me mostró que todavía no tengo motivos para entregarle el control. Sí tengo un lugar más concreto para evaluarlo: decisiones pequeñas y una segunda fuente de señales cuando el camino principal falla.

Ese es el resultado de esta segunda parte. No «Jev ganó». No «Jev no sirve». **Complemento experimental, con señales prometedoras y límites que ya podemos medir.**

---

### Fuentes y método

- [Primera parte: TypeSafe Jev](/es/articulos/typesafe-jev/).
- [Ficha y tarifa del modelo en Cloudflare](https://developers.cloudflare.com/ai/models/typesafe/jev/), consultada el 30 de septiembre de 2026.
- Registro D1 agregado: ventana del 20 de septiembre al 30 de septiembre, corte exclusivo 09:34:28 UTC. Cobertura verificada por llave: 623/623.
- 623 turnos de 92 teléfonos, no 623 observaciones independientes. 589 respuestas comparables y 34 errores. Rúbricas separadas; sin A/B ni gold humano nuevo.
