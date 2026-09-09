---
title: "Mantto — Evidence, AI and Property Operations"
description: "Connecting inspection evidence, AI-assisted analysis, finding review and maintenance: organisation-aware permissions, shared AI routing and background report generation."
lang: "en"
routeSlug: "mantto"
tags: ["Laravel", "applied AI", "property operations", "queues"]
# Editorial revision date, not the project's start or launch date.
publishedDate: 2026-09-09
featuredOrder: 3
liveUrl: "https://mantto.app"
screenshots:
  - src: "/projects/mantto/dashboard.png"
    alt: "Mantto property operations dashboard"
    caption: "Product view — property operations."
  - src: "/projects/mantto/inventories.png"
    alt: "Mantto inventory interface with inspection findings and evidence"
    caption: "Inspection findings and supporting evidence."
  - src: "/projects/mantto/maintenance.png"
    alt: "Mantto maintenance request interface"
    caption: "Maintenance follows the review of inspection findings."
  - src: "/projects/mantto/inspector-mobile.webp"
    alt: "Mobile inspector interface accessed through a browser"
    caption: "Browser-based inspection in the field."
timeline:
  - date: "Mar 2026"
    title: "The available history begins"
    description: "The earliest visible commit already contains a working maintenance management application."
  - title: "Field evidence integrity"
    description: "Unique identifiers on storage paths: two photos with the same name no longer overwrite each other. Regression tests included."
  - title: "From inspection to approved maintenance"
    description: "Review transitions with transactional locking: evidence is checked against its organization, inventory and media type before completion."
  - title: "AI gateway with organization context"
    description: "Provider configuration resolves from the organization and its plan; fallback attempts are bounded and context travels with the business object."
  - title: "Asynchronous completion"
    description: "State transition is separated from slow work: reports, PDFs and notifications continue in the background."
highlights:
  - value: "29s → <500ms"
    label: "endpoint response after separating completion from slow work (internal record; not a benchmark)"
  - value: "~70%"
    label: "estimated inventory-time savings (informal estimate, not a verified measurement)"
  - value: "4h → <1h"
    label: "duration of some inventories per the author's informal estimate"
---

Mantto brings property maintenance and inspection workflows into one product. My work connected evidence capture, AI-assisted analysis, finding review and maintenance execution with the requirements of a system serving multiple organisations.

## Context and contribution

The earliest visible commit, from March 2026, already contains a maintenance management application. It is a point in the available history, not a verified launch date. Its evolution shows field and operational problems alongside the addition of AI capabilities.

My contributions span evidence storage, review transitions, shared AI routing and the boundary between a state change and the slow work it triggers. The goal is not merely to generate a useful finding: that finding must belong to the right inspection and organisation, retain its evidence and reach maintenance through an explicit review step.

## Preserving evidence in the field

Evidence integrity was one of the first problems. Two photos with the same filename could target the same storage path. I introduced unique identifiers into those paths and added regression coverage.

It is a small implementation detail with an important consequence: an inspection finding depends on the evidence behind it. Generating a report is of little use if an attachment has overwritten another before review.

## From inspection to approved maintenance

I strengthened inventory review transitions so submitted evidence is checked against its organisation, inventory and expected media type. Submission uses transactional locking, and administrative finalisation requires the review state.

The flow connects:

1. **Capture** — an inspector records evidence through the browser.
2. **Draft** — AI-assisted analysis proposes findings, rather than making an administrative decision.
3. **Review** — evidence and state are checked before finalisation.
4. **Maintenance** — approved findings become requests, retaining their evidence relationship and avoiding duplicate conversion.

The AI output is one part of that flow. Permissions and state transitions remain application responsibilities; neither a screenshot nor an AI finding establishes a legal certification or a structural diagnosis.

## An AI gateway with organisation context

As AI capabilities expanded, each service could not independently own every provider decision. I worked on a common gateway: configuration is resolved from the organisation and subscription plan, attachment capabilities guide routing, and fallback attempts are capped.

Context is passed from the business object rather than set as mutable shared gateway state. That matters across requests and queued jobs: work for one organisation must not accidentally reuse another organisation's configuration.

## Separating completion from slow follow-up work

The maintenance completion endpoint waited for AI report generation, PDF creation, attachment retrieval and outgoing communications. I separated the state transition from that subsequent work.

Report generation and notifications are dispatched independently. A report retry does not create a dependency that prevents notification processing. The state update can finish while the slower work continues in the background.

The internal incident record reports roughly **29 seconds of endpoint waiting before the change and a response below 500 milliseconds afterwards**. The commit and incident documentation support this historical observation of one flow; this portfolio review did not repeat the measurement and does not provide a sample distribution or percentiles. It is not a platform-wide benchmark, and the report still takes time to generate.

There is an explicit trade-off: a notification may be sent before the PDF is available. Generation failures remain visible for retries and recovery, while maintenance state is managed independently.

## Evidence, personal estimates and limits

This account draws on inspected commits, selected diffs, current services and technical notes covering evidence paths, review transitions, gateway routing and asynchronous completion. It describes implementation decisions, not independently measured adoption or business impact.

**Personal estimates, not verified measurements:** I have estimated inventory-time savings at around 70% and described some inventories as going from roughly four hours to under one hour. These are informal estimates without a documented period, sample or measurement method. They are not one consistent before/after calculation, and they should not be read as a benchmark or confused with the separate endpoint-latency observation above.

Mantto demonstrates how I connect model capabilities to evidence, permissions, state and cost controls — and define what happens when individual parts fail.
