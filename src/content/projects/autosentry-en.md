---
title: "AutoSentry — From Error to Reviewable Fix"
description: "A documented Sentry-to-GitLab repair workflow: deterministic triage, a sandboxed coding agent and RED/GREEN checks before a draft merge request and human review."
lang: "en"
routeSlug: "autosentry"
tags: ["ai-integration", "incident-response", "agents", "cloudflare"]
# Editorial revision date, not the project's start or launch date.
publishedDate: 2026-09-09
featuredOrder: 1
anonymized: true
screenshots:
  - src: "/projects/autosentry/flow-diagram.svg"
    alt: "AutoSentry flow diagram: Sentry error, triage and deduplication, ticket and scope, reproduction, repair agent in sandbox, validation gates, draft merge request with CI and human review"
    caption: "Generic reconstruction from documentation — not an internal screenshot or an executable demo."
---

I worked on an internal tool that connects Sentry errors to proposed fixes for human review. The project addresses the work before code review: selecting an actionable defect, avoiding duplicates, finding the relevant code, reproducing the failure and preparing a change an engineer can assess.

*Evidence basis: supplied RFC, README and Wrangler configuration. The source review did not inspect the full repository, merge requests or a remote deployment. This internal-tool case is anonymised.*

## Triage before automation

The workflow starts with deterministic triage. Events are filtered to distinguish application defects from network, ad-blocker and third-party noise. Related manifestations are grouped to avoid duplicate tickets. A manifest maps an error to the appropriate repositories and permitted scope; cases outside that scope are handed to a person.

An early failure changed the design. A one-shot repair attempt replaced a large source file with a minimal stub. Draft review caught the problem, and the change was closed without being merged. That experience led to a coding agent working on real files inside a sandbox, supported by explicit checks before a proposed change could be opened.

## Two paths through the workflow

- **Outside scope:** a defect that cannot be mapped to an authorised repository goes to a person instead of the coding agent. Network, ad-blocker and third-party noise is filtered during triage.
- **Eligible defect:** triage and deduplication lead to a ticket, a RED reproduction test, sandboxed repair, validation and a GitLab draft MR. CI and human review follow; the agent does not merge or deploy the fix.
- **Report-only backend:** the documented backend expansion classifies and reports only. It creates neither tickets nor automatic repair attempts.

## Architecture

The documented orchestration uses a state machine on Durable Objects with the Cloudflare Agents SDK and SQLite storage, while a coding agent handles reproduction and repair phases inside a Cloudflare Sandbox container. Deterministic classification and deduplication remain separate from the agent editing the code. The model operates within bounded stages; orchestration code decides when the process can advance.

Capability boundaries are part of the design. Network access is restricted, with credentials attached to authorized requests by a component outside the sandbox. The agent prepares a draft merge request; merge approval and integration remain human decisions. Development conventions are selected by repository and phase through pointers to a small set of read-only skills — supplying those documents as context does not grant additional tools or access to internal systems.

## A fix must prove itself

A proposed fix passes a concrete sequence:

1. A **reproduction test fails** against the original code (RED)
2. The agent makes the change; the **test must pass** (GREEN)
3. A **diff-size check** detects large deletions
4. **Type checking** compares against the existing baseline to identify newly introduced errors
5. Local gates are followed by the normal **CI process and human review**

If reproduction fails or a validation gate does not pass, that repair attempt stops before a draft MR is opened. A model producing an edit is not sufficient to advance.

The process can continue after the draft is opened. A bounded, invocable review loop can select pending CodeRabbit comments, apply a correction within the same scope and repeat the checks before updating the same merge request. For repositories with submodules, the workflow respects the existing release process: it proposes the fix in the shared repository and leaves reference updates to the release after merge.

## Operational evolution

The pilot evolved from triage and manually triggered repairs to an automatic chain with frequency, budget and concurrency limits. Before launching an automatic attempt, the design reserves the maximum cost of its two phases and reconciles it with reported spend at completion. These are automatic-chain limits; the manual path has a separate contract. The supplied configuration describes an automatic pilot, not a remotely verified current deployment. Runtime selection had a practical boundary too: Cloudflare supported the pilot, while diagnostics requiring access to internal networks were reserved for a different environment; the reproducible deployment pipeline was owned by the DevOps team, distinct from my work on the repair workflow.

## Reported results and limits

The RFC records human-reviewed fixes that were merged, alongside a partial fix whose mirrored case remained unresolved — evidence of both the workflow's value and the need to review the actual scope of each repair. This case study is based on the project's RFC, README and deployment configuration; it is not an independent audit, and it reports no aggregate accuracy rate or per-fix cost average.

Unlike the GitHub review focus of [DonMerge](/en/work/donmerge/), this case follows a defect through reproduction and repair to a GitLab draft MR. Its documented runtime uses Agents SDK, Durable Objects and Sandbox, not Cloudflare Workflows. DonMerge also contains triage and auto-fix; neither capability is presented as exclusive and their evidence is not shared.

AutoSentry represents my approach to applied AI for software engineering: turn an observed problem into a verifiable proposed change, with repository context, execution controls and an explicit human decision at the end.
