---
title: "The AI Model That Can't Write (and Why I Want It in Production)"
description: "I tested Jev, TypeSafe's first System One model: no text generation, just typed decisions. 292 cases, blind review, and 94.2% accuracy classifying a real cleaning company's WhatsApp."
lang: "en"
routeSlug: "typesafe-jev"
tags: ["integracion-ia", "llm", "evaluacion", "arquitectura", "automatizacion"]
publishedDate: 2026-09-19
draft: false
ogImage: "/articles/typesafe-jev/og-en.png"
---

This week I tested an AI model that cannot generate a single word. Not even “hello.” That is exactly why I want it in production.

It is called [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), it comes from [TypeSafe AI](https://docs.typesafe.ai/), and it is the first example of a new class they call **System One Models** (after Kahneman’s System 1: fast, intuitive thought). The thesis is simple and provocative: today’s LLMs are superhuman at writing, but real automation needs something else—**structured decisions that software can use directly**.

Jev does not generate text. It receives a state (a message, JSON, context) and a set of typed questions, then returns structured answers: a choice with its probability distribution, a score against a rubric, or a yes/no answer with a probability. Everything runs in parallel in one call, with no hallucinated structure—the type is guaranteed by construction. The name comes from William Stanley Jevons: every order-of-magnitude reduction in the cost of intelligence enables orders of magnitude of new use cases.

![Comparison between a System 2 LLM that produces free text and a System 1 Jev model that returns typed decisions](/articles/typesafe-jev/sistema-1-vs-sistema-2-en.svg)

*These are not competing models: the LLM keeps the reasoning and writing work; Jev handles structured decisions in an output shape that code can consume directly. On small screens, swipe charts horizontally to see them in full.*

## Why a cleaning company should care

My test case is real: the booking WhatsApp for [MaltaClean](https://malta-cleaners.com)—a cleaning company I automate ([full case study](/en/work/maltacleaners/))—is handled by an autonomous concierge. Every conversation turn goes through a contextual classifier with **24 intent categories** (quote, cancellation, receipt, job applicant, human request, complaint, and so on).

What would a model like this improve here? Nothing science-fictional—just the three things that hurt in any service business:

**1. Classify prospective customers better.** The real volume is about 10 commercially motivated conversations per day, with an average ticket of €112. Every lead message that the bot misclassifies or leaves as `unclear` is a quote that nobody answered in time. Job-applicant detection (which currently pollutes the sales pipeline) already measures **99.7%** accuracy, and “is this urgent / does it mention a date / does the customer want to cancel?” clears 95%.

**2. Keep the concierge from going down.** The worst incident of the year was not a content error: it was **five days with no valid classification** (19–29 August: 34% of the month’s turns fell back to the generic fallback because the LLM chain stopped responding correctly). A model whose output is typed by construction attacks that exact failure mode—it cannot return structurally invalid output.

**3. Escalate to people only when necessary.** Today, 21% of turns end in `unclear`, and roughly 659 conversations over six weeks were sent to a person. With real calibration (“needs a human now: 0.91”), code can branch confidently: *this is a complaint AND they want a human NOW* → escalate; the bot can handle the rest. Verifying every LLM decision with a second opinion costs about $0.06 per month at this volume.

A necessary caveat: at this volume, the classifier’s direct cost is $4–11 per month—the argument is **not saving money**. The current complete chain is estimated at **~$0.002–0.006 per turn**, while Jev’s **~$0.000062** measures a semantic classification **per decision**. Those are not interchangeable units. The business case is reliability, calibrated routing, and correct decisions—not a simplistic cost comparison.

## The experiment: 292 cases, quantified gates

I assembled an offline evaluation with a stratified synthetic corpus (zero real customer data; the evaluation ran on synthetic data): **292 cases** that cost **$0.02** in total, with numerical gates defined before running anything.

First came the initial smoke test that got my hopes up—five perfect cases out of five:

| Message | Intent (confidence) | Extra signal |
| --- | --- | --- |
| “How much is a deep cleaning before Friday?” | `pricing` (0.75) | mentions a date: 0.98 |
| “I’m a cleaner with 4 years of experience—are you hiring?” | `recruitment_review` (1.0) | job applicant: 0.98 |
| “Cancel Tuesday; I might book again later” | `cancel_request` (1.0) | mentions a date: 0.97 |
| “Hmm, okay, thanks” | `unclear` (1.0) | honestly uncertain ✓ |
| “This is unacceptable. I want to speak to a PERSON.” | `complaint` (0.89) | needs a human: **0.91** |

The interesting number is in the last row: `complaint` 0.89 **+** `human_request` as runner-up **+** “needs a human now” 0.91. No single label captures that. A generated sentence such as “the customer is upset” throws away the multidimensional signal; a distribution over atomic decisions gives your code exactly what it needs to branch.

Then came the paired comparison against the real production classifier (DeepSeek → GLM → Gemini) on those same 292 cases:

- **Clean subset (a fair fight, with no customer context on either side): Jev 85.1% vs. production 65.7%**
- Context-dependent categories: 89.4% vs. 68.1%
- Ambiguous categories: production wins here (80.8% vs. 75.6%)
- Agreement between the two: just 69.9%—**50 cases where Jev is right and production is not**

![Bar chart comparing Jev and the production classifier's accuracy on the same corpus](/articles/typesafe-jev/precision-comparada-en.svg)

*The clean subset removes context bias: the production classifier dry run could not pass customer context for 117 cases in the full corpus.*

## The audit I almost skipped (and why it was mandatory)

There was an uncomfortable methodological problem: **the same agent had written the labels and Jev’s rubric**. Correlated bias was guaranteed. The standard solution was a blind second annotator from another model family, seeing only the taxonomy and none of my labels. All 292 cases were annotated blindly.

The result: 86.6% agreement on intent, 99.7% on emotion, and zero disagreements on “is this a job applicant?” The uncomfortable finding was that, when recalculated against the independent annotator’s truth, Jev’s advantage **grew** (86.6% vs. 72.3% = +14.3pp). If my bias existed, it was conservative.

The best part came from a third model used as a blind tie-breaker in the 39 disputes: adjudication revealed that **several of Jev’s “failures” were my labeling errors**—I had marked `date: no` on messages that said “Saturday” or “6pm.” After correcting my own work, the date signal rose from 80.1% to **95.5%**. The methodological lesson: audit your labels before you audit a model.

## From 15.6% to 71.4%: redesigning the questions

Mixed intent (“I want to cancel, but I will book again”) was the most productive failure. Version one achieved **15.6%** against a 70% gate. The autopsy found the technical moral of the entire article: **the distribution of an exclusive question expresses “what this resembles,” not “what else the customer wants.”** Multi-label work needs yes/no questions by intent family—the TypeSafe docs said this explicitly, and I ignored it because an early smoke test got lucky.

V2 added six binary questions (`wants_cancellation`, `wants_new_booking`, `mentions_payment`, and so on) plus corrected rubrics. Result: **71.4%**, clearing the gate. One confession: the gate measured 44.4% for hours until I discovered that the bug was in **my evaluation code**, not the model—17 mixed cases without derivable families were counted as failures by design. When a number looks wrong, audit your instrument before you audit the model.

![Mixed intent rose from 15.6 percent to 71.4 percent when the questions were redesigned without changing the model](/articles/typesafe-jev/intencion-mezcla-en.svg)

*The model did not change: an exclusive question answers “what this resembles”; questions by family can capture what else the customer wants.*

## The final state

The final gate measured latency on the real production path (a Worker on Cloudflare’s network → `typesafe/jev` through Workers AI, the same serving layer used by AI Gateway): **p50 322ms, p95 457ms**. The shorter network path halves the direct API’s 566–651ms from Europe. Parity was 12/12: exactly the same model we evaluated.

| Gate | Result |
| --- | --- |
| Overall intent | **94.2%** (current chain: 79.5%) |
| Clear / ambiguous / context | 95.3% / 91.0% / 89.6% |
| Multi-label mixed intent | 71.4% |
| Emotion ±1 level | 97.9% |
| “Is this a job applicant?” | 99.7% |
| Calibration | within range |
| Cost per decision | ~$0.000062 |
| p95 latency (production path) | 457ms |

What I **did not** do is also documented: I did not use real customer data—everything ran on synthetic data—and the 89.6% on context categories is a statistical tie with the threshold, not a win. Phase 2—Jev classifying in shadow alongside production on real traffic—is the next chapter.

## How to adopt it (if the numbers hold)

![Concierge cascade diagram: Jev handles high-confidence cases, the LLM reasons about ambiguous cases, and a human receives exceptions](/articles/typesafe-jev/cascada-concierge-en.svg)

*The architecture does not replace the concierge: it gives it a layer of fast, verifiable decisions before spending reasoning time or human attention.*

1. **Shadow first:** Jev classifies in parallel with production, with no effects. Measure agreement, calibration, and latency on real volume.
2. **Cascade next:** Jev resolves the easy mass with high confidence; ambiguous work escalates to the LLM. The LLM shifts from “classifier for everything” to “reasoner for hard cases.”
3. **A cheap verifier:** a second opinion costing fractions of a cent for every classification. If they disagree, it goes to human review—precisely the kind of routing error that loses leads.

## The thesis

I do not think this replaces LLMs. I think it completes the stack. We have expensive, slow models that reason and write brilliantly, and now the promise of cheap, calibrated models that decide quickly. The interesting architecture is not “one or the other”: it is **a cascade where every decision pays for the intelligence it needs**.

After 292 cases, I stopped asking *whether* this fits an ordinary business and started asking *where, exactly*.

The question I leave myself—and anyone reading this—with is: how many LLM calls in your system are actually System One questions that you are paying for as though they were System Two?
