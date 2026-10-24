---
title: "De niñera a supervisor: por qué mi harness de agentes dejó de preguntarme si debe seguir"
description: "681 reviews inconclusas, un navegador muerto y tres empujones por sesión. Cómo construimos un supervisor determinista en el punto de settle — y qué papers respaldan el diseño."
lang: "es"
routeSlug: "supervisor-settle"
tags: ["agentes", "harness", "verificacion", "autonomia", "arquitectura"]
publishedDate: 2026-10-26
draft: true
---

> Borrador de trabajo (ES). La versión EN será `supervisor-settle-en.md`. Material fuente:
> docs/plans/2026-10-24-001-supervisor-settle.md y el post-mortem en vivo del repo del harness.

## El momento en que rompí

Llevo semanas construyendo un harness de agentes sobre Pi: una capa que verifica entregas de
software con evidencia binaria — cero cierres falsos como contrato innegociable. El sistema
funciona: atrapa defectos reales, rechaza evidencia falsa, nunca declara un PASS sin píxeles
ni tests. Y aun así, un martes por la tarde me encontré haciendo exactamente el trabajo que
construí el harness para evitar: **niñera de un agente que sabía qué hacer y prefería parar**.

La escena: una sesión de 3 días implementando un plan de 8 unidades. Todo el trabajo técnico
estaba bien — commits verificados, PRs en draft, tests verdes. Pero entre unidad y unidad, el
agente terminaba su turno con un mensaje elegante: "*Siguiente paso: continuar con U7.1*".
Y se detenía. A esperar. Tres veces ese día le escribí "continúa".

Ese día la sesión vieja acumuló **681 reviews INCONCLUSIVE** contra un navegador que llevaba
muerto desde la mañana — un rechazo permanente, idéntico cada vez, que el modelo reintentaba
porque nada le decía que era permanente. Y cuando no era el navegador, era el modelo
preguntándome el formato de un GIF para un PR: una decisión cosmética, con recomendación
incluida, que terminó en mi cola.

## La intuición que lo cambió todo

Mi conclusión no fue "necesito un modelo mejor". Fue esta:

> **Si un agente pregunta o se detiene con trabajo pendiente y sin bloqueo real, eso no es
> una necesidad de input humano. Es un fallo de la fase de planificación o de la política —
> y el sistema debe resolverlo, no yo.**

Un agente que pregunta "¿siguiente?" no está siendo prudente; está transfiriéndome un costo
de decisión que el sistema ya tiene la información para tomar. La pregunta correcta nunca es
"¿continuamos?" sino "¿qué falta del plan?".

## La respuesta de la industria (no la inventamos nosotros)

Cuando fuimos a mirar, resultó que el patrón ya tiene nombre y papers:

- **Magentic-One** (Microsoft, arXiv 2411.04468) describe un orquestador con un *progress
  ledger*: en cada ciclo decide continuar, re-planificar o reasignar. Su hallazgo central para
  nosotros: la mayoría de los estancamientos se resuelven re-planificando, no preguntando.
- **AutoGen** (2308.08155) y **MetaGPT** (2308.00352) consolidaron el patrón supervisor-worker:
  un orquestador enruta y decide; los workers ejecutan.
- **Reflexion** (2303.11366) y **Self-Refine** (2303.17651) evaluaron los bucles de
  autoevaluación→corrección: funcionan, pero **sin cotas divergen** — el respaldo empírico a
  nuestro miedo original al "supervisor que descontrola".
- **FrugalGPT** (2305.05176) validó la cascada barato-primero: clasificar con modelos
  pequeños antes de gastar en los grandes — exactamente cómo usamos JEV/Clef para triaje.
- **SWE-agent** (2405.15793) mostró que el scaffold —no el modelo— decide buena parte del
  éxito. Nuestra experiencia lo confirma: cada capa mecánica del harness eliminó una clase
  entera de babysitting.

## Lo que construimos: un supervisor sin manos

La decisión de diseño que nos costó menos lágrimas: **el supervisor no es un agente**. No
tiene herramientas, no ejecuta trabajo, no re-verifica. Es una función de decisión en el
único chokepoint que ya controlábamos: el momento en que el turno intenta morir (`settle`).

Clasifica cada fin de turno en cuatro ramas, determinista, por señales del journal:

1. **Verificación pendiente** → re-encolar la corrección (ya existía).
2. **Plan incompleto sin bloqueo** → "Quedan N items: continúa ahora, no preguntes"
   (mecánico, gated por progreso real).
3. **Bloqueo de entorno** → el fast-fail ya ejecutó la receta; el supervisor escala UNA vez
   con la causa nombrada, no en loop.
4. **Pregunta/decisión** → la rama nueva: una cascada barato-primero que consulta en orden
   el plan (nuestra constitución), la política del harness, un clasificador pequeño (JEV→Clef),
   y solo el residuo llega a mí — registrado como *planning gap* para mejorar la fase de plan.

Y los límites, porque la investigación y nuestras propias cicatrices lo exigen: presupuesto
de decisiones por sesión, anti-repetición por causa, todo journalizado, kill-switch, y los
gates de verificación intocables — el supervisor puede encadenar turnos, jamás puede declarar
un PASS.

## La métrica que importa

No es tokens ni velocidad. Es **cuántas veces por sesión tuve que escribir "continúa"**.
Ese martes: tres. Hoy: cero mientras hay plan pendiente y nada bloqueando — y cuando algo
bloquea de verdad, llega un reporte con causa y remedio, no un silencio elegante.

La autonomía no se le regala al modelo. Se la construye al sistema alrededor.

## Fuentes

- Magentic-One — arXiv 2411.04468
- AutoGen — arXiv 2308.08155
- MetaGPT — arXiv 2308.00352
- Reflexion — arXiv 2303.11366
- Self-Refine — arXiv 2303.17651
- FrugalGPT — arXiv 2305.05176
- SWE-agent — arXiv 2405.15793
