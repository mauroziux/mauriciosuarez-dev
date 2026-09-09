---
title: "DonMerge — Making AI Code Review Operational"
description: "From a webhook reviewer to durable review execution: finding identity, quality gates, queued delivery and separate recovery policies for models and infrastructure."
lang: "en"
routeSlug: "donmerge"
tags: ["code-review", "TypeScript", "Cloudflare Workflows", "AI agents"]
# Editorial revision date, not the project's start or launch date.
publishedDate: 2026-09-09
featuredOrder: 2
repoUrl: "https://github.com/mauroziux/donmerge"
screenshots:
  - src: "/projects/donmerge/flow-diagram.svg"
    alt: "GitHub event through a queue, Workflow, model and sandbox, output validation, quality gate and published review"
    caption: "Simplified review flow, reconstructed from the inspected implementation — not a live execution."
cover: "/projects/donmerge/sentry-integrations.png"
timeline:
  - date: "Mar 2026"
    title: "A webhook reviewer"
    description: "The earliest state retained in the repository contains a reviewer built on Flue."
  - title: "Finding identity"
    description: "Deduplication and lifecycle tracking: repeating a review no longer fills the PR with comments about the same issue."
  - date: "Jul 2026"
    title: "Deterministic quality layer"
    description: "After a documented quality review, a post-model layer filters generic or stylistic feedback and requires a concrete failure mechanism for critical findings."
  - title: "Durable execution"
    description: "From Durable Object alarms to Cloudflare Workflows: webhook receipt moves through a queue and retries get a clear owner."
  - title: "Two retry policies"
    description: "Exhausting the model chain no longer repeats the whole flow: model and infrastructure failures recover differently."
---

DonMerge integrates AI-assisted code review into the pull request workflow. My work covered GitHub integration, finding management and the evolution of review execution into a durable process with explicit failure recovery.

## Context and contribution

The earliest state retained in the repository, from March 2026, contains a webhook reviewer built on Flue. That dates the available history, not necessarily the beginning of the product. Subsequent changes show the engineering work required around that first capability: recognising previously reported issues, deciding which findings deserve attention and completing reviews when providers or infrastructure fail.

My contribution was to make those boundaries explicit, rather than treating a successful model response as a completed review. Flue, the models and Cloudflare supply underlying capabilities; the integration, finding lifecycle and execution policies are the work described here.

## Findings need identity, not more comments

I introduced deduplication and issue lifecycle tracking in March. Repeating a review should not fill a pull request with copies of the same finding. The system needs continuity across executions as well as an understanding of the current diff.

Stable issue keys let findings retain their identity across re-runs. Tracking their lifecycle also makes unresolved findings visible: a new pass must not quietly erase the significance of an earlier concern. This turns isolated model messages into review state that engineers can follow and resolve.

## Deciding what can block a change

Review quality became a separate engineering problem. Following a documented quality review in July, I added a deterministic layer after model output to filter generic or stylistic feedback and require a concrete failure mechanism for critical findings. Non-blocking suggestions receive different treatment.

These are explicit heuristics whose behaviour can be tested, not proof that every retained finding is correct. Their limitations still need evaluation. The gate's purpose is to distinguish actionable risk from noise before publishing comments and checks to GitHub.

## Moving execution beyond the HTTP request

I migrated orchestration from Durable Object alarms to Cloudflare Workflows. A subsequent failure showed that starting long-running work from an HTTP request lifecycle could leave a review unstarted. Separating webhook receipt from processing through a queue gave each part a clearer job: the endpoint accepts the event; the consumer handles processing and retries.

The review path is:

1. A GitHub event is accepted and queued.
2. A Workflow fetches PR data and prepares the files and context.
3. The model reviews the change inside a sandbox.
4. Output validation, the quality gate and finding matching determine what is published.
5. GitHub receives the check run and line-specific comments.

I then addressed duplicate deliveries and the distinction between fresh work and an active review. Explicit sandbox cleanup releases resources after execution without discarding a valid review when cleanup itself fails.

## Two different retry policies

Slow provider responses later exposed another boundary: model retries and infrastructure retries need different policies. I extracted model ordering, output validation and format repair into a dedicated execution component.

Exhausting the model chain no longer causes that entire chain to be replayed by the durable workflow. Infrastructure failures remain recoverable. This avoids multiplying model attempts simply because an outer layer also knows how to retry.

## Evidence and limits

This account draws on the inspected Git history, selected diffs and the project's August production-validation record. That historical record documents a review completed in **7m15s**, actionable findings and a group of six initially failed executions that completed on rerun. It does not establish a general speed, accuracy or reliability benchmark; those runs were not repeated for this portfolio update.

DonMerge also contains triage and auto-fix functionality. This case focuses on GitHub review execution with Workflows. [AutoSentry](/en/work/autosentry/) is a separate documented repair workflow using Agents SDK, Durable Objects and Sandbox, ending in GitLab draft merge requests. Their results and evidence are not interchangeable.

The project demonstrates how I approach applied AI: connect a model to a real engineering process, then make the surrounding state, publication decisions and recovery behaviour explicit. Automated checks and review status support the team's decision; they are not a substitute for engineering judgment.
