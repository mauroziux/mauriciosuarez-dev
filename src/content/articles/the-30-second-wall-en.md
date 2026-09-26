---
title: "try/catch won't help when the process is already dead"
description: "A production FatalError at 30 s: the AI SDK was waiting for 60, PHP killed the worker first. The timeout hierarchy every backend needs."
lang: "en"
routeSlug: "the-30-second-wall"
tags: ["laravel", "php", "octane", "ia", "postmortem"]
publishedDate: 2026-09-26
draft: false
ogImage: "/articles/the-30-second-wall/hero-fatal-en.png"
---

Two days ago Sentry notified me of a death. Not an error — a **death**: `FatalError: Maximum execution time of 30 seconds exceeded`, an Octane worker down, and six noisy restarts in the logs (`ERROR unknown error` ×6). The most unsettling part: the code had `try/catch`. The AI gateway had its failover chain. None of it could act — because none of it runs when the process is already dead.

The system is [Mantto](/en/projects/mantto/), the same property-maintenance SaaS from the [previous entry](/en/writing/endpoint-29-seconds/). This time the protagonist isn't a slow endpoint but a limit nobody was watching.

## What (correctly) stays synchronous

Last episode I moved 29 seconds of work to the queue and the endpoint landed under 500 ms. The tempting conclusion: "everything slow goes to the queue." False — and the counterexample lives in three **interactive** AI endpoints: improve a note, improve a description, classify a maintenance request. They are synchronous on purpose: the user is watching the result appear on screen. No queue can help when the answer has to be in *this* response.

That's the scenario. A Gemini call that hung. A client timeout that never fired. And a wall.

## A death, not an error

The difference matters more than it seems. An **exception** is the program talking: someone can catch it, log it, degrade gracefully. An engine **timeout `FatalError`** is something else: Zend throws it, underneath PHP, when `max_execution_time` runs out. It doesn't pass through your code, doesn't respect your handler stack, never reaches the `catch`. The Octane worker — which runs in production with `max_execution_time = 30` — simply dies at 30 seconds, and the supervisor restarts it.

That's why the `try/catch` was there and useless: it operates in the language's realm; the wall is decided by the engine. There is no `catch` for "the process is gone."

## The autopsy: a three-link chain

Sentry issue `7753074600`, `POST /api/v1/ai/improve-description`, full stack through Prism → Guzzle. The causal chain, reconstructed:

1. `NoteImprovementService::improveDescription()` called `TextGateway::prompt()` with **no explicit timeout**.
2. The Laravel AI SDK applies a **60-second** default for text prompts when nobody sets one (`Promptable::getTimeout()`).
3. The Octane HTTP worker dies at **30 seconds** — PHP's `max_execution_time` — with an uncapturable `FatalError`. The SDK, patiently waiting for its minute, never got to fire.

Hence the law that governs any slow outbound call from HTTP context:

> **If the client timeout ≥ `max_execution_time`, PHP always wins. It doesn't degrade — it kills.**

Your client thought of everything... for second 60. The process stopped existing at 30.

![Diagram of the timeout race: before, the 60-second client timeout lived beyond PHP's 30-second wall and the worker died with an uncapturable FatalError; after, the bounded 20-second timeout fires before the wall as a catchable exception that triggers the failover](/articles/the-30-second-wall/carrera-timeouts-en.svg)

*The race you always lose: as long as your client timeout lives beyond the wall, the engine kills you before your own defense can fire. On mobile, swipe the graphic to see it in full.*

## The fix: 20 seconds, always below the wall

The solution wasn't more `try/catch` — we've seen there's nowhere to put it. It was giving the race back to the language:

- `TextGateway::prompt()` now accepts a `?int $timeout` and forwards it all the way to Guzzle through Prism.
- The three synchronous endpoints pass `config('ai.gateway.http_prompt_timeout')` — env `AI_HTTP_PROMPT_TIMEOUT`, **default 20 s**, strictly below the wall's 30.
- A timeout that fires is a **normal route failure**: a catchable exception, not an engine fatal.

Why 20 and not 29? Because the 30-second wall doesn't belong to the AI call — it belongs to the **entire request**. The budget includes validation, database, serialization. The client timeout has to leave room for the rest of the request, not barely scrape the wall.

![Diagram of the timeout hierarchy by context: in the Octane HTTP worker PHP's 30-second wall is hard and the 20-second client timeout stays inside the request budget; in the PHP CLI queue worker there is no max_execution_time and the SDK's 60-second default is safe](/articles/the-30-second-wall/jerarquia-timeouts-en.svg)

*The same default (60 s) is a trap in one context and a sound choice in the other. The context decides the value — there is no universally safe timeout.*

## The twist: the failover finally breathes

This is my favorite part of the fix. Mantto's gateway has had, for months, a capped failover chain: if a route fails, it advances to the next one; if they all fail, a clean, auditable 5xx.

It was a good defense... that in the incident **couldn't execute even once**. Failover is code, and code needs a living process. With the timeout at 20 s, the hung Gemini call becomes an exception at second 20, the gateway advances to the next route, and the error contract holds. The defense I'd already built finally has room to act.

## The gotchas, in short

- **The SDK default is a relocated trap.** 60 s remains the default for any new caller that forgets the timeout in HTTP context — the fatal can be reintroduced by one new endpoint. The defense: a regression test that spies on the gateway and asserts that **every** HTTP prompt arrives with a bounded timeout (< 30), plus the runbook's timeout table.
- **Deploying with Octane = a restart contract** (documented in the previous entry): `config/ai.php` changed → `docker compose restart api worker`.
- **How did I know the fatal came from this week's deploy and not an old one?** Because a month earlier I solved another mystery: for weeks, six deploys shared the same Sentry release, and "which deploy broke this?" triage was impossible. That story — the frozen release — is the next entry in this series.

## What transfers

1. **Timeouts are a hierarchy**: user patience > request budget > runtime hard limit > client timeout. The client always sits below the wall, with room for the rest of the request.
2. **`try/catch` lives inside the process — and the process isn't eternal.** An uncapturable zone exists; good design doesn't try to catch it, it never gets there.
3. **A safe default in one context is a trap in another.** 60 s: reasonable on a queue worker with no limit, fatal on a request with a wall. Context decides.
4. **Failover is a living-process mechanism.** No fallback chain is worth anything if the first failure kills the process that was going to execute it.
5. **An undocumented hard limit is a scheduled incident.** The wall had been there for months; nobody had put it on the same page as the client timeouts.

Two closing notes of honesty: this is an **internal production log, not a benchmark** — a single hung call uncovered it, which also says something about the queue of incidents waiting inside unexamined defaults. And the fix is deliberately boring: a parameter that travels, a config with a conservative default, and a test watching the door. Good fixes usually are.

---

*And why couldn't I do per-deploy triage for weeks? Because every Sentry event landed on the same release — one from July — regardless of the deployed commit. Six deploys, one frozen release, and a chain of variable precedence almost nobody understands. That's the next entry.*
