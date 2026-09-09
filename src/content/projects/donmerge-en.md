---
title: "DonMerge — AI Code Review with Guardrails"
description: "An open-source AI code review tool for GitHub pull requests: durable Cloudflare Workflows, structured output validation, model fallback and a quality gate that only lets concrete findings block a merge."
lang: "en"
routeSlug: "donmerge"
tags: ["developer-tools", "code-review", "ai-integration", "cloudflare"]
publishedDate: 2025-05-01
featuredOrder: 1
repoUrl: "https://github.com/mauroziux/donmerge"
screenshots:
  - src: "/projects/donmerge/sentry-integrations.png"
    alt: "DonMerge integration settings showing Sentry-triggered review workflows"
    caption: "Sentry-triggered triage workflows share the same durable-execution foundation"
---

DonMerge is an AI code review tool that runs on GitHub pull requests and publishes its findings as check runs and line-specific comments — with validation, fallbacks and a quality gate designed so that only concrete, well-argued findings can block a merge.

## Context and my role

PR review waits slow teams down, and first-pass review is where an assistant helps most without replacing judgment. I designed and built DonMerge end-to-end as its sole developer — architecture, model runner, quality gate, GitHub integration and deployment — and validated it against a real production codebase.

## How it works

When a review is triggered (PR webhook, or a `@donmerge` comment to re-run), a Cloudflare Workflow executes a four-step durable pipeline:

1. Fetch PR data and create the check run
2. Prepare files — filters and context
3. Run the LLM review in a sandbox
4. Publish the review — match and deduplicate findings

Two design decisions carry most of the weight:

- **A dedicated model runner** owns model ordering, structured-output validation, one format-repair retry and direct-provider fallback. If a model exhausts its options, the durable step is not replayed wholesale; unclassified infrastructure errors stay workflow-retryable.
- **A quality gate** filters findings before publishing. Only issues with a described failure mechanism can block a merge; vague or style-level comments are dropped or downgraded to non-blocking suggestions. Findings carry stable issue keys, so re-runs deduplicate instead of repeating themselves, and addressed comments are auto-resolved.

## Evidence from a documented production validation

On 2026-08-21, after a timeout incident and a refactor of the retry policy, a validation run was recorded against a live private repository:

- A re-triggered review on the incident PR completed in **7m15s** and correctly reported a real state-machine bypass in the target code
- Of fifteen open PRs re-triggered in a burst, six checks initially failed (`DM-E005`); **all six completed successfully on rerun** with no code change — treated as transient failures under burst load, not a proven root cause
- Pre-deploy verification: `typecheck`, `npm test -- --run` (1,096 tests), `git diff --check` and a `wrangler deploy --dry-run`

These are documented observations from one validation, not a benchmark.

## Limits

- A human still decides the merge; DonMerge compresses first-pass analysis, it doesn't approve code
- The Sentry-triggered triage workflows in the codebase share the durable-execution foundation; I don't claim autonomous error resolution
- The figures above come from a single dated validation record, published with the project
