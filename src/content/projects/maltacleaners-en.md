---
title: "MaltaCleaners — From Booking Website to AI-Assisted Operations"
description: "A booking platform grew into service operations with a WhatsApp Concierge. The engineering work: human takeover, price grounding, stale-result checks and isolated evaluation."
lang: "en"
routeSlug: "maltacleaners"
tags: ["TypeScript", "Cloudflare", "WhatsApp", "AI evaluation"]
# Editorial revision date, not the project's start or launch date.
publishedDate: 2026-09-09
featuredOrder: 4
liveUrl: "https://malta-cleaners.com"
screenshots:
  - src: "/projects/maltacleaners/homepage.jpg"
    alt: "MaltaCleaners public website offering home cleaning and booking in Malta"
    caption: "Public booking website — this capture does not demonstrate the private Concierge runtime."
  - src: "/projects/maltacleaners/concierge-flow.svg"
    alt: "MaltaCleaners Concierge flow diagram: WhatsApp message, conversation context and authorized catalog, decision on meaning and authority, authorized action with current prices or operator intervention"
    caption: "Missing context or authority, the path is the operator. Documented reconstruction."
timeline:
  - date: "May 2026"
    title: "Booking website"
    description: "The available history starts with the public booking website and persistent storage."
  - title: "Administration and staff"
    description: "Administration, staff portals and reminders expand the product's flow."
  - title: "WhatsApp Concierge"
    description: "Conversations backed by an authorized price catalog: when context or authority is missing, the path is operator intervention."
  - title: "Operational hardening"
    description: "Duplicate prevention, concurrency and conversation continuity as the assistant took on more interactions."
---

The available history of MaltaCleaners starts in May 2026 with a booking website and persistent storage. My work expanded that flow into administration, staff portals, reminders and WhatsApp communication. As the product grew, the challenge became coordinating what an assistant says with what the operation actually knows and allows.

## Context and contribution

A booking involves dates, prices, people and subsequent changes. The product connects a public Astro website and React interfaces with Cloudflare APIs and persistent storage. Booking, staff coordination and customer communication need to describe the same operational reality.

My contribution connects service knowledge, product decisions and technical controls. As the Concierge handled more interactions, I worked on duplicate prevention, concurrency and conversation continuity. A useful response also has to belong to the correct request and reflect its current state.

## A request needs context and authority

A representative journey begins with a customer asking about a booking. The system needs the conversation context and authorised price catalogue before it can decide on a response or action. Where it cannot establish the meaning or authority of a request, the path is operator intervention, not an invented answer.

The intended flow is: **booking request → conversation and catalogue → decision → authorised action or human handoff**. Understanding a conversation and being allowed to act on it are different responsibilities. That distinction shaped the fixes below.

## When a human takes over

Rejecting a bot proposal did not always establish the same takeover state as replying manually. A documented case showed the assistant continuing after that rejection. I added a human-control window and the corresponding supervisor check.

A paused conversation and evidence of an accepted human answer remain separate facts. Preserving both avoids treating a pause as proof that someone has already replied, or treating a rejection as permission for the assistant to continue.

## A price is more than a number

The same amount may represent an hourly rate, a visit total or an outstanding balance. Reproduction tests showed how correcting an amount without preserving its meaning could produce the wrong response.

I worked on retaining units and intent, grounding prices in the authorised catalogue and routing uncertain cases to an operator. Reviewing a payment does not automatically authorise a new quote. This is a domain constraint that has to survive both model interpretation and the application's later processing of the response.

## Results can arrive too late

A conversation can advance, change scope or move to a human while classification is running. I strengthened the checks around delayed results: effects and state writes need to be checked again when the result returns, not only when the request starts.

The system retains broad conversational context while limiting which request an individual action can affect. Without that second check, a reasonable interpretation of an old message can become the wrong action for the current conversation.

## Evaluating messages and effects

I added a local environment that compares baseline and candidate behaviour with isolated storage. Tests inspect messages, actions, state changes and cases where nothing should be sent. The evaluation is not limited to whether a generated reply sounds plausible.

A subsequent runner supports real model calls through the Gateway, with a bounded call budget, usage recording and A/B labels. Both paths matter: deterministic scenarios exercise specific system controls; real-model comparisons can investigate behaviour those scenarios alone do not establish.

## Evidence and limits

This case is supported by the available Git history, selected diffs, evaluation code and local verification records reviewed in September 2026. That review did not execute the real-model runner, confirm candidate promotion or establish a production model-quality improvement. Evaluation infrastructure and a measured improvement are separate milestones.

The public site is available at [malta-cleaners.com](https://malta-cleaners.com). Its availability does not prove which private Concierge capabilities are currently enabled. No customer conversation corpus, identifiers or internal screenshots are reproduced here.

MaltaCleaners demonstrates the evolution of a booking website into operational software with applied AI: keeping each action tied to the relevant price, conversation and human responsibility.
