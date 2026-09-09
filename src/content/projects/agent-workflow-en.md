---
title: "Working with Agents — Context, Tools and Continuity"
description: "An engineering practice built around repository context, a maintained skills library and Pi runtime extensions — separating original work, adaptations and third-party tools."
lang: "en"
routeSlug: "agent-workflow"
tags: ["developer tooling", "Pi", "skills", "semantic retrieval"]
# Editorial revision date, not the start of this engineering practice.
publishedDate: 2026-09-09
featured: false
---

My work with agents includes configuring and extending the environment I use to develop software. I have worked on repository exploration tools, reusable instructions and mechanisms that preserve continuity as models fail or tasks move between stages. This is a case about engineering practice, complementary to the product stories.

## Repository context before execution

MCP-groomer captures one part of that work: automation around issues, repositories and change preparation. Its January 2026 history includes code indexing and semantic retrieval; later changes add execution tools.

The problem was to supply relevant repository context and working tools, rather than expecting a model to infer the codebase from a ticket alone. The project's name is not evidence that it implemented an MCP server. Indexing and retrieval code also do not establish retrieval quality or a currently running deployment.

## One maintained library instead of drifting copies

Maintaining instructions across several environments introduced another challenge. Independent copies could drift, symlinks could point in the wrong direction and duplicate discovery could load the same skill twice.

I consolidated the shared library in a repository with preserved history and documented how each tool discovers instructions. Synchronisation accounts for backups and environment-specific skills. That work makes the source of an instruction and the path through which it is loaded easier to inspect.

The history includes curation, removal of duplicates, instruction improvements and upstream synchronisation. The library combines original work, adaptation and third-party material. My contribution includes maintaining those relationships and making the environment usable across tools, not claiming authorship of every installed skill.

## Continuity when a provider fails

Local Pi extensions show work on execution continuity. One switches providers after failures and resumes from the existing session, carrying forward tool results and instructions to avoid repeating side effects. Another connects an approved task to a persistent goal with an execution budget.

These extensions adapt an existing agent environment; they are not a claim to have built Pi or the underlying models. Their behaviour requires verification. An instruction to avoid repeating an action is not an exactly-once execution guarantee.

## From a task to reviewable evidence

A representative workflow connects:

1. **Task and scope** — define the requested change and its boundaries.
2. **Context** — retrieve repository information and the relevant maintained instructions.
3. **Execution** — use tools within that scope, preserving results between stages.
4. **Review** — record findings so they can be challenged and checked.
5. **Verification** — examine the proposed change and its checks before treating it as complete.

Review artifacts from Mantto show agent-assisted work applied to concrete problems involving organisation boundaries, imports and concurrency. A recorded finding is evidence to investigate, not automatic proof of correctness or a completed fix.

## Evidence and limits

This account is based on the skills and MCP-groomer histories, selected changes, local Pi extension source and review artifacts. The source review did not execute those Pi extensions or benchmark task success, retrieval quality, cost or speed. Preserved history predating library extraction is not the creation date of the independent repository.

The practice complements my product engineering: preparing context, connecting tools and supervising agent execution while keeping provenance and limitations explicit. It does not claim superiority over commercial coding tools.
