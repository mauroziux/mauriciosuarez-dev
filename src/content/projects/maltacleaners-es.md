---
title: "MaltaCleaners — De una web de reservas a una operación con IA"
description: "Una plataforma de reservas evolucionó hacia operación de servicios con un Concierge por WhatsApp: control humano, precios con contexto, resultados tardíos y evaluación aislada."
lang: "es"
routeSlug: "maltacleaners"
tags: ["TypeScript", "Cloudflare", "WhatsApp", "evaluación de IA"]
# Fecha de revisión editorial, no de inicio ni lanzamiento del producto.
publishedDate: 2026-09-09
featuredOrder: 4
liveUrl: "https://malta-cleaners.com"
screenshots:
  - src: "/projects/maltacleaners/homepage.jpg"
    alt: "Web pública de MaltaCleaners con servicios de limpieza y reservas en Malta"
    caption: "Web pública de reservas; esta captura no demuestra el funcionamiento privado del Concierge."
  - src: "/projects/maltacleaners/concierge-flow-es.svg"
    alt: "Diagrama de flujo del Concierge de MaltaCleaners: mensaje de WhatsApp, contexto de conversación y catálogo autorizado, decisión sobre significado y autoridad, acción autorizada con precios vigentes o intervención de un operador"
    caption: "Sin contexto o autoridad, el camino es el operador. Reconstrucción documentada."
timeline:
  - date: "May 2026"
    title: "Web de reservas"
    description: "El historial disponible comienza con la web pública de reservas y persistencia de datos."
  - title: "Administración y personal"
    description: "Portales de administración, personal del servicio y recordatorios amplían el recorrido del producto."
  - title: "Concierge por WhatsApp"
    description: "Conversaciones con catálogo autorizado de precios: cuando falta contexto o autoridad, el camino es la intervención de un operador."
  - title: "Dureza operativa"
    description: "Prevención de duplicados, concurrencia y continuidad de conversaciones a medida que el asistente asumía más interacciones."
---

El historial disponible de MaltaCleaners comienza en mayo de 2026 con una web de reservas y persistencia de datos. Mi trabajo amplió ese recorrido hacia administración, portales de personal, recordatorios y comunicación por WhatsApp. Al crecer el producto, el reto pasó a ser coordinar lo que dice un asistente con lo que realmente sabe y permite la operación.

## Contexto y contribución

Una reserva involucra fechas, precios, personas y cambios posteriores. El producto conecta una web pública Astro e interfaces React con APIs y almacenamiento persistente en Cloudflare. Las reservas, la coordinación del personal y la comunicación con clientes necesitan describir la misma realidad operativa.

Mi contribución combina conocimiento del servicio, decisiones de producto y controles técnicos. Mientras el Concierge asumía más interacciones, trabajé en prevención de duplicados, concurrencia y continuidad de las conversaciones. Una respuesta útil también debe corresponder a la solicitud correcta y reflejar su estado vigente.

## Una solicitud necesita contexto y autoridad

Un recorrido representativo empieza cuando un cliente pregunta por una reserva. El sistema necesita el contexto de la conversación y el catálogo autorizado de precios antes de decidir una respuesta o acción. Cuando no puede establecer el significado o la autoridad de una solicitud, el camino es la intervención de un operador, no inventar una respuesta.

El flujo previsto es: **solicitud de reserva → conversación y catálogo → decisión → acción autorizada o intervención humana**. Entender una conversación y tener permiso para actuar sobre ella son responsabilidades diferentes. Esa distinción orientó las correcciones siguientes.

## Cuando una persona toma el control

Rechazar una propuesta del bot no establecía siempre el mismo estado de toma de control que responder manualmente. Un caso documentado mostró al asistente continuando después del rechazo. Añadí una ventana de control humano y la comprobación correspondiente en el supervisor.

Una conversación pausada y la evidencia de una respuesta humana aceptada siguen siendo hechos distintos. Conservar ambos evita tratar una pausa como prueba de que alguien ya respondió, o interpretar un rechazo como permiso para que el asistente continúe.

## Un precio es más que una cifra

El mismo importe puede representar una tarifa por hora, un total de visita o un saldo pendiente. Las pruebas de reproducción mostraron cómo corregir una cantidad sin conservar su significado podía producir la respuesta equivocada.

Trabajé en mantener unidades e intención, fundamentar los precios en el catálogo autorizado y derivar situaciones inciertas al operador. Revisar un pago no autoriza automáticamente una nueva cotización. Es una restricción del dominio que debe sobrevivir tanto a la interpretación del modelo como al procesamiento posterior de la respuesta.

## Los resultados pueden llegar tarde

Una conversación puede avanzar, cambiar de alcance o pasar a una persona mientras una clasificación está en curso. Reforcé los controles de resultados tardíos: los efectos y las escrituras de estado deben comprobarse de nuevo cuando regresa el resultado, no solo cuando comienza la petición.

El sistema conserva un contexto amplio de conversación, pero limita qué solicitud puede afectar una acción concreta. Sin esa segunda comprobación, una interpretación razonable de un mensaje antiguo puede convertirse en una acción incorrecta para la conversación actual.

## Evaluar mensajes y efectos

Incorporé un entorno local que compara el comportamiento del baseline y el candidato con almacenamiento aislado. Las pruebas observan mensajes, acciones, cambios de estado y casos en los que no se debe enviar nada. La evaluación no se limita a comprobar si una respuesta generada suena plausible.

Un runner posterior permite realizar llamadas reales al modelo a través del Gateway, con presupuesto acotado de llamadas, registro de uso y etiquetas A/B. Ambos caminos importan: los escenarios deterministas ejercitan controles específicos; las comparaciones con modelos reales permiten investigar comportamientos que esos escenarios no acreditan por sí solos.

## Evidencia y límites

El caso se apoya en historial Git disponible, diffs seleccionados, código de evaluación y registros de verificación local revisados en septiembre de 2026. Esa revisión no ejecutó el runner de modelos reales, confirmó la promoción del candidato ni estableció una mejora de calidad del modelo en producción. Construir la evaluación y medir una mejora son hitos distintos.

La web pública está disponible en [malta-cleaners.com](https://malta-cleaners.com). Su disponibilidad no acredita qué capacidades privadas del Concierge están activadas actualmente. Aquí no se reproduce el corpus de conversaciones de clientes, sus identificadores ni capturas internas.

MaltaCleaners muestra la evolución de una web de reservas hacia software operativo con IA aplicada: mantener cada acción vinculada al precio, la conversación y la responsabilidad humana correspondientes.
