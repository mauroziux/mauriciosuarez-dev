---
title: "El bot no alcanza: por qué construimos un MCP"
description: "Por qué construimos un MCP para operadores y administradores de MaltaClean, y qué nos enseñaron los permisos, OAuth y las acciones con consecuencias reales."
lang: "es"
routeSlug: "mcp-operadores-admin"
tags: ["integracion-ia", "arquitectura", "operaciones", "seguridad"]
publishedDate: 2026-10-07
draft: false
ogImage: "/articles/mcp-operadores-admin/hero-mcp-es.png"
---

La IA te redacta una respuesta impecable. Tú sigues saltando entre pantallas para saber si puedes enviarla.

Imagina que un cliente pide mover su limpieza. Antes de contestar hay que encontrar la reserva correcta, leer qué se acordó, comprobar su estado y averiguar si otra persona ya está trabajando el caso. El modelo puede ayudarte con el texto. Pero, si tú tienes que llevarle todos esos datos a mano, también eres su integración.

Copias el historial. Explicas las reglas. Corriges una suposición. Vuelves al portal. Compruebas que nada cambió.

**Tenemos modelos capaces de razonar sobre una operación y humanos haciendo de cable entre el modelo y el negocio.**

En [MaltaClean](/es/proyectos/maltacleaners/) decidimos construir ese cable: un servidor MCP para que operadores y administradores puedan consultar la operación desde Claude o ChatGPT y, con una delegación explícita, acceder a acciones concretas.

La parte interesante no fue conseguir que la IA viera una herramienta. Fue decidir qué podía hacer con ella.

## No necesitábamos otro chat

MaltaClean ya tenía un concierge de WhatsApp, reservas, precios y portales de operación. No queríamos construir una segunda aplicación de chat ni duplicar las reglas del negocio dentro de otro agente.

Queríamos resolver preguntas del equipo:

> ¿Qué requiere atención? ¿Qué se habló con este cliente? ¿Qué precio aplica? ¿Cómo preparo la respuesta o el cambio sin saltarme el proceso existente?

Son ejemplos del recorrido que diseñamos, no mensajes extraídos de clientes.

**MCP —Model Context Protocol— estandariza cómo un cliente de IA descubre e invoca herramientas de otro sistema.** En nuestro caso, es la interfaz entre Claude o ChatGPT y funciones delimitadas de MaltaClean. No es el modelo, no sustituye la base de datos y no concede permisos por sí solo.

Podíamos haber desarrollado una integración específica para cada cliente. Elegimos MCP porque queríamos mantener los contratos de negocio en el backend y exponerlos mediante una interfaz común. Cambiar de cliente no debía obligarnos a reescribir cómo se consulta una conversación o se valida una reserva.

La decisión fue deliberadamente pequeña: Pages Functions junto al backend existente, sin otro runtime de chat. **Otra puerta al negocio; no otro negocio detrás de la puerta.**

![El equipo consulta desde Claude o ChatGPT; MCP comprueba autoridad vigente antes de acceder a los datos y operaciones del backend existente.](/articles/mcp-operadores-admin/arquitectura-mcp-es.svg)

*El cliente de IA cambia la forma de pedir ayuda. No reemplaza los permisos ni las reglas del negocio. Esquema de arquitectura, no una medición de productividad.*

## Empezamos por leer, no por dar órdenes

La primera versión publicada tenía tres herramientas:

- **`list_attention`**: consultar trabajo pendiente, con prioridad y cobertura declaradas.
- **`get_conversation_context`**: leer mensajes y contexto operativo permitido de una conversación.
- **`get_prices`**: consultar el catálogo y los cálculos de precios desde sus fuentes.

Eso permite diseñar un recorrido más útil que pegar un bloque de texto en un chat: preguntar qué necesita atención, abrir un caso y discutir una respuesta con el contexto correspondiente.

Pero leer tiene sus propias consecuencias. Abrir una conversación no debía marcarla como atendida, tomarla a nombre del operador ni sobrescribir un borrador. Un asistente que consulta ya puede estorbar si esa consulta provoca efectos ocultos.

Tampoco quisimos una herramienta de «ejecutar cualquier SQL». El catálogo debía expresar tareas, no conceder acceso genérico a la infraestructura. Consultar precios no autoriza a cambiarlos; consultar una reserva no autoriza a modificar pagos o nómina.

Los operadores conservan acceso de lectura según sus capacidades. Las escrituras por MCP se reservan a administradores con los permisos y la delegación correspondientes. Eso no cambia los permisos de envío que esas personas ya tienen en el portal.

## Lo que esperamos ganar no es una respuesta más bonita

El beneficio que buscamos es reducir el trabajo de reconstruir el caso antes de poder decidir.

**Menos contexto transportado a mano.** La conversación llega desde las fuentes operativas, con referencias y límites, en lugar de depender de lo que alguien alcanzó a copiar.

**Una entrada más natural a la cola de trabajo.** El equipo puede formular una pregunta y pedir detalle sobre un caso. La prioridad sigue teniendo que justificarse: una solicitud antigua sin responder importa, aunque no parezca una venta nueva.

**Una sola autoridad para las reglas.** Una operación preparada desde MCP pasa por los mismos caminos canónicos que conocen precios, estado, deduplicación y efectos secundarios. No queríamos una reserva creada por IA que olvidara una regla que el portal sí aplica.

**Delegación más acotada.** Podemos separar lectura, envío, creación y actualización, y volver a comprobar la autoridad antes de actuar.

No tengo una cifra defendible de horas ahorradas ni de ventas recuperadas por este MCP. Esos son beneficios de diseño que todavía hay que medir en el trabajo real. Que una integración funcione no demuestra que el equipo atienda mejor.

Y ahí empiezan los retos que una demo suele dejar fuera.

## «Está publicado» no significa «lo puedes usar»

Al añadir escrituras, el servidor pasó a anunciar seis permisos: tres de lectura y tres nuevos para enviar mensajes, crear reservas y actualizarlas.

Parecía razonable esperar que las herramientas aparecieran inmediatamente en todos los clientes. No era así de simple.

Durante la verificación encontramos una conexión de Claude con los seis permisos concedidos, mientras el catálogo que veíamos en el cliente seguía mostrando sólo tres herramientas. La conexión de ChatGPT, por su parte, había solicitado y recibido sólo lectura.

En las pruebas aisladas del SDK, una delegación de administrador con los seis permisos listaba nueve herramientas: tres de lectura, tres para respuestas y tres para operaciones de reservas. Eso no probaba que cada sesión real estuviera usando esa delegación o hubiera actualizado su catálogo.

Tuvimos que separar cuatro preguntas:

1. ¿El servidor soporta el permiso?
2. ¿Esa conexión lo solicitó y lo recibió?
3. ¿La sesión y el cliente están usando la delegación y mostrando las herramientas correspondientes?
4. ¿La acción se ejecutó con el resultado esperado?

**Un «sí» en la primera no contesta las otras tres.**

La salida fácil habría sido añadir escrituras a las conexiones antiguas. Habría sido también incorrecta: si alguien autorizó lectura, una actualización del servidor no puede convertir ese consentimiento en permiso para enviar o modificar reservas.

Por eso los permisos efectivos son la intersección entre lo que lleva el token, lo que conserva la conexión y lo que la cuenta puede hacer ahora. Una herramienta visible tampoco es una credencial permanente: antes de sus efectos se vuelve a comprobar la identidad y la autorización.

## OAuth fue también un problema de experiencia de usuario

El login funcionaba. El regreso desde el login, no siempre.

Una navegación desde Claude o ChatGPT puede llegar sin la cookie de sesión porque viene de otro sitio. Con una cookie `SameSite=Strict`, eso puede ocurrir aunque el administrador ya haya iniciado sesión en el portal. En el recorrido que reprodujimos, había que entrar al portal y volver atrás para continuar la autorización.

No se arregla bien quitando protecciones a la cookie ni pasando la sesión a JavaScript. Corregimos el retorno al flujo de consentimiento, conservando la petición OAuth original y validando que el destino fuera una ruta interna permitida. Autorizar o denegar siguió siendo una decisión explícita.

También hubo que validar discovery, PKCE y los documentos con los que los clientes identifican sus callbacks. «El SDK soporta OAuth» era el punto de partida, no una prueba de que nuestro recorrido completo funcionara.

La lección: **la seguridad que rompe la continuidad del usuario termina pareciendo un fallo de permisos**. Había que corregir la continuidad sin debilitar la seguridad.

## Dar contexto no es subir toda la empresa al modelo

Podíamos enviar el historial entero de cada contacto. También podíamos mandar sólo un resumen. Ninguno de los extremos resolvía bien el problema.

El historial completo añade coste, latencia y exposición de datos. Un resumen puede perder un acuerdo importante o quedarse atrás respecto a los últimos mensajes.

Elegimos un resumen anclado y corregible sobre el contexto anterior, una ventana reciente de 30 mensajes individuales y acceso paginado a los originales cuando hace falta comprobar algo. Además, la lectura reúne evidencia por teléfono a través de distintos hilos del proveedor; el último hilo no siempre contiene la historia completa.

Los límites deben ser visibles. Si una consulta devuelve un conjunto acotado de reservas y no hay coincidencias, eso no demuestra que el cliente nunca haya reservado. Un resumen tampoco acredita un pago ni puede convertirse en la fuente de un precio.

Y los mensajes del cliente son datos, no instrucciones para el asistente. Una frase dentro del historial no puede otorgar permisos ni cambiar el destinatario autorizado de una operación.

MCP no elimina las preguntas de privacidad. Los datos consultados llegan al proveedor del cliente de IA. Hay que revisar la cuenta, sus condiciones y qué información necesita realmente el caso. No devolvemos secretos, enlaces privados de medios ni información financiera ajena a esa tarea.

## La acción correcta también puede llegar tarde

Ahora imagina que el administrador prepara una respuesta. Antes de enviarla, entra un mensaje nuevo o un compañero toma el caso.

El texto puede seguir sonando bien y estar respondiendo a una situación que ya no existe.

Por eso separamos **preparar, ejecutar y consultar el resultado**. Preparar congela una operación con su contenido y sus referencias. Ejecutar recibe esa referencia, no un teléfono o un texto de reemplazo. Antes del efecto se comprueban permisos, propiedad y revisiones aplicables; si algo cambió, la operación puede rechazarse.

Para las reservas ocurre algo parecido: una propuesta preparada no es una reserva creada. La ejecución vuelve a pasar por los validadores y escritores canónicos. La IA no obtiene un atajo para inventar duración, personal o precios.

El caso más incómodo es el resultado incierto. Si el proveedor pudo aceptar un envío pero se perdió la respuesta, «intentarlo otra vez» puede duplicar el mensaje. El sistema debe conservar el estado y exigir reconciliación, no premiar al modelo por insistir.

**Aceptado no es entregado. Entregado no prueba una respuesta útil. Y autorizar una conexión no prueba que una persona haya revisado cada texto.**

Esas distinciones son menos vistosas que una demo de «haz la reserva». También son las que permiten confiar en ella.

![Cuatro etapas: preparar una operación congelada, validar permisos y contexto, ejecutar por el camino canónico y comprobar el resultado. Ante incertidumbre se reconcilia, no se reenvía.](/articles/mcp-operadores-admin/operacion-segura-es.svg)

*Una operación preparada no es una operación ejecutada. El estado del proveedor no sustituye la evidencia de entrega, y un resultado incierto no autoriza un nuevo intento.*

## Lo publicado y lo que todavía no doy por demostrado

Al cierre de esta experiencia, el backend con lecturas y escrituras delegadas estaba desplegado. Verificamos los seis permisos en el discovery de producción y las delegaciones persistidas de las conexiones. Las pruebas aisladas comprobaron el catálogo de nueve herramientas bajo una concesión completa.

Eso no cerraba toda la aceptación en Claude y ChatGPT: quedaban por comprobar el catálogo autenticado real y el recorrido operativo completo. No creamos reservas ni enviamos mensajes a clientes para fabricar una comprobación en verde.

El envío directo de texto seguía restringido a un contacto de prueba autorizado. Las operaciones de reservas tienen sus propios efectos canónicos —incluidas notificaciones— y no heredan automáticamente esa restricción. No son un ensayo inocuo por el hecho de invocarlas desde un chat.

La siguiente medida útil no es cuántas herramientas conseguimos listar. Es si el equipo puede trabajar un caso real con menos reconstrucción manual, sin duplicar acciones y con evidencia suficiente para saber qué ocurrió.

## El valor de MCP está en lo que no deja saltar

Ya había contado [por qué una excepción correctamente detectada puede quedarse sin atender](/es/articulos/modelo-acerto-cliente-perdido/) y [por qué el modelo interpreta, pero el código autoriza](/es/articulos/modelo-entiende-codigo-decide-permiso/).

Este proyecto une las dos cosas: acercar el trabajo pendiente al humano y darle herramientas útiles, sin convertir una conversación con IA en una puerta trasera al negocio.

Si el equipo sigue copiando contexto entre pantallas, quizá el siguiente paso no sea otro modelo. Pero, si el sistema todavía no tiene operaciones bien delimitadas, ponerle MCP delante tampoco las va a crear: sólo hará más fácil invocar el desorden.

**No construimos MCP para que la IA pareciera más inteligente. Lo construimos para conectar su ayuda con trabajo real, sin desconectar ese trabajo de sus reglas.**

*Estado y verificaciones descritos al 7 de octubre de 2026. Los beneficios de productividad no están cuantificados; el despliegue y las pruebas aisladas no sustituyen la aceptación autenticada ni la evidencia de entrega.*
