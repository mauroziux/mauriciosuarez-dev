---
title: "The agent says “done.” The harness asks for proof."
description: "A build log of pi-harness: from an agent that believed it was finished to a system that demands evidence—with pstack, harness², and team memory on Durable Objects."
lang: "en"
routeSlug: "harness-agentes-cierre-verificado"
tags: ["integracion-ia", "evaluacion", "arquitectura", "automatizacion"]
publishedDate: 2026-10-23
draft: false
---

The first frozen benchmark was a slap in the face.

Twenty runs, ten frozen cases, two arms. Stock Pi closed all ten. The harness closed one within the six-minute deadline.

I opened the logs expecting to find an agent stuck in a loop. I found something else: in nine of the ten cases, the harness's code was correct. The work was done. The process simply would not finish.

The harness was not failing to solve. It was failing to close.

That distinction became the center of the project.

![The path: ticket, plan, task, verification, draft PR, and human approval.](/articles/harness-agentes-cierre-verificado/pipeline-en.svg)

*From ticket to PR: every step leaves evidence, and a person approves the last one.*

## What pi-harness is

pi-harness started on August 13, 2026, as a layer around [Pi](https://github.com/badlogic/pi-mono), badlogic's terminal agent. It is not a model. It is not a prompt collection. It is the program that decides which model responds, which tools the agent may use, how a task is planned, what evidence is required before accepting it, and when a delivery may leave the local environment.

The goal is a complete chain: **ticket → research → plan → implementation → verification → draft PR → human approval**.

The question that organizes everything is not “can the agent write the code?” It is “what has to happen before we accept that it finished?”

An agent can write a correct function and still be wrong about being done. It can pass the tests without ever looking at the screen. It can say “done” after three identical attempts, with no new evidence. It can close a task it never executed because the provider never answered. The problem is not code generation. It is the gap between producing something plausible and proving that it meets the request.

pi-harness works in five layers:

- **Routing.** The virtual model `router/auto` sends ordinary text to GLM and vision to OpenAI. Escalation to expensive models is budgeted and logged. Routing does not decide the workflow: choosing OpenAI does not activate researchers or parallel plans.
- **Planning.** `/plan` is a design mode: it inspects the repo, asks questions, compares alternatives, and saves a document with observable criteria. It does not implement. Plans for medium or large tasks go through fresh-context judges before they become a task.
- **Execution.** `/task` implements with playbooks. A bug requires a named failing reproduction before touching the code. Guards block destructive commands and edits that would leave JSON or JavaScript broken. Delivery happens in verifiable slices and a draft PR with sealed evidence.
- **Verification and closure.** `review_artifact` runs native checks, maps each criterion to evidence, and returns PASS, FAIL, INCONCLUSIVE, or STALE. Without a fresh PASS bound to the workspace, the task is not complete.
- **Team memory.** `memory_save`, `memory_search`, and `memory_sync` share per-repo learnings in a Durable Object; today's session does not start from zero.

Five invariants are non-negotiable:

1. A PASS exists only with executed evidence. INCONCLUSIVE, STALE, and NOT_RUN are never success.
2. The author does not judge their own work. Judges receive fresh context and literal citations.
3. Criteria are not weakened to close. If the human scope was not met, it is restored.
4. Publishing, deploying, or destroying data requires separate human authorization. The PR is the boundary.
5. An uncertain effect is reconciled by bytes or authoritative readback; it is never retried blindly.

![The five layers of pi-harness: routing, planning, execution, verification, and memory.](/articles/harness-agentes-cierre-verificado/cinco-capas-en.svg)

*Five layers, one contract: work is not done until evidence proves it.*

As I write this, the repo has 157 commits on `main` between August 13 and October 20. They are not a feature list: they are four acts, and each one corrected an assumption from the previous one. The commits are the audit trail of those assumptions. Most mistakes left a test, a guard, or an evaluation note.

**1. August: the runtime that didn't know how to stop.** The first harness was portable, with a supervisor, observability, and persistent task execution. We learned that autonomy without observability is a black box: late callbacks, false aborts, subagents that went silent. The first lesson was not “add more agents”; it was “make visible what is already happening.”

**2. Early October: the flow.** Tiered routing arrived, along with `/plan` as a design mode, proportional planning with judges, and Adaptive V1. We learned to separate three decisions we had been mixing: which model responds, how much to research, and which protocol to apply. We also learned that the author cannot be the judge.

**3. Mid-October: the evidence.** `review_artifact` arrived, along with the bug and feature playbooks, project verification, recovery, guards, and the git delivery layer. The first real ticket → PR → human approval cycle closed. We learned that a code PASS does not certify completion and that the PR is the boundary.

**4. Late October: closure.** The frozen baseline arrived, along with proportional verification, the exit fixes, auto-close, the context diet, the effect-gate inversion, and team memory. We learned that the problem was not the model's intelligence but the definition of “done.” And that a benchmark can measure the wrong harness.

What did not survive also counts: the old runtime, the second TODO manager, and the effect gate disappeared. A mature harness is not the one that accumulates layers; it is the one that can remove the ones that do not pay.

![Four acts of the project: August, early October, mid-October, and late October, with the lesson from each one.](/articles/harness-agentes-cierre-verificado/cuatro-actos-en.svg)

*Four acts, four corrected assumptions. What did not survive is part of the story too.*

## Where the approach comes from

None of these decisions came from nowhere. We read the pipeline, argued about it, and adapted it. Three sources were the most useful.

**pstack** ([repo](https://github.com/cursor/plugins/tree/main/pstack)) is Lauren Tan's (@poteto) skills plugin in `cursor/plugins`. We liked an idea that sounds simple and is hard to sustain: a task's contract is “done means X,” and X is not renegotiated at 2 a.m. We also liked its bug and feature playbooks, verification as infrastructure (`/create-verification-skill`), and the idea of encoding lessons in structure rather than hope. What we did not import: its catalog of ~51 skills as a global layer. An external critique put it bluntly: many are text waiting for the model to remember; only a minority are executable. We took the tools, not the manager. We also did not import mandatory arena/swarm, per-role models, or automatic publishing.

Concrete things came out of that: the bug playbook requires a failing reproduction before fixing; the feature playbook checks existing behavior before implementing; `.pi/verification/manifest.json` turns a project's verification into a versioned procedure; and “Done means X” is in the prompt template. Verification is not an opinion the agent writes at the end: it is a command that runs.

The idea that the harness—not just the model—is the object of improvement was already in *Harness Learning*; harness² takes it into recursion.

**harness²** is Google Research's meta-harness ([repo](https://github.com/google-research/harness2), [arXiv:2610.14224](https://arxiv.org/abs/2610.14224)). The question is different: can a system improve an agent's harness without touching the model weights? Its answer is a contrastive recursion: propose a change, probe it with real rollouts, and compose only what survives. We kept four mechanisms: **None-never-zero** (if a judge fails, the task is not a zero; it is `unscored` and leaves the denominator); a **typed lesson library** with four fields—cue, lesson, evidence, confidence; **causal retention** (only lessons from tasks before the current one); and **anti-leak tripwires** (the evaluator's rubric cannot enter context or memory). We did not adopt full recursion: harness² runs ~4,000 rollouts per task; we do not have that budget and will not pretend we do. The self-improvement plan uses the light version: an outcome corpus, a lesson library, and contrasted adoption through evals.

The third source is **gentle-shell/gentle-pi** ([repo](https://github.com/Gentleman-Programming/gentle-shell)): the ODD protocol, proportional task sizing, risk-based review, and delegation by reason, not size. Also [SWE-agent](https://github.com/SWE-agent/SWE-agent)'s ACI invariant—an invalid edit must never land—and the direction shared by Claude Code, Cursor, and Devin: nothing is a tracked effect by default; safety lives in guards and post-hoc verification, not in a list of verbs. The pipeline everyone converges on is similar: ticket → approved spec → clean worktree → red-green TDD with a linter → binary verification → independent reviewer → small PR with evidence → human approval. pi-harness is an implementation of that pipeline with one obsession: closure.

What we did not do: import pstack as a dependency, install its 51 skills, copy its arena, or turn harness² into a self-modification loop without a budget. The sources were pinned to commits in the plans; the ideas were adapted, not pasted. That distinction is the same one we apply to the rest of the harness: an idea does not enter because it sounds good; it enters if we can measure it.

## The flow we want

For a medium or large task, the path looks like this:

```text
/plan <idea>
  → proportional research
  → product questions and human decisions
  → fresh judges review the design
  → docs/plans/plan-<uuid>.md ready, with observable criteria
  → stop

/task <plan or objective>
  → implementation in dependency order
  → native checks
  → review_artifact (fresh judges; pixels when there is UI)
  → fix findings and re-check
  → commit_work_unit + draft open_pr
  → the human reviews and approves
```

Small tasks skip `/plan`: `/task` directly. A diff of up to 40 lines across two files, with no risk signals and no UI criteria, is verified with checks and without judges. That is the proportional path. Complexity is paid for when it adds something.

In practice there are at most three human gates, and one in normal use: PR approval. Everything else is autonomy with evidence.

## The decisions that weren't obvious

### The strict profile became opt-in

The first version had contracts, approval hashes, budgets, and Task gates. It was coherent on paper and exhausting in practice: the agent asked permission for reversible work, the human approved out of habit, and verification became bureaucracy.

We inverted the default. The normal profile uses free Task, optional Goal, and a progress list that is not a technical gate. The strict V1 protocol still exists for isolated profiles that need it, but it is not the default path. Autonomy is not achieved by adding approvals. It is achieved by defining what a valid closure is.

### Routing, depth, and parallelism are three different decisions

They are easy to conflate. They are not the same.

- **Routing.** Which model responds based on text, vision, and budget. `router/auto` owns it.
- **Depth.** How much to research, whether there are multiple candidates, how many judges. Coordinator signals and `plan_workflow` own it.
- **Protocol.** Effort, gates, and recovery in strict mode. Adaptive V1 owns it, opt-in.

Choosing an expensive model should not trigger a deep plan. And a deep plan should not justify burning the OpenAI window. Separating the three decisions prevents a trivial task from paying the ceremony of a high-risk one.

### Judges are fresh, not forks

A judge with the author's context inherits the author's assumptions. So reviewers receive the exact document or artifact, the requirements, and the sources, but not the conversation that produced the decision. “Fresh” means new context, not another model by definition. For what can be checked, tests, state, and artifacts come first. For what is subjective, an explicit rubric and, when possible, another model family.

There are two distinct reviews: the plan and the artifact. In deep planning, two or three independent authors produce candidates; each candidate goes through two fresh judges. A candidate is eligible only if every judge returns PASS, with no gaps and no P0/P1. Selection is conservative: highest minimum score, stable tie-break by ID, and INCONCLUSIVE if no candidate is eligible. There is no automatic merge. During execution, the artifact reviewer receives the final plan, the exact diff, and the evidence; they do not edit the code they judge.

### Verification is proportional to risk

A pure backend change does not need a browser. A screen does need a test, a real runtime, and inspected pixels. A form that shows “20.00 €” in the DOM but with `opacity:0` is not verified by a green test: the test can pass while the user still cannot see the price. That was one of the experiments in the outcome-verification lab, and it explains why UI cannot be certified by asserts alone.

The rule is simple: every observable criterion maps to a native check. If evidence is missing, the result is INCONCLUSIVE, not PASS. If the code changes during the review, the receipt becomes STALE. A code-only PASS does not certify completion.

### Safety is not a list of verbs

At first we tried to classify every tool as safe or dangerous. Thirty-plus tools on a denylist, per-effect reconciliation, browser classification. The result was a gate that blocked legitimate investigation and could not tell a date selector from a button that changes a campaign budget.

Today safety lives elsewhere: a guard that blocks destructive commands before execution, a guard that prevents an edit from leaving the file broken, disjoint write surfaces for concurrent writers, and post-hoc verification of the outcome. The recovery gate is empty by default. What does have its own reconciliation is the git delivery layer—a push, a PR; interrupted reads and old checkpoints self-heal when the session loads.

The inversion was not original: it is the direction already used by tools such as Claude Code, Cursor, Devin, or pstack. The previous gate was the anti-pattern.

## Measure the harness, not the vibes

For months the harness was improved through small pilots. They were useful for finding friction, but they could not answer a harder question: does the harness improve the outcome, or only make it more expensive?

On October 18 we froze a baseline. Ten synthetic cases with an external oracle the agent never sees. Each case has a failing version and a passing reference; preflight proves the oracle discriminates before spending a cent. The scoring rules were agreed before running:

- **PASS-to-PASS.** Each case must keep at least one test that already passed in its broken state. That catches an agent fixing one thing by breaking another.
- **Unique canary.** Each case carries an identifier that is never published. It detects corpus contamination.
- **Null agent.** An actor that does nothing must score zero PASS and zero false closures. That is the benchmark floor.
- **False closure = automatic regression.** If the agent declares success and the oracle fails, that is not just another red test: it is the metric the harness exists to prevent.
- **None-never-zero.** If the judge fails, the task is not a zero: it is `unscored` and leaves the denominator. The rule comes from harness².
- **No reruns.** A failing slot is preserved. It is not repeated until it turns green.

The baseline runs with explicit operator approval because it costs money. The cases are deliberately tiny: if the harness cannot handle them, there is nothing to discuss about large tasks.

### The first three cohorts

Same ten cases, twenty slots per cohort, 360-second deadline.

| Cohort | Bare | Deadline | Oracle | Tokens |
|---|---:|---:|---:|---:|
| 1. Baseline | 10/10 | 1/10 | 9/10 | ~847k |
| 2. Proportional | 9/10 | 1/10 | 9/10 | 458k |
| 3. MCP fix | 9/10* | 2/10 | 9/10 | ~521k |

*\*Bare produced one false closure in this cohort.*

![Three cohorts: bare, harness on deadline, and harness by oracle. The harness matches the oracle but loses on deadline; bare produces one false closure in the third cohort.](/articles/harness-agentes-cierre-verificado/benchmark-cohortes-en.svg)

*The same table as an image: the harness was not more correct on micro-tasks; it was more honest at closing.*

The table tells two stories at once.

The first is uncomfortable: on micro-tasks, the harness was not more correct than stock Pi. It was more expensive and slower. The second is the one that matters: stock Pi produced its first false closure in the third cohort. The harness, in these cohorts, produced none.

Not because the harness was smarter. Because it could not declare complete what had not been verified. The difference was not accuracy. It was honesty of closure.

Cohort 1 also produced the diagnosis that would change the project: in most timeouts, the work was already done, and in several the final JSON declaration was already in the session. The process simply would not exit. The bottleneck was neither the agent nor verification. It was closure.

## The bill: 6x, 18x, 34x

A harness that verifies costs more than one that does not. The question is how much, and whether that cost buys anything.

The October 17 pilot compared three MaltaCleaners cases across two arms. Both solved 3/3. The first reading said the harness cost six times more tokens. When we inspected the runner, we found the cause: the user's personal skills leaked only into the harness arm. With equal isolation, the real overhead was around 5% in tokens.

That mistake is the cheapest lesson in the project: **measure the arm you think you are measuring**.

On October 18 we reran with the full harness. The previous pilot had used an exclusive tool whitelist that hid extension tools, and the installer did not copy `lib/` or `vendor/` into the agent dir. In other words, for a while we measured the harness without the harness. After installing everything and using the default loadout:

| Measurement | Bare | Harness | Closures |
|---|---:|---:|---:|
| Oct 18, 3 Malta cases | 3/3 · 51,941 | 3/3 · 954,622 | 0/3 |
| Oct 19, after fixes | 3/3 · 47,313 | 3/3 · 531,014 | 2/3 |
| Oct 19, with auto-close | 3/3 · 53,701 | 3/3 · 524,979 | 3/3 |

Token counts use thousands separators. On October 18 the harness cost 18x; on October 19, 11x. That day it cut tokens by 44% and completed two of three cases. With auto-close it completed all three. The recovery/self-heal fixes and the removal of the stuck process did more than any prompt optimization.

Then came the real test: two medium cases, `booking-quote` and `cache-key`, with defects spread across several files. Both arms passed 2/2, with zero false closures. The harness spent 1,272,812 tokens against 36,847 for bare: **34x**. The thesis that overhead dilutes with task size did not hold at this scale. Verification scales with the work, so the fixed cost does not disappear; it spreads.

We also ran six cases with an external oracle; the bare arm used a fixed cheap model. Bare and harness each solved 5/6. The difference was one false closure from bare and none from the harness, at 4–5x the cost and about 3x the latency on micro-tasks.

The honest conclusion is awkward for a productivity article: **the harness is not a token optimization**. It is an assurance layer. What it buys is a verified PASS, an honest INCONCLUSIVE instead of a false closure, budgeted escalation, delivery receipts, and shared memory. On tasks where being wrong is cheap, that layer does not pay for itself. On tasks where a false closure costs money, time, or trust, it does.

## What we did right

Not everything was fixing mistakes. These are the decisions that, judged by the numbers, paid off.

- **Turn closure into an executable contract.** `review_artifact` and the closure do not accept a sentence from the model: they require a fresh PASS bound to the workspace. Across the three cohorts, the harness produced no false closures; stock Pi produced one.
- **Measure before believing.** We froze ten cases, an external oracle, P2P, a canary, a null agent, and false closures as an automatic regression. The baseline told us we were 6–10x more expensive and 1/10 on deadline. It was uncomfortable, and it is what made the redesign possible.
- **Make verification proportional.** A small diff is verified with checks; a UI requires a test, a runtime, and pixels. Proportional verification and the policy diet cut tokens by 46% in the second cohort without weakening closure.
- **Invert the effect gate.** We stopped classifying every tool as dangerous and moved safety to pre-execution guards and post-hoc verification. The agent stopped getting locked out when it needed to investigate.
- **Auto-close only on sealed evidence.** Auto-close does not invent a PASS: if there is a fresh PASS and the model does not declare closure, the system declares it with `reviewHash`, workspace, and criteria. With the prior fixes and auto-close together, the trajectory was 0/3 → 2/3 → 3/3, with no false positive.
- **Keep the PR as the human boundary.** There is no automatic merge, deploy, or publish by inference. The first real cycle ended in a PR a human approved; autonomy ends where the operator can audit.
- **Write rules as code.** Bash and edit guards, disjoint surfaces, P2P, canary, null agent. A rule that lives only in a prompt is hope; one that blocks or fails is a contract.
- **Team memory with zero configuration.** One Durable Object per repo, three native tools, and offline-first. The LRU+TTL demo saved 15% of tokens and, more importantly, exploration. n=1, but the direction is right.

## What we did wrong

These were not isolated implementation mistakes. They were design mistakes that only became visible when we measured. Each one changed a rule in the harness.

### The gate that wouldn't let the agent investigate

The first recovery design treated almost everything as a dangerous effect. Every tool had a classification; every uncertain operation waited for reconciliation. An interrupted `grep` could block the next calls. A browser read was marked unsafe. A `tab select` was confused with an action on the page.

The agent got locked out exactly when it needed to investigate its way out. The gate was not protecting the world. It was protecting the previous design's fear.

The inversion was explicit: **nothing is a tracked effect by default**. Safety comes from four places: the bash guard that blocks destructive commands before execution, the prompt policy, the git delivery layer's own reconciliation, and post-hoc verification of the artifact. Read-only bash and browser intents reconcile through self-heal when the session loads. Old checkpoints are cleared.

The lesson: a list of verbs does not understand intent. A “pause campaign” button and a date selector can share the same tool. If the gate cannot tell them apart, it is not safety. It is friction with a security label.

### The process that wouldn't exit

The exit bug was twofold.

First, the `chrome-devtools` MCP kept the Pi process alive in print mode after the agent finished. The benchmark runner switched to a clean `mcp.json`, and the problem disappeared for some cases.

Second, and deeper: after a PASS, the model sometimes did not emit its final declaration. The closing turn waited for a response that never arrived. The work was done, verification was sealed, but the process would not exit. In cohort 3, the seven remaining slots shared the same pattern: last review PASS, last transcript entry at 53–144 seconds, no `{"complete": true}`.

The fix was not to ask the model to hurry up. It was to separate “complete” from the model's text. The harness added a provider watchdog: if a turn does not respond within eight minutes, it aborts and the session continues. It also added auto-close: if there is a fresh PASS with `completionReady` and the model does not declare closure within 30 seconds, the closure declares completion on its own sealed authority—`reviewHash`, workspace, and criteria—and records it as `harness-auto-complete`.

Auto-close does not invent a PASS. It only closes when the PASS already exists. The difference between “the model says it finished” and “the system can prove it finished” is the whole project.

### The verification that was impossible

Some tasks cannot run formal verification: an environment without credentials, a downed service, a repo the snapshot cannot traverse. The agent tries, fails three times with the same request, and the gate traps it. A human has to run `/task-accept` to unblock it.

That is not autonomy. It is a waiting room.

Now, after three identical verification failures, the closure accepts completion with an honest status: “verification impossible.” It does not say PASS. It says what happened. `/task-accept` still exists for the operator who decides formal verification is unnecessary, with an audit log. And auto-waive scans the entire session history, not just the in-memory counter, so a `/reload` does not restart the trap.

The lesson: autonomy needs an honest exit. An infinite loop is not rigor. It is a way of not deciding.

### The harness that wasn't the harness

The October 17 pilot seemed to say the harness added 5% token overhead. The October 18 pilot said 18x. The difference was not a product regression: the first pilot ran the harness arm with an exclusive tool whitelist and without extensions installed in the agent dir. It measured steering and settings, not the package.

The installer also failed to copy `lib/` and `vendor/`, so a clean install could be broken. We fixed it, and batch 3 of the clean-vs-harness comparison used an installation with no manual patches.

The lesson: a benchmark measures the complete treatment or it measures nothing. And an installer that loses files is not a packaging detail; it is a measurement failure.

### Defaults are contracts

Three small mistakes that teach the same thing:

- We raised the snapshot limit from 10k to 50k files for large repos. The adaptive contract had a 20k maximum. Result: **every** baseline run failed. We aligned it with the clamp and the problem disappeared. A default is not a preference; it is a contract with the rest of the system.
- A direct DeepSeek probe returned HTTP 400 with forced tools and thinking. We read it as a harness limitation and removed the architect link. Later we discovered it was a probe artifact: Pi does not force `tool_choice`. We restored the model and verified the fallback live. The lesson: do not turn the measuring instrument into a product conclusion.
- The “Result pending verification” reminder appeared twice. It was a UX bug, not a verification bug, but the harness is software too. The fix has a test. If the system that demands proof does not test itself, it loses authority.

The pattern repeats: almost every mistake came from confusing a representation with reality. A PASS with completion. A probe with the product. A default with a preference. A gate with safety. The fix was always the same: measure the real object, not its representation.

## A real case: the coupon that arrived late

The synthetic baseline is for comparison. A real product shows whether the flow holds.

MaltaCleaners had a coupon bug: the user applied A, edited the form to B, then typed A again without reapplying, and an old response could apply the discount and erase the current error. A concurrency problem with an observable reproduction.

The operator wrote `/plan` with the failing behavior. The plan took 3:29. Author and judge had fresh context; the judge accepted the reproduction, monotonic authority, and evidence criteria. Then `/task` implemented and verified: a native baseline before editing, 28 web scenarios, 38 pure tests, types, lint, and build. The first final review was INCONCLUSIVE: it lacked proof that the wiring had not changed and that excluded states were covered. The second, with that evidence added, was PASS 4/4. Seven real images reached the judge.

Pi's activity was 29:25. The harness did not find the bug; the agent did. The harness made the correction prove itself before acceptance, and preserved the first failed review instead of hiding it.

The limits matter: the UI used synthetic APIs, D1 was not executed for this bug, and there was no deploy. The case demonstrates the mechanism, not production.

## What it buys and what it costs

The harness is not free and it is not for everything.

**What it buys**

- Zero false closures in the harness cohorts.
- Honest INCONCLUSIVE when evidence is missing.
- Sealed receipts and a PR with evidence.
- Guards that block before the effect.
- Shared memory per repo.
- Plans and reviews with fresh context.

**What it costs**

- 4–34x tokens depending on task size.
- More latency and more turns.
- Operational complexity: install, snapshots, recovery.
- An agent that sometimes looks slow because it verifies.
- One more service to operate.
- More calls and more cost on large tasks.

Shared memory deserves its own section: it is the piece that turns a session that learns into a team that learns.

The practical decision depends on the task. For a bounded fix, the simple path and checks are enough. For a pricing change, a migration, a payment flow, or anything where a false closure is expensive, the full harness pays.

## Team memory lives in Durable Objects

The harness solves one session. The team has a different problem: every session starts from zero.

A subtle bug gets diagnosed three times across three repos. A convention is rediscovered every week. The root cause someone found yesterday does not reach today's agent. Team memory cannot live in each developer's head, or in a prompt that gets lost during compaction.

We built `pi-memory`: a Cloudflare Worker with one [Durable Object](https://developers.cloudflare.com/durable-objects/) per project. Each DO has its own SQLite database and an [FTS5](https://sqlite.org/fts5.html) index; the Worker exposes `/v1/memories`, `/v1/memories/search`, and `/v1/memories/bulk`. The project is derived from the repo name. The agent gets three native tools: `memory_save`, `memory_search`, and `memory_sync`. There is also a CLI: `pi-memory save|search|list|sync|migrate-engram|status`.

Why Durable Objects? Because a DO is a logical actor with co-located storage: writes and the index live in the same place, one project cannot see another's memory, and a small team does not need a separate database service. FTS5 gives full-text search without an embeddings service; the data model is one row per learning. The convenience is deliberate: the URL and the shared team credential ship as package defaults; installing the harness is the only setup. Per-developer overrides exist, but the happy path is zero configuration.

![Memory architecture: Session A saves with memory_save, the pi-memory Worker persists to one Durable Object per repo with SQLite and FTS5, and Session B searches with memory_search.](/articles/harness-agentes-cierre-verificado/memoria-do-en.svg)

*One Durable Object per repo: writes, index, and search in the same place; the outbox covers network cuts.*

Offline-first is part of the design too: if the Worker is unreachable, `memory_save` writes to `~/.pi/agent/memory-outbox.jsonl`; `memory_sync` replays when the network returns. A cut does not lose the learning. Memory can be migrated from Engram with `migrate-engram`.

The result was measured in a mechanism demo, not a benchmark: one session solved an LRU+TTL bug from scratch (17 requests, 178,827 tokens, 8 bash calls, 4 reads); another session, with the lesson saved, reached the same PASS with 18 requests, 152,352 tokens, and only 3 bash calls and 1 read. That is 15% fewer tokens and, more importantly, less exploration. n=1. But the direction is right: team knowledge accumulates in the repo, not in each agent's head.

The costs and limits: one more service to operate; the shared credential and the package must be treated as sensitive material (the repo stays private); memory is not a place for secrets, credentials, or transient state; the outbox is eventually consistent; the DO free tier is enough for a small team, but not infinite; and a lesson that can be expressed as code belongs in code, not memory. Memory does not replace tests, guards, or verification.

The connection to harness²: the typed lesson library (cue/lesson/evidence/confidence) and the outcome corpus are the verifiable version of the same idea. `memory_save` is for operational learning; the library is for lessons that survive a contrast. The first already works; the second is a skeleton and needs ~30 real tasks and 3 contrasted adoptions to stop being a demo.

## What comes next

The goal has not changed: **ticket → PR with human approval**.

What remains is the hardest part to prove:

- **Cohort 4.** Repeat the baseline on medium and large tasks, with multiple repetitions and external oracles. The current cohorts are ten tiny cases and one repetition; they do not support a general claim.
- **Automatic worktrees per task.** Today worktree hygiene is manual (`npm run worktrees`), although the disjoint-surface design is in place. Automating it will allow parallel agents without stepping on each other.
- **External verification.** `open_pr` with `gh` and a real `origin` has not yet run end-to-end; tests cover contracts, gates, and temporary repos. The next step is a real ticket, a real PR, and a real human approval.
- **Outcome metrics.** The outcome corpus and lesson library exist, but they need volume to stop being a demo.
- **Team learning.** Shared memory already works; the lesson library needs ~30 real tasks and 3 contrasted adoptions. It is the part of harness² we can actually afford.
- **Team packaging.** Shared memory and install-and-forget already work; the full flow still needs to be equally simple for every developer.

And there are things we will not do by inference: publish, deploy, delete data, or approve a PR without a human. Autonomy ends at the boundary the operator can audit.

## The right question

The conversation about agents usually centers on the model: which one reasons better, which one writes more code, which one costs less.

My experience with pi-harness left me with a different question: **what evidence do we require before believing it?**

An agent can be brilliant and close badly. It can pass the tests without ever seeing the screen. It can say “done” because saying “done” is free. The harness does not make it smarter. It makes its success verifiable.

This article is not the story of a harness that turned out well. It is the story of a harness that became honest through measurement.

The first benchmark taught me that the problem was not the code. It was closure. Since then, every decision in the project—the free profile, fresh judges, proportional verification, auto-close, inverting the gate, shared memory—answers the same idea:

**Do not accept “done” as a result. Accept evidence.**

## Sources

These are the primary sources that informed the design. This is not a decorative bibliography: each one changed a concrete decision. The sources were pinned to commits in the internal plans; the ideas were adapted, not pasted.

**Papers and specifications**

- **harness²** — Google Research. [arXiv:2610.14224](https://arxiv.org/abs/2610.14224) · [repo](https://github.com/google-research/harness2). None-never-zero, the typed lesson library, causal retention, and anti-leak tripwires came from here. We did not adopt full recursion.
- **SWE-agent** — Yang et al. [arXiv:2405.15793](https://arxiv.org/abs/2405.15793). The ACI and the edit guardrail: an invalid edit must never land. It is the origin of `edit-guard`.
- **SWE-bench** — Jimenez et al. [arXiv:2310.06770](https://arxiv.org/abs/2310.06770). Real tasks, FAIL-to-PASS and PASS-to-PASS. It is the conceptual basis of the frozen baseline.
- **LiveCodeBench** — Jain et al. [arXiv:2403.07974](https://arxiv.org/abs/2403.07974). Time-segmented evaluation and contamination. It inspired case rotation; the canary came from BIG-bench.
- **BIG-bench** — Srivastava et al. [arXiv:2206.04615](https://arxiv.org/abs/2206.04615). The canary GUID we use to detect contamination.
- **Berkeley RDI, “How We Broke Top AI Agent Benchmarks”** — [blog](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/). Grader outside the container, null-agent floor, and reward hacking. It inspired the external oracle and the null agent.
- **METR Task Standard** — [spec](https://github.com/METR/task-standard). Deterministic scoring and reproducible containers; the frozen protocol.
- **Harness Learning Enables Generalizable Test-Time Adaptation** — Zhang et al. [arXiv:2609.35738](https://arxiv.org/pdf/2609.35738). The idea that the harness, not only the model, is the object of improvement. It is the paper behind this site's previous article.

**Engineering references**

- **pstack** — [repo](https://github.com/cursor/plugins/tree/main/pstack). “Done means X,” bug/feature playbooks, verification as infrastructure.
- **gentle-shell/gentle-pi** — [repo](https://github.com/Gentleman-Programming/gentle-shell). ODD, proportional sizing, risk-based review, delegation by reason.

*External sources inform the design; they do not certify our results.*

---

*Method note: the figures in this article come from pi-harness's internal cohorts and pilots (October 2026). The cohorts are ten synthetic cases × two arms × one repetition; the Malta pilots are 3–6 cases. They are not a statistical benchmark or a general comparison with other harnesses. The repo is private; the technical details cited here live in its internal documentation.*
