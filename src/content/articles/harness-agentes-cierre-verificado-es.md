---
title: "El agente dice «listo». El harness pide pruebas."
description: "Crónica de pi-harness: de un agente que se creía terminado a un sistema que exige evidencia, con pstack, harness² y memoria de equipo sobre Durable Objects."
lang: "es"
routeSlug: "harness-agentes-cierre-verificado"
tags: ["integracion-ia", "evaluacion", "arquitectura", "automatizacion"]
publishedDate: 2026-10-23
draft: false
socialImage: "/articles/harness-agentes-cierre-verificado/og-es.png"
---

El primer benchmark congelado fue una bofetada.

Veinte ejecuciones, diez casos congelados, dos brazos. Pi limpio cerró los diez. El harness cerró uno dentro del plazo de seis minutos.

Abrí los logs esperando encontrar un agente atascado en un bucle. Encontré otra cosa: en nueve de los diez casos, el código del harness era correcto. El trabajo estaba hecho. Lo que no terminaba era el proceso.

El harness no estaba fallando en resolver. Estaba fallando en cerrar.

Esa distinción se convirtió en el centro del proyecto.

<img src="/articles/harness-agentes-cierre-verificado/pipeline-es.svg" alt="El recorrido: ticket, plan, task, verificación, PR en borrador y aprobación humana." width="900" height="700" loading="lazy" decoding="async" />

*De ticket a PR: cada paso deja evidencia y el último lo aprueba una persona.*

## Qué es pi-harness

pi-harness empezó el 13 de agosto de 2026 como una capa alrededor de [Pi](https://github.com/badlogic/pi-mono), el agente de terminal de badlogic. No es un modelo. No es una colección de prompts. Es el programa que decide qué modelo responde, qué herramientas puede usar el agente, cómo se planifica una tarea, qué evidencia se exige antes de aceptarla y cuándo una entrega puede salir del entorno local.

El objetivo es una cadena completa: **ticket → investigación → plan → implementación → verificación → PR en borrador → aprobación humana**.

La pregunta que organiza todo no es «¿puede el agente escribir el código?». Es «¿qué tiene que pasar para que aceptemos que terminó?».

Un agente puede escribir una función correcta y equivocarse al declararla terminada. Puede pasar los tests y no haber mirado la pantalla. Puede decir «listo» después de tres intentos idénticos, sin evidencia nueva. Puede cerrar una tarea que nunca ejecutó porque el proveedor no respondió. El problema no es la capacidad de generar código; es la distancia entre generar algo plausible y demostrar que cumple lo pedido.

pi-harness trabaja en cinco capas:

- **Routing.** El modelo virtual `router/auto` manda texto ordinario a GLM y visión a OpenAI. La escalada a modelos caros tiene presupuesto y se registra. El routing no decide el workflow: elegir OpenAI no activa investigadores ni planes paralelos.
- **Planificación.** `/plan` es un modo de diseño: investiga el repo, hace preguntas, compara alternativas y guarda un documento con criterios observables. No implementa. Los planes de tareas medianas o grandes pasan por jueces con contexto fresco antes de convertirse en una tarea.
- **Ejecución.** `/task` implementa con playbooks. Un bug exige una reproducción fallida nombrada antes de tocar el código. Los guards bloquean comandos destructivos y ediciones que dejarían JSON o JavaScript roto. La entrega se hace en slices verificables y un PR en borrador con evidencia sellada.
- **Verificación y cierre.** `review_artifact` ejecuta checks nativos, contrasta cada criterio y devuelve PASS, FAIL, INCONCLUSIVE o STALE. Sin un PASS fresco ligado al workspace, la tarea no está completa.
- **Memoria de equipo.** `memory_save`, `memory_search` y `memory_sync` comparten aprendizajes por repo en un Durable Object; la sesión de hoy no empieza de cero.

Hay cinco invariantes que no se negocian:

1. Un PASS solo existe con evidencia ejecutada. INCONCLUSIVE, STALE y NOT_RUN nunca son éxito.
2. El autor no juzga su propio trabajo. Los jueces reciben contexto nuevo y citas literales.
3. Los criterios no se debilitan para cerrar. Si el alcance humano no se cumplió, se restaura.
4. Publicar, desplegar o destruir requiere autorización humana separada. El PR es la frontera.
5. Un efecto incierto se reconcilia por bytes o por readback autoritativo; no se repite a ciegas.

<img src="/articles/harness-agentes-cierre-verificado/cinco-capas-es.svg" alt="Las cinco capas de pi-harness: routing, planificación, ejecución, verificación y memoria." width="900" height="600" loading="lazy" decoding="async" />

*Cinco capas, un solo contrato: el trabajo no está terminado hasta que la evidencia lo demuestra.*

Al escribir esto, el repo tiene 157 commits en `main` entre el 13 de agosto y el 20 de octubre. No son una lista de features: son cuatro actos, y cada uno corrigió una suposición del anterior. Los commits son el registro de auditoría de esas suposiciones. Casi todos los errores dejaron un test, un guard o una nota de evaluación.

**1. Agosto: el runtime que no sabía parar.** El primer harness era portable, con supervisor, observabilidad y ejecución persistente de tareas. Aprendimos que la autonomía sin observabilidad es una caja negra: callbacks tardíos, abortos falsos, subagentes que se quedaban mudos. La primera lección no fue «añade más agentes»; fue «haz visible lo que ya pasa».

**2. Octubre temprano: el flujo.** Llegaron el routing por tiers, `/plan` como modo de diseño, la planificación proporcional con jueces y Adaptive V1. Aprendimos a separar tres decisiones que estábamos mezclando: qué modelo responde, cuánto investigar y qué protocolo aplicar. También aprendimos que el autor no puede ser el juez.

**3. Octubre medio: la evidencia.** Llegaron `review_artifact`, los playbooks de bug y feature, la verificación por proyecto, la recuperación, los guards y la capa de entrega git. El primer ciclo real de ticket → PR → aprobación humana se cerró. Aprendimos que un PASS de código no acredita completado y que el PR es la frontera.

**4. Octubre final: el cierre.** Llegaron la línea base congelada, la verificación proporcional, los fixes de exit, el cierre automático, la dieta de contexto, la inversión de la barrera y la memoria de equipo. Aprendimos que el problema no era la inteligencia del modelo sino la definición de «terminado». Y que un benchmark puede medir el harness equivocado.

Lo que no sobrevivió también cuenta: el runtime viejo, el segundo gestor de TODOs y la barrera de efectos desaparecieron. Un harness maduro no es el que acumula capas; es el que puede quitar las que no pagan.

<img src="/articles/harness-agentes-cierre-verificado/cuatro-actos-es.svg" alt="Cuatro actos del proyecto: agosto, octubre temprano, octubre medio y octubre final, con la lección de cada uno." width="900" height="560" loading="lazy" decoding="async" />

*Cuatro actos, cuatro suposiciones corregidas. Lo que no sobrevivió también cuenta.*

## De dónde viene el enfoque

Ninguna de estas decisiones salió de la nada. El pipeline se leyó, se discutió y se adaptó. Tres fuentes fueron las más útiles.

**pstack** ([repo](https://github.com/cursor/plugins/tree/main/pstack)) es el plugin de skills de Lauren Tan (@poteto) en `cursor/plugins`. Nos interesó una idea que suena simple y es difícil de sostener: el contrato de una tarea es «done means X», y X no se negocia a las dos de la mañana. También sus playbooks de bug y feature, la verificación como infraestructura (`/create-verification-skill`) y la idea de codificar lecciones en estructura, no en esperanza. Lo que no importamos: su catálogo de ~51 skills como capa global. Una crítica externa lo dijo sin rodeos: muchas son texto que espera que el modelo se acuerde; solo una minoría es ejecutable. Tomamos las herramientas, no el manager. Tampoco importamos arena/swarm obligatorios, modelos por rol ni publicación automática.

De ahí salieron cosas concretas: el playbook de bug exige una reproducción fallida antes de corregir; el de feature comprueba el comportamiento existente antes de implementar; el manifiesto `.pi/verification/manifest.json` convierte la verificación de un proyecto en un procedimiento versionado; y «Done means X» está en la plantilla de prompts. La verificación no es una opinión que el agente escribe al final: es un comando que se ejecuta.

La idea de que el harness —no solo el modelo— es el objeto de mejora ya estaba en *[Harness Learning](/es/articulos/harness-learning-mejorar-agentes-ia/)*; harness² la lleva a la recursión.

**harness²** es el meta-harness de Google Research ([repo](https://github.com/google-research/harness2), [arXiv:2610.14224](https://arxiv.org/abs/2610.14224)). La pregunta es distinta: ¿puede un sistema mejorar el harness de un agente sin tocar los pesos del modelo? Su respuesta es una recursión contrastiva: proponer un cambio, probarlo con ejecuciones reales y componer solo lo que sobrevive. Nos quedamos con cuatro mecanismos: **None-never-zero** (si un juez falla, la tarea no es un cero, es `unscored` y sale del denominador); una **librería de lecciones tipada** con cuatro campos —cue, lesson, evidence, confidence—; **retención causal** (solo lecciones anteriores a la tarea actual); y **tripwires anti-leak** (la rúbrica del evaluador no puede entrar al contexto ni a la memoria). No adoptamos la recursión completa: harness² hace ~4.000 ejecuciones por tarea; nosotros no tenemos ese presupuesto y no vamos a fingir que lo tenemos. El plan de auto-mejora usa la versión ligera: corpus de outcomes, librería de lecciones y adopción contrastada con evals.

La tercera fuente es **gentle-shell/gentle-pi** ([repo](https://github.com/Gentleman-Programming/gentle-shell)): el protocolo ODD, el tamaño proporcional de la tarea, la revisión según riesgo y la delegación por razón, no por tamaño. También el invariante ACI de [**SWE-agent**](https://github.com/SWE-agent/SWE-agent) —una edición inválida no debe aterrizar— y la dirección que comparten Claude Code, Cursor y Devin: nada es un efecto rastreado por defecto; la seguridad está en guards y verificación post-hoc, no en una lista de verbos. El pipeline al que todos convergen es parecido: ticket → spec aprobada → worktree limpio → TDD rojo-verde con linter → verificación binaria → revisor independiente → PR pequeño con evidencia → aprobación humana. pi-harness es una implementación de ese pipeline con una obsesión: el cierre.

Lo que no hicimos: importar pstack como dependencia, instalar sus 51 skills, copiar su arena o convertir harness² en un loop de auto-modificación sin presupuesto. Las fuentes se fijaron a commit en los planes; las ideas se adaptaron, no se pegaron. Esa distinción es la misma que aplicamos al resto del harness: una idea no entra porque suena bien; entra si podemos medirla.

## El flujo que queremos

Para una tarea mediana o grande, el recorrido es este:

```text
/plan <idea>
  → investigación proporcional
  → preguntas de producto y decisiones humanas
  → jueces con contexto fresco del diseño
  → docs/plans/plan-<uuid>.md listo, con criterios observables
  → se detiene

/task <plan u objetivo>
  → implementación por dependencias
  → checks nativos
  → review_artifact (jueces con contexto fresco; píxeles si hay UI)
  → corrección de hallazgos y nueva comprobación
  → commit_work_unit + open_pr draft
  → el humano revisa y aprueba
```

Para tareas pequeñas se salta `/plan`: `/task` directo. Un diff de hasta 40 líneas en dos archivos, sin señales de riesgo y sin criterios de UI, se verifica con checks y sin jueces. Es la ruta proporcional. La complejidad se paga cuando aporta.

En la práctica hay tres barreras humanas como máximo y una en el uso normal: la aprobación del PR. El resto es autonomía con evidencia.

## Las decisiones que no fueron obvias

### El perfil estricto quedó como opt-in

La primera versión tenía contratos, hashes de aprobación, presupuestos y barreras de Task. Era coherente sobre el papel y agotador en la práctica: el agente pedía permiso para trabajo reversible, el humano aprobaba por costumbre y la verificación se convertía en burocracia.

Decidimos invertir el valor por defecto. El perfil normal usa Task libre, Goal opcional y una lista de progreso que no es una barrera técnica. El protocolo estricto V1 sigue existiendo para perfiles aislados que lo necesitan, pero no es el camino por defecto. La autonomía no se consigue añadiendo aprobaciones; se consigue definiendo qué es un cierre válido.

### Routing, profundidad y paralelismo son tres decisiones distintas

Es fácil mezclarlas. No son lo mismo.

- **Routing.** Qué modelo responde según texto, visión y presupuesto. Lo decide `router/auto`.
- **Profundidad.** Cuánto investigar, si hay varios candidatos y cuántos jueces. Lo deciden las señales del coordinador y `plan_workflow`.
- **Protocolo.** Esfuerzo, barreras y recuperación del modo estricto. Lo decide Adaptive V1, opt-in.

Elegir un modelo caro no debería disparar un plan profundo. Y un plan profundo no debería justificar quemar la ventana de OpenAI. Separar las tres decisiones evita que una tarea trivial pague la ceremonia de una tarea de alto riesgo.

### Los jueces no heredan el contexto del autor

Un juez con el mismo contexto del autor hereda sus supuestos. Por eso los revisores reciben el documento o el artefacto exacto, los requisitos y las fuentes, pero no la conversación que produjo la decisión. Contexto fresco significa nuevo, no otro modelo por definición. Para lo comprobable, primero tests, estado y artefactos. Para lo subjetivo, una rúbrica explícita y, cuando se puede, otra familia de modelos.

Hay dos revisiones distintas: la del plan y la del artefacto. En la planificación profunda, dos o tres autores independientes producen candidatos; cada candidato pasa por dos jueces con contexto fresco. Solo es elegible si todos dan PASS, sin huecos ni P0/P1. La selección es conservadora: mayor puntuación mínima, desempate estable por ID y, si no hay candidato elegible, INCONCLUSIVE. No hay fusión automática. En la ejecución, el revisor del artefacto recibe el plan final, el diff exacto y la evidencia; no edita el código que juzga.

### La verificación es proporcional al riesgo

Un backend puro no necesita navegador. Una pantalla sí necesita test, runtime real y píxeles inspeccionados. Un formulario que muestra «20.00 €» en el DOM pero con `opacity:0` no está verificado por un test verde: el test puede pasar y el usuario seguir sin ver el precio. Esa fue una de las pruebas del laboratorio de verificación por resultados, y explica por qué la UI no se puede certificar solo con asserts.

La regla es simple: cada criterio observable se conecta con un check nativo. Si falta evidencia, el resultado es INCONCLUSIVE, no PASS. Si el código cambia durante la revisión, el recibo queda STALE. Un PASS de código no acredita completado.

### La seguridad no es una lista de verbos

Al principio intentamos clasificar cada herramienta como segura o peligrosa. Más de treinta herramientas en una lista de denegación, reconciliación por efecto, clasificación de navegador. El resultado fue una barrera que bloqueaba investigaciones legítimas y no distinguía un selector de fecha de un botón que cambia el presupuesto de una campaña.

Hoy la seguridad está en otro sitio: un guard que bloquea comandos destructivos antes de ejecutarlos, un guard que impide que una edición deje el archivo roto, superficies de escritura disjuntas para escritores concurrentes, y verificación post-hoc del resultado. La barrera de recuperación quedó vacía por defecto. Lo que sí tiene reconciliación propia es la entrega git —un push, un PR—; las lecturas interrumpidas y los puntos de control viejos se auto-reconcilian al cargar la sesión.

## Medir el harness, no las sensaciones

Durante meses el harness se mejoró con pilotos pequeños. Funcionaban para detectar fricciones, pero no para responder una pregunta más dura: ¿el harness mejora el resultado o solo lo hace más caro?

El 18 de octubre congelamos una línea base. Diez casos sintéticos con un oráculo externo que el agente nunca ve. Cada caso tiene una versión que falla y una referencia que pasa; la verificación previa demuestra que el oráculo discrimina antes de gastar un céntimo. Las reglas de puntuación se acordaron antes de correr:

- **PASS-to-PASS.** Cada caso debe conservar al menos un test que ya pasaba en el estado roto. Así se detecta si el agente arregla una cosa rompiendo otra.
- **Canario único.** Cada caso lleva un identificador que no se publica. Sirve para detectar contaminación del corpus.
- **Agente nulo.** Un actor que no hace nada debe sacar cero PASS y cero falsos cierres. Es el suelo del benchmark.
- **Falso cierre = regresión automática.** Si el agente declara éxito y el oráculo falla, no es un test rojo más: es la métrica que el harness existe para evitar.
- **None-never-zero.** Si el juez falla, la tarea no es un cero: queda `unscored` y sale del denominador. La regla viene de harness².
- **Sin relanzamientos.** Una ejecución que falla se conserva. No se repite hasta que salga verde.

La línea base corre con aprobación explícita del operador porque cuesta dinero. Los casos son diminutos a propósito: si el harness no puede con ellos, no hay nada que discutir sobre tareas grandes.

### Las tres primeras cohortes

Mismos diez casos, veinte ejecuciones por cohorte, plazo de 360 segundos.

| Cohorte | Bare | Plazo | Oráculo | Tokens |
|---|---:|---:|---:|---:|
| 1. Línea base | 10/10 | 1/10 | 9/10 | ~847k |
| 2. Proporcional | 9/10 | 1/10 | 9/10 | 458k |
| 3. Fix MCP | 9/10* | 2/10 | 9/10 | ~521k |

*\*El bare produjo un falso cierre en esta cohorte.*

<img src="/articles/harness-agentes-cierre-verificado/benchmark-cohortes-es.svg" alt="Tres cohortes: bare, harness en plazo y harness por oráculo. El harness iguala el oráculo, pero pierde en plazo; el bare produce un falso cierre en la tercera cohorte." width="900" height="520" loading="lazy" decoding="async" />

*La misma tabla, en una imagen: el harness no era más correcto en micro-tareas; era más honesto al cerrar.*

La tabla cuenta dos historias a la vez.

La primera es incómoda: en micro-tareas, el harness no era más correcto que Pi limpio. Era más caro y más lento. La segunda es la que importa: el bare produjo su primer falso cierre en la tercera cohorte. El harness, en estas cohortes, no produjo ninguno.

No es que el harness fuera más listo. Es que no podía declarar terminado lo que no estaba verificado. La diferencia no era acierto; era honestidad de cierre.

La cohorte 1 también dejó el diagnóstico que cambiaría el proyecto: en la mayoría de los tiempos de espera agotados el trabajo ya estaba hecho, y en varios el JSON final ya existía en la sesión. El proceso simplemente no salía. El cuello de botella no era el agente ni la verificación. Era el cierre.

## La factura: 6x, 18x, 34x

Un harness que verifica cuesta más que uno que no verifica. La pregunta es cuánto, y si ese coste compra algo.

El piloto del 17 de octubre comparó tres casos de MaltaCleaners en dos brazos. Ambos resolvieron 3/3. La primera lectura decía que el harness costaba seis veces más tokens. Al revisar el runner, encontramos la causa: las habilidades personales del usuario se colaban solo en el brazo del harness. Con aislamiento paritario, el sobrecoste real era de alrededor del 5% en tokens.

Ese error es la lección más barata del proyecto: **mide el brazo que crees que estás midiendo**.

El 18 de octubre repetimos con el harness completo. El piloto anterior había usado una lista blanca exclusiva de herramientas que ocultaba las herramientas de las extensiones, y el instalador no copiaba `lib/` ni `vendor/` al directorio del agente. Es decir, durante un tiempo medimos el harness sin el harness. Al instalar todo y usar la carga de herramientas por defecto:

| Medición | Bare | Harness | Cierres |
|---|---:|---:|---:|
| 18 oct, 3 casos Malta | 3/3 · 51.941 | 3/3 · 954.622 | 0/3 |
| 19 oct, tras fixes | 3/3 · 47.313 | 3/3 · 531.014 | 2/3 |
| 19 oct, con cierre automático | 3/3 · 53.701 | 3/3 · 524.979 | 3/3 |

Las cifras de tokens usan separador de miles. El 18 de octubre el harness costó 18x; el 19, 11x. Ese día bajó 44% los tokens y completó dos de tres casos. Con el cierre automático completó los tres. Las correcciones de recuperación y auto-reparación, y la eliminación del proceso colgado, hicieron más que cualquier optimización de prompt.

Después llegó la prueba de fuego: dos casos medianos, `booking-quote` y `cache-key`, con defectos repartidos en varios archivos. Ambos brazos pasaron 2/2, cero falsos cierres. El harness gastó 1.272.812 tokens frente a 36.847 del bare: **34x**. La tesis de que el sobrecoste se diluye con el tamaño de la tarea no se confirmó. La verificación escala con el trabajo, así que el coste fijo no desaparece; se reparte.

También corrimos seis casos con oráculo externo; el brazo limpio usaba un modelo barato fijo. Bare y harness resolvieron 5/6. La diferencia fue un falso cierre del bare y ninguno del harness, a cambio de 4–5x coste y unas 3x latencia en micro-tareas.

La conclusión honesta es incómoda para un artículo de productividad: **el harness no es una optimización de tokens**. Es una capa de garantía. Lo que compra es un PASS verificado, un INCONCLUSIVE honesto en vez de un falso cierre, escalada con presupuesto, recibos de entrega y memoria compartida. En tareas donde equivocarse es barato, esa capa no se paga. En tareas donde un cierre falso cuesta dinero, tiempo o confianza, sí.

## Lo que hicimos bien

No todo fue corregir errores. Estas son las decisiones que, vistas con los números, sí pagaron.

- **Convertir el cierre en un contrato ejecutable.** `review_artifact` y el closure no aceptan una frase del modelo: exigen un PASS fresco ligado al workspace. En las tres cohortes, el harness no produjo falsos cierres; el Pi limpio produjo uno.
- **Medir antes de creer.** Congelamos diez casos, un oráculo externo, P2P, canario, agente nulo y falsos cierres como regresión automática. La línea base nos dijo que éramos 6–10x más caros y 1/10 en plazo. Fue incómodo y fue lo que permitió rediseñar.
- **Hacer la verificación proporcional.** Un diff pequeño se verifica con checks; una UI exige test, runtime y píxeles. La verificación proporcional y la dieta de política bajaron los tokens 46% en la segunda cohorte sin aflojar el cierre.
- **Invertir la barrera de efectos.** Dejamos de clasificar cada herramienta como peligrosa y movimos la seguridad a guards pre-ejecución y verificación post-hoc. El agente dejó de quedar encerrado cuando necesitaba investigar.
- **Cerrar automáticamente solo con evidencia sellada.** El cierre automático no inventa un PASS: si hay un PASS fresco y el modelo no declara el cierre, el sistema lo declara con `reviewHash`, workspace y criterios. Con las correcciones previas y el cierre automático, la trayectoria fue 0/3 → 2/3 → 3/3, sin un falso positivo.
- **Mantener el PR como frontera humana.** No hay merge automático, deploy ni publicación por inferencia. El primer ciclo real terminó en un PR que un humano aprobó; la autonomía termina donde el operador puede auditar.
- **Escribir las reglas como código.** Guards de bash y edición, superficies disjuntas, P2P, canario, agente nulo. Una regla que solo vive en un prompt es una esperanza; una que bloquea o falla es un contrato.
- **Memoria de equipo sin configuración.** Un Durable Object por repo, tres herramientas nativas y offline-first. La demo de LRU+TTL ahorró 15% de tokens y, sobre todo, exploración. n=1, pero la dirección es correcta.

## Lo que hicimos mal

No fueron errores aislados de implementación. Fueron errores de diseño que solo se vieron al medir. Cada uno cambió una regla del harness.

### La barrera que no dejaba investigar

La primera versión de recuperación trataba casi todo como un efecto peligroso. Cada herramienta tenía una clasificación; cada operación incierta quedaba pendiente de reconciliación. Un `grep` interrumpido podía bloquear las siguientes llamadas. Una lectura de navegador se marcaba como unsafe. Un `tab select` se confundía con una acción sobre la página.

El agente quedaba encerrado justo cuando necesitaba investigar para desbloquearse. La barrera no protegía el mundo; protegía el miedo del diseño anterior.

La inversión no era original: es la dirección que ya usan herramientas como Claude Code, Cursor, Devin o pstack. La barrera anterior era el anti-patrón. La seguridad viene de cuatro sitios: el guard de bash que bloquea lo destructivo antes de ejecutarlo, la política del prompt, la reconciliación propia de la capa de entrega de git y la verificación post-hoc del artefacto. Nada es un efecto rastreado por defecto. Las lecturas de bash y navegador se reconciliaron por auto-reparación al cargar la sesión. Los puntos de control viejos se limpian.

La lección: una lista de verbos no entiende intención. Un botón de «pausar campaña» y un selector de fecha pueden compartir la misma herramienta. Si la barrera no puede distinguirlos, no es seguridad; es fricción con nombre de seguridad.

### El proceso que no terminaba

El bug de exit era doble.

Primero, el MCP `chrome-devtools` mantenía vivo el proceso de Pi en modo print después de que el agente terminara. El runner del benchmark usaba un `mcp.json` limpio y el problema desapareció para algunos casos.

Segundo, y más profundo, después de un PASS el modelo a veces no emitía la declaración final. El turno de cierre quedaba esperando una respuesta que nunca llegaba. El trabajo estaba hecho, la verificación estaba sellada, pero el proceso no salía. En la cohorte 3, las siete ejecuciones restantes compartían el mismo patrón: última revisión PASS, última entrada de la transcripción a los 53–144 segundos, ningún `{"complete": true}`.

La solución no fue pedirle al modelo que se apurara. Fue separar «completado» del texto del modelo. El harness añadió un mecanismo de vigilancia del proveedor: si un turno no responde en ocho minutos, se aborta y la sesión continúa. Y añadió el cierre automático: si hay un PASS fresco con `completionReady` y el modelo no declara el cierre en 30 segundos, el sistema declara el completado con su autoridad sellada —`reviewHash`, workspace y criterios— y lo registra como `harness-auto-complete`.

El cierre automático no inventa un PASS. Solo cierra cuando el PASS ya existe. La diferencia entre «el modelo dice que terminó» y «el sistema puede demostrar que terminó» es todo el proyecto.

### La verificación imposible

Hay tareas donde la verificación formal no se puede ejecutar: un entorno sin credenciales, un servicio caído, un repo que el snapshot no puede recorrer. El agente intenta, falla tres veces con la misma petición, y la barrera lo deja atrapado. El humano tiene que ejecutar `/task-accept` para desbloquearlo.

Eso no es autonomía; es una sala de espera.

Ahora, tras tres fallos idénticos de verificación, el cierre acepta el cierre con un estado honesto: «verificación imposible». No dice PASS. Dice lo que pasó. `/task-accept` sigue existiendo para el operador que decide que la verificación formal no es necesaria, con registro de auditoría. Y la exención automática escanea el historial completo de la sesión, no solo el contador en memoria, para que un `/reload` no reinicie la trampa.

La lección: la autonomía necesita una salida honesta. Un bucle infinito no es rigor; es una forma de no decidir.

### El harness que no era el harness

El piloto del 17 de octubre parecía decir que el harness añadía un 5% de sobrecoste de tokens. El del 18 de octubre decía 18x. La diferencia no era una regresión del producto: era que el primer piloto corría el brazo del harness con una lista blanca exclusiva de herramientas y sin las extensiones instaladas en el directorio del agente. Medía las instrucciones y los ajustes, no las herramientas del paquete.

El instalador tampoco copiaba `lib/` ni `vendor/`, así que una instalación limpia podía quedar rota. Lo arreglamos, y la tanda 3 del clean-vs-harness usó una instalación sin parches manuales.

La lección: un benchmark mide el tratamiento completo o no mide nada. Y un instalador que pierde archivos no es un detalle de empaquetado; es un fallo de medición.

### Los valores por defecto son contratos

Tres errores pequeños que enseñan lo mismo:

- Subimos el límite de snapshot de 10k a 50k archivos para repos grandes. El contrato adaptativo tenía un máximo de 20k. Resultado: **todas** las corridas de línea base fallaron. Lo alineamos con el límite y el problema desapareció. Un valor por defecto no es una preferencia; es un contrato con el resto del sistema.
- Una sonda directa a DeepSeek devolvía HTTP 400 con herramientas forzadas y modo de razonamiento. Lo interpretamos como una limitación del harness y retiramos el eslabón del arquitecto. Después descubrimos que era un artefacto de la sonda: Pi no fuerza `tool_choice`. Restauramos el modelo y verificamos la caída en vivo. La lección: no conviertas el instrumento de medición en una conclusión del producto.
- El recordatorio de «Resultado pendiente de verificación» aparecía dos veces. Era un bug de UX, no de verificación, pero el harness también es software. La corrección tiene test. Si el sistema que exige pruebas no se prueba a sí mismo, pierde autoridad.

El patrón se repite: casi todos los errores venían de confundir una representación con la realidad. Un PASS con completado. Una sonda con el producto. Un valor por defecto con una preferencia. Una barrera con seguridad. La corrección siempre fue la misma: medir el objeto real, no su representación.

## Un caso real: el cupón que llegaba tarde

La línea base sintética sirve para comparar. El producto real sirve para ver si el flujo aguanta.

En [MaltaCleaners](/es/proyectos/maltacleaners/) había un bug de cupones: el usuario aplicaba A, editaba el formulario a B, volvía a escribir A sin reaplicar, y una respuesta antigua podía aplicar el descuento y borrar el error actual. Un problema de concurrencia con una reproducción observable.

El operador escribió `/plan` con el comportamiento fallido. El plan tardó 3:29. Autor y juez con contexto fresco; el juez aceptó la reproducción, la autoridad monotónica y los criterios de evidencia. Después, `/task` implementó y verificó: línea base nativa antes de editar, 28 escenarios web, 38 pruebas puras, tipos, lint y build. La primera revisión final fue INCONCLUSIVE: faltaban pruebas de que el cableado no se había modificado y de los estados excluidos. La segunda, con esa evidencia añadida, fue PASS 4/4. Siete imágenes reales llegaron al juez.

La actividad de Pi fue 29:25. No fue el harness quien encontró el bug; fue el agente. El harness hizo que la corrección se demostrara antes de aceptarla, y conservó la primera revisión fallida en vez de esconderla.

Los límites importan: la UI usaba APIs sintéticas, no se ejecutó D1 para este bug y no hubo deploy. El caso demuestra el mecanismo, no la producción.

## Lo que compra y lo que cuesta

El harness no es gratis y no es para todo.

**Lo que compra**

- Cero falsos cierres en las cohortes del harness.
- INCONCLUSIVE honesto cuando falta evidencia.
- Recibos sellados y PR con evidencia.
- Guards que bloquean antes del efecto.
- Memoria compartida por repo.
- Planes y revisiones con contexto fresco.

**Lo que cuesta**

- 4–34x tokens según el tamaño de la tarea.
- Más latencia y más turnos.
- Complejidad operativa: instalación, snapshots, recovery.
- Un agente que a veces parece lento porque verifica.
- Un servicio más que operar.
- Más llamadas y más coste en tareas grandes.

La memoria compartida merece su propia sección: es la pieza que convierte una sesión que aprende en un equipo que aprende.

La decisión práctica es por tipo de tarea. Para un fix acotado, la ruta simple y los checks alcanzan. Para un cambio de precios, una migración, un flujo de cobro o cualquier cosa donde un falso cierre sea caro, el harness completo se paga.

## La memoria del equipo vive en Durable Objects

El harness resuelve una sesión. El equipo tiene otro problema: cada sesión empieza de cero.

Un bug sutil se diagnostica tres veces en tres repos. Una convención se redescubre cada semana. La causa raíz que alguien encontró ayer no llega al agente de hoy. La memoria del equipo no puede vivir en la cabeza de cada desarrollador ni en un prompt que se pierde al compactar.

Implementamos `pi-memory`: un Worker de Cloudflare con un [Durable Object](https://developers.cloudflare.com/durable-objects/) por proyecto. Cada DO tiene su propia base SQLite y un índice [FTS5](https://sqlite.org/fts5.html); el Worker expone `/v1/memories`, `/v1/memories/search` y `/v1/memories/bulk`. El proyecto se deriva del nombre del repo. El agente ve tres herramientas nativas: `memory_save`, `memory_search` y `memory_sync`. También hay CLI: `pi-memory save|search|list|sync|migrate-engram|status`.

¿Por qué Durable Objects? Porque un DO es un actor lógico con almacenamiento co-localizado: las escrituras y el índice viven en el mismo sitio, un proyecto no ve la memoria de otro, y no hace falta montar una base de datos separada para un equipo pequeño. FTS5 da búsqueda de texto completo sin un servicio de embeddings; el modelo de datos es una fila por aprendizaje. La comodidad es deliberada: la URL y la credencial compartida del equipo vienen como defaults del paquete; instalar el harness es la única configuración. Los overrides por desarrollador existen, pero el camino feliz es cero setup.

<img src="/articles/harness-agentes-cierre-verificado/memoria-do-es.svg" alt="Arquitectura de memoria: sesión A guarda con memory_save, el Worker pi-memory persiste en un Durable Object por repo con SQLite y FTS5, y la sesión B consulta con memory_search." width="900" height="560" loading="lazy" decoding="async" />

*Un Durable Object por repo: escrituras, índice y búsqueda en el mismo sitio; la outbox cubre los cortes de red.*

El offline-first también es parte del diseño: si el Worker no responde, `memory_save` escribe en `~/.pi/agent/memory-outbox.jsonl`; `memory_sync` reenvía cuando vuelve la red. Nada se pierde por un corte. La memoria se puede migrar desde Engram con `migrate-engram`.

El resultado se midió en una demostración de mecanismo, no en un benchmark: una sesión resolvió un bug de LRU+TTL desde cero (17 requests, 178.827 tokens, 8 llamadas de bash, 4 reads); otra sesión, con la lección guardada, llegó al mismo PASS con 18 requests, 152.352 tokens y solo 3 bash y 1 read. Un 15% menos de tokens y, sobre todo, menos exploración. n=1. Pero la dirección es la correcta: el conocimiento del equipo se acumula en el repo, no en la cabeza de cada agente.

Los costos y límites: un servicio más que operar; la credencial compartida y el paquete deben tratarse como material sensible (el repo sigue privado); la memoria no es un lugar para secretos, credenciales ni estado transitorio; la outbox es eventualmente consistente; el free tier de DO alcanza para un equipo pequeño, pero no es infinito; y una lección que se puede expresar como código va a código, no a memoria. La memoria no sustituye tests, guards ni verificación.

La conexión con harness²: la librería de lecciones tipada (cue/lesson/evidence/confidence) y el corpus de outcomes son la versión verificable de esta misma idea. `memory_save` es para el aprendizaje operativo; la librería es para las lecciones que sobreviven un contraste. La primera ya funciona; la segunda está en esqueleto y necesita ~30 tareas reales y 3 adopciones contrastadas para dejar de ser una demo.

## Lo que sigue

El objetivo no ha cambiado: **ticket → PR con aprobación humana**.

Lo que falta es la parte más difícil de demostrar:

- **Cohorte 4.** Repetir la línea base en tareas medianas y grandes, con varias repeticiones y oráculos externos. Las cohortes actuales son diez casos diminutos y una repetición; no sostienen una afirmación general.
- **Worktrees automáticos por tarea.** Hoy la higiene de worktrees es manual (`npm run worktrees`), aunque el diseño de superficies disjuntas ya está. Automatizarlo permitirá agentes en paralelo sin pisarse.
- **Verificación externa.** El `open_pr` con `gh` y un `origin` real aún no se ha ejecutado de extremo a extremo; los tests cubren contratos, barreras y repos temporales. El siguiente paso es un ticket real, un PR real y una aprobación humana real.
- **Métricas de resultado.** El corpus de outcomes y la librería de lecciones existen, pero necesitan volumen para dejar de ser una demo.
- **Aprendizaje de equipo.** La memoria compartida ya funciona; la librería de lecciones necesita ~30 tareas reales y 3 adopciones contrastadas. Es la parte de harness² que sí podemos pagar.
- **Empaquetado de equipo.** La memoria compartida y la instalación sin configuración ya funcionan; falta que el flujo completo sea igual de simple para cada desarrollador.

Y hay cosas que no vamos a hacer por inferencia: publicar, desplegar, borrar datos o aprobar un PR sin un humano. La autonomía termina en la frontera que el operador puede auditar.

## La pregunta correcta

La conversación sobre agentes suele centrarse en el modelo: cuál razona mejor, cuál escribe más código, cuál cuesta menos.

Mi experiencia con pi-harness me dejó otra pregunta: **¿qué evidencia exigimos antes de creerle?**

Un agente puede ser brillante y cerrar mal. Puede pasar los tests y no haber visto la pantalla. Puede decir «listo» porque decir «listo» es gratis. El harness no lo hace más inteligente. Hace que su éxito sea verificable.

Este artículo no es la historia de un harness que salió bien. Es la historia de un harness que se volvió honesto a golpes de medición.

El primer benchmark me enseñó que el problema no era el código. Era el cierre. Desde entonces, cada decisión del proyecto —el perfil libre, los jueces con contexto fresco, la verificación proporcional, el cierre automático, la inversión de la barrera, la memoria compartida— responde a la misma idea:

**No aceptes «listo» como resultado. Acepta evidencia.**

## Lecturas relacionadas

- [Harness learning: ¿es culpa del modelo?](/es/articulos/harness-learning-mejorar-agentes-ia/)
- [El bot no alcanza: por qué construimos un MCP](/es/articulos/mcp-operadores-admin/)
- [El modelo entiende; el código decide si tiene permiso.](/es/articulos/modelo-entiende-codigo-decide-permiso/)

## Fuentes

Estas son las fuentes primarias que informaron el diseño. No es una bibliografía decorativa: cada una cambió una decisión concreta. Las fuentes se fijaron a commit en los planes internos; las ideas se adaptaron, no se pegaron.

**Artículos y especificaciones**

- **harness²** — Google Research. [arXiv:2610.14224](https://arxiv.org/abs/2610.14224) · [repo](https://github.com/google-research/harness2). De aquí salieron None-never-zero, la librería tipada, la retención causal y los tripwires anti-leak. No adoptamos la recursión completa.
- **SWE-agent** — Yang et al. [arXiv:2405.15793](https://arxiv.org/abs/2405.15793). El ACI y el guardrail de edición: una edición inválida no debe aterrizar. Es el origen del `edit-guard`.
- **SWE-bench** — Jimenez et al. [arXiv:2310.06770](https://arxiv.org/abs/2310.06770). Tareas reales, FAIL-to-PASS y PASS-to-PASS. Es la base conceptual de la línea base congelada.
- **LiveCodeBench** — Jain et al. [arXiv:2403.07974](https://arxiv.org/abs/2403.07974). Evaluación segmentada en el tiempo y contaminación. Inspiró la rotación de casos; el canario vino de BIG-bench.
- **BIG-bench** — Srivastava et al. [arXiv:2206.04615](https://arxiv.org/abs/2206.04615). El canary GUID que usamos para detectar contaminación.
- **Berkeley RDI, “How We Broke Top AI Agent Benchmarks”** — [blog](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/). Evaluador fuera del contenedor, suelo del agente nulo y reward hacking. Inspiró el oráculo externo y el agente nulo.
- **METR Task Standard** — [especificación](https://github.com/METR/task-standard). Puntuación determinista y contenedores reproducibles; el protocolo congelado.
- **Harness Learning Enables Generalizable Test-Time Adaptation** — Zhang et al. [arXiv:2609.35738](https://arxiv.org/pdf/2609.35738). La idea de que el harness, no solo el modelo, es el objeto de mejora. Es el artículo científico detrás del artículo anterior de este sitio.

**Referencias de ingeniería**

- **pstack** — [repo](https://github.com/cursor/plugins/tree/main/pstack). «Done means X», playbooks de bug/feature, verificación como infraestructura.
- **gentle-shell/gentle-pi** — [repo](https://github.com/Gentleman-Programming/gentle-shell). ODD, tamaño proporcional, revisión por riesgo, delegación por razón.

*Las fuentes externas informan el diseño; no certifican nuestros resultados.*

---

*Nota metodológica: las cifras de este artículo salen de las cohortes y pilotos internos de pi-harness (octubre de 2026). Las cohortes son diez casos sintéticos × dos brazos × una repetición; los pilotos de Malta, 3–6 casos. No son un benchmark estadístico ni una comparación general con otros harnesses. El repo es privado; los detalles técnicos citados están en su documentación interna.*
