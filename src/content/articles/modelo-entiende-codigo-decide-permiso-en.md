---
title: "The model interprets; code authorizes actions."
description: "A cleaning enquiry was mistaken for a job application. MaltaClean taught me why AI agents can interpret intent, but code must authorize actions."
lang: "en"
routeSlug: "modelo-entiende-codigo-decide-permiso"
tags: ["integracion-ia", "arquitectura", "seguridad", "operaciones"]
publishedDate: 2026-09-23
draft: false
ogImage: "/articles/modelo-entiende-codigo-decide-permiso/hero-permiso-es.jpg"
---

An AI agent may understand that someone wants to cancel a booking. That does not give it permission to cancel it.

The distinction seems obvious until a message mixes a question, a date change, a complaint, and an earlier booking. The model can interpret that mix, but it cannot prove who is writing, which booking is current, or whether there is valid confirmation to act. And the risk does not begin only when a booking is changed: it also appears when a label determines the reply someone receives.

I've written [in Spanish about a case where the model got it right but nobody handled the exception](/es/articulos/modelo-acerto-cliente-perdido/). At [MaltaClean](/en/work/maltacleaners/) I found the reverse failure too: a property manager looking for recurring cleaning was classified as a job applicant. The model's own explanation acknowledged the request for apartment cleaning, yet an “employment intent” flag triggered a fixed “no vacancies” reply.

The first error was recoverable: a mistaken contextual classification. The second made it consequential: code treated a semantic label as authorization to reject a potential customer.

![Anonymous illustration: a request for apartment cleaning is wrongly labeled as a hiring enquiry and ends in a fixed rejection](/articles/modelo-entiende-codigo-decide-permiso/servicio-confundido-empleo-en.svg)

*An incorrect label need not become an automatic reply. This illustration recreates the documented failure without showing customer messages or identifying details.*

## Rules weren't the problem

Deterministic rules are not the enemy of AI. They prevent a plausible reply from becoming the wrong action.

The audit reviewed 82 conversation threads in context, each containing a bot decision or a recovery decision. Forty-four had at least one actionable quality finding or avoidable escalation. That **does not mean 44 were classification errors**.

![Audit chart: of 82 reviewed threads, 44 had findings, 24 were handled as expected, 12 required escalation, and 2 lacked enough evidence](/articles/modelo-entiende-codigo-decide-permiso/auditoria-82-hilos-en.svg)

*Seven-day audit ending August 5, 2026. Unit: conversation thread, not message; one material finding is enough to count a thread. These figures do not measure sales, causality, or the model's classification error rate.*

In the same review, deterministic safeguards worked when they did what software does best:

- provide bank details from a canonical source;
- check that a booking belongs to the right customer;
- require a signed token to cancel a booking;
- prevent duplicates;
- avoid claiming a change happened before the adapter confirms it.

The failure appeared when those rules tried to guess what a message meant. A lexical matcher can spot a word associated with hiring or cancellation, but it cannot tell whether the word describes the person's current goal, a past experience, or an exception in a longer conversation.

The answer was not to remove the rules. It was to stop asking them to interpret conversations.

## Four decisions, four owners

A safe architecture does not treat model output as a free pass. It divides the path:

1. **Contextual model — interprets.** What does the person seem to want? It proposes an intent, but neither changes data nor declares success.
2. **Authorization code — checks.** Is there permission and evidence for this effect? It verifies state, ownership, current facts, and business rules.
3. **Canonical adapter — executes.** It applies validation, deduplication, auditing, and the existing side effects.
4. **Human review — takes ownership.** When certainty or authority is missing, the case remains visible. A queue entry is not proof that the customer received an answer.

That separation can look bureaucratic until you examine a real case. If the model identifies a cancellation request, the system still has to find the right booking, verify ownership, issue or check the signed interaction, and reread the booking's state before acting. If any check fails, there is no “probable” cancellation. The next step is clarification or human review.

The same goes for payments. A model may recognize that a customer is asking how to pay; code must supply the canonical bank details. It may recognize that someone says they have paid; that does not verify a payment.

## Classification is a hypothesis, not a credential

Classification is a hypothesis with limited scope: it can distinguish an invoice request from a booking update or a need for human attention. On its own, it cannot choose values to write, grant permissions, or claim an unverified result.

At MaltaClean, the adapter receives a semantic category, not an order from the model. Values for a change are grounded again in the current message and operational state. Effects go through the existing contracts for pricing, notifications, auditing, and idempotency.

That design adds deliberate friction. An action takes a little longer to cross its boundaries, but it avoids a hard-to-reverse class of errors: a reply that sounds right while changing the wrong thing.

## What to do when the model doesn't know

It also matters what the system does when the model provider is unavailable.

The tempting fallback is a keyword list: if the text contains “cancel,” send it to the cancellation flow; if it contains “job,” reject it; if it contains “payment,” mark a payment intent. The audit showed why that is dangerous: words alone do not carry the context a conversation needs.

The safer path is a retryable failure or operator work when reliable interpretation is unavailable. That is less impressive than an automatic reply, but it keeps a technical outage from silently changing the product's meaning.

This does not eliminate automation. It puts automation where there is enough evidence: checking a signature, reading a record, comparing state, calculating a price from the catalog, or preventing a duplicate. Leave ambiguity to AI and verifiable facts to code.

## The question that changes the design

When I evaluate a new AI feature, I no longer begin with “can the model recognize this intent?” I ask:

- What independent fact does the action need?
- Who can authorize it?
- Which values may be written, and where do they come from?
- What proof exists after the effect is executed?
- What happens when the model or provider is uncertain?

The right answer may still be automation. But it will be automation that knows its limits.

**A model can help understand a request. Code must decide whether that understanding is allowed to become an effect.**
