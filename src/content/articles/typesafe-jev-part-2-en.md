---
title: "Jev in Production: 703 Turns Later, Still a Complement"
description: "Across 703 real WhatsApp turns, Jev responded in 128 of 131 main-classifier failures: new shadow-mode signals, not a proven replacement."
lang: "en"
routeSlug: "typesafe-jev-part-2"
tags: ["integracion-ia", "llm", "evaluacion", "arquitectura", "automatizacion"]
publishedDate: 2026-10-02
draft: false
ogImage: "/articles/typesafe-jev/hero-jev-produccion-en.png"
---

In [Part 1](/en/writing/typesafe-jev/), I tested Jev, TypeSafe’s model that returns structured decisions instead of writing replies. After 292 synthetic cases, the results looked promising: 94.2% intent accuracy under our evaluation criteria and a p95 latency of 457 ms in a Workers AI probe.

I left myself one task: run it alongside [MaltaClean](https://malta-cleaners.com)’s concierge on real conversations and report what happened.

We now have an eleven-day snapshot: **703 WhatsApp turns from 105 distinct phone numbers**, from September 20 to October 1. The conclusion is less spectacular than the laboratory result, but more useful: **I have no evidence for replacing the LLM. I do have reasons to keep evaluating Jev as a complement, especially when the main pipeline fails.** The latest days strengthened that hypothesis: on September 30, Jev returned classifications for all 45 recorded turns, although none matched the main pipeline’s final category.

One warning matters more than any percentage: two models disagreeing does not, by itself, tell you which one is right.

## What we put into production—and what we did not

Jev ran in *shadow mode*: it receives a version of the context and classifies alongside the existing system. We record labels, probabilities, latency, and errors. Its output does not change the message the customer receives, create bookings, or authorize any action.

The LLM continued handling customers. Jev observed.

That lets us study disagreements without turning customers into subjects of a routing experiment. It also limits what I can conclude: **this trial does not show that Jev increased sales, reduced waiting times, or prevented a bad reply. We did not give it the opportunity to produce those effects.**

The comparison table stores no names, phone numbers, or messages. To count distinct phone numbers, we used an internal join and exported only the aggregate. I am not publishing customer conversations to illustrate the experiment.

## The number that would be easy to misreport

On September 26, we revised the questions: clarified the boundaries between pricing, quotes, and availability; tightened the requirement for confirming a proposal; and added a category for conversations directed at the wrong business.

The observed model remained `jev-1.13.0`. The questions did not stay the same.

So I separated the results:

| Measurement | Earlier rows, unversioned | Question set 2.2.0 |
| --- | ---: | ---: |
| Recorded turns | 367 | 336 |
| Jev classifications received and parsed | 343 | 326 |
| Exact agreement with the main pipeline | 52.2% | 26.7% |
| Agreement when the pipeline completed as `provider_valid` | 51.5% | 42.6% |
| Jev p50 / p95 latency, successful responses only | 545 / 1119 ms | 548 / 1220 ms |

An easy headline would be: “Jev went from 94% to 27%.”

**It would be wrong.** The laboratory’s 94.2% measures accuracy against labels in the synthetic corpus. The real-world 26.7% measures agreement with another system. Those are not the same metric. If Jev gets something right where the LLM fails, agreement falls. If both make the same mistake, agreement rises.

Here, much of the fall in agreement involved the comparator, not evidence of Jev getting worse: the 2.2.0 segment contained **131 turns where the main pipeline reported that the provider was unavailable** and returned its generic fallback label. September 30 had 45 turns and zero matches. That aggregate establishes disagreement, not that every LLM classification was invalid or that Jev was right. When the pipeline did complete as `provider_valid`, agreement was 42.6%, close to the earlier snapshot’s 43.9%.

Nor can I say that the new questions made the model worse: the traffic changed, and the comparator suffered a substantial degradation.

## When the LLM did not respond, Jev often did

This is the finding the additional days made impossible to ignore.

With question set 2.2.0, there were **131 turns where the main pipeline reported that the provider was unavailable**. Jev returned a classification in **128 of those 131: 97.7% availability within that subset**. It failed on only three, with transport errors.

![During 131 turns with the main provider unavailable, Jev returned classifications in 128, proposing specific categories](/articles/typesafe-jev/triage-durante-caida-en.svg)

*What Jev proposed while the system could only say “unclear”: quotes, complaints, payments. Being more specific than a fallback does not prove correctness.*

In those 131 cases, the main system fell back to a generic label. Jev proposed more specific categories: quotes, complaints, booking updates, payments, or conversations meant for another business, among others. The pipeline escalated **171 of the segment’s 326 comparable decisions to a person (52%)**. That is the total escalation count, not 171 provider failures.

This explains much of the low agreement: we were comparing a Jev decision against a fallback label, not an actual semantic decision from the LLM.

But returning an answer is not the same as being right. **I have not shown that those 128 classifications were correct**, or that they would have led to better customer service. Both paths also share Cloudflare/Gateway infrastructure: this is not demonstrated redundancy against every kind of outage.

What changes is where to look for value. The question is no longer “Can Jev classify everything first?” but “Can it provide useful triage when the main system has no valid classification?” September 30 gave us 45 Jev outputs to investigate. Whether they were better for the customer remains a hypothesis.

## Speed and cost: what I am comparing—and what I am not

![Side-by-side timing and cost figures: the LLM chain’s earlier p50 was 3.78 seconds and Jev’s was 0.55 seconds; estimated whole-turn chain cost was $0.002–0.006 versus $0.000081 per synthetic Jev case](/articles/typesafe-jev/velocidad-coste-en.svg)

*The chain does more work than Jev—response drafts, facts, validation—so this is not a fair race. For evaluating a possible backup signal, the shorter recorded Jev call is interesting, but it is not proof of faster customer service or equivalent work at a lower cost.*

The numbers, with their asterisks:

- **Time to a valid classification.** For `provider_valid` executions, the classifier ledger measures claim→pin per logical turn: the earlier segment had **p50 of 3.78 s and p95 of 4.79 s**; the 2.2.0 segment, during degradation, had **p50 of 14.5 s**. That interval includes pipeline work and any retries, not just inference. Jev times its REST call for successful responses: **p50 of 548 ms and p95 of 1220 ms**. Dividing those medians gives roughly **7× and 26×**, but compares different tasks, cohorts, and timers: it does not establish an equivalent model-only speedup or a reduction in the time customers experience.
- **Cost figures.** Part 1 estimated the complete chain at **$0.002–0.006 per whole turn**. Jev measured **$0.000081 per case** on the synthetic corpus (published price: $0.042 per million input tokens, no output charge). The arithmetic ratio is roughly **25–75×**, not measured savings: it compares an estimated complete turn with a measured synthetic classification. The shadow integration does not persist actual token usage, so I have neither a measured bill for this window nor a validated production savings figure.

## Small questions make more sense than a big router

### Is this person looking for a job?

In the current segment, the pipeline labeled 26 turns as recruitment. Jev’s binary question flagged **all 26**. It also flagged seven additional turns.

That is strong corroboration of a distinction that matters to a service business: someone who wants to work for you is not a lead who wants to buy.

But those seven additional cases are still disagreements to review, not demonstrated false positives. The LLM does not become human ground truth just because it is the system we already had.

### Does this person need a human now?

At a threshold of 0.7, Jev flagged 35 turns. The pipeline was already escalating **34 of them**.

In other words, it confirms much more than it discovers. The pipeline escalated 171 turns in that segment, largely during degradation; Jev’s signal overlaps with only 34 of those 171. It cannot replace the full handoff mechanism.

Lowering the threshold to 0.5 surfaces twelve turns the pipeline did not escalate. That is where independent review is needed: they might be problems we missed, or unnecessary alerts.

**A second opinion is valuable when it separates useful error detection from noise—not merely when it produces another probability.**

## One lesson that came back: the question matters

The `ready_to_auto_propose` signal was too loosely defined. Previously, it flagged 152 of 343 turns as positive: **44.3%**, including escalated or ignored turns.

After requiring explicit confirmation of a specific proposal, it flags 26 of 326: **8.0%**.

That is a big change. We did not change the model; we changed what we asked it to decide. I do not attribute the whole difference to wording: the traffic changed too.

This still does not prove that the signal is accurate: we need to review the original confirmations and the cases it stopped flagging. But it shows why a perfectly typed output can still be semantically unsuitable.

“Wants to book” and “Has confirmed this proposal” are not the same question. And no probability, by itself, authorizes a booking.

## What I had to correct in my own evaluation

The trial exposed limitations in the instrument, not just in Jev.

**The inputs are not fully equivalent.** Shadow mode shares textual history and booking context, but does not receive all the operational context or the image pixels the LLM processes. Some final categories are also code-level decisions that Jev cannot even emit.

**Confidence is not demonstrated calibration.** Higher reported confidence is associated with higher agreement with the comparator—from 9.0% below 0.5 to 41.9% at 0.9 or above—but verifying calibration requires independent labels on the real messages, not agreement with the comparator. Pipeline fallbacks contaminate every bucket.

![Exact agreement between Jev and the pipeline rises with reported confidence, from 9.0% to 41.9%](/articles/typesafe-jev/acuerdo-confianza-en.svg)

*The slope exists; calibration remains unproven. The 41.9% is agreement in the ≥0.9 confidence bucket, not accuracy against human labels. It neither demonstrates calibration nor establishes that the probabilities are wrong.*

**Typed output is not end-to-end availability.** We recorded 34 errors: 20 were `missing_answers`, associated with the documented adapter bug during startup; the rest were transport or HTTP failures. The model can promise an output shape while my integration reads it incorrectly.

**Cheap does not mean free.** Cloudflare publishes a price of $0.042 per million input tokens, with no output charge. We did not store token consumption for shadow mode, so I have no measured bill for this window. I will not turn the synthetic corpus cost into an exact real-traffic figure.

**Parallel does not mean zero added latency.** The runtime waits for the shadow result for a bounded period after the classifier, and also waits for its D1 write. We recorded no timeouts for that wait, but that does not prove it never added milliseconds. Jev’s real-traffic p95 was 1220 ms with the current questions; the earlier article’s 457 ms came from a different benchmark, with synthetic states and a different execution path.

## So: is it useful or not?

My decision today is specific:

- **As a replacement or a router ahead of the LLM: I am not adopting it on this evidence.**
- **As a second opinion for investigating errors: it deserves to remain in shadow mode.**
- **As auxiliary triage during failures: this is the hypothesis with the strongest new signal, but we still have to show that it classifies correctly.**

I would not send every disagreement to a human either: with the current questions, that would be 73.3% of comparable responses. A verifier that turns almost everything into manual review can add work instead of removing it.

We have eleven days of observation and 703 turns—the volume we set for closing the phase, though not the two-week duration. The new questions have been running for less than a week. But waiting for more days without reviewing cases will not answer the main question.

The missing step is an independently reviewed real-world evaluation set: agreements, disagreements, pipeline failures, and binary questions, with enough history and facts to judge them. Not just the most striking examples.

Then we need to measure something the business cares about: correct triage, fewer useless alerts, or less time until effective attention. Not merely a matrix of two models arguing.

## The thesis, adjusted

In Part 1, I wrote that Jev could complete the stack. I still see that possibility, but with a clearer condition:

**A typed output guarantees the shape of a decision—not its truth, or the value of acting on it.**

The laboratory convinced me to try it. Real traffic showed me that I do not yet have grounds to hand it control. I do have a more specific place to evaluate it: small decisions and a second source of signals when the main path fails.

That is the result of Part 2. Not “Jev won.” Not “Jev is useless.” **An experimental complement, with promising signals and limits we can now measure.**

---

### Sources and method

- [Part 1: TypeSafe Jev](/en/writing/typesafe-jev/).
- [Cloudflare model page and pricing](https://developers.cloudflare.com/ai/models/typesafe/jev/), accessed September 30, 2026.
- Read-only D1 extract: requested window [September 20, 00:00:00, October 2, 17:30:00) UTC. The last observed shadow row is October 1 at 15:43:33 UTC. We matched 703 shadow rows to 761 classifier executions; 58 later executions had no shadow row. There were no orphan shadow rows. We do not know why those rows were absent.
- The 703 covered turns belong to 105 phone numbers, not 703 independent observations. There were 669 comparable responses and 34 errors. Separate question sets; no A/B test or new independent human labels. Chain latency: claim→pin in the execution ledger for `provider_valid` executions, including pipeline work and any retries. Jev latency: its REST-call timer for successful responses. The cohorts and measurement scopes differ.
- Data extracted on October 2, 2026. The first snapshot, from September 30, contained 623 turns; this update adds 80 shadow rows, not new observations covering all of October 2.
