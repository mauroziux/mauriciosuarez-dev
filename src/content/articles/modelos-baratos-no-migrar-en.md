---
title: "We tested cheaper models and decided not to migrate."
description: "A migration promised to simplify MaltaClean's concierge and lower the cost of each classification. Eight test cases showed why the savings weren't enough."
lang: "en"
routeSlug: "modelos-baratos-no-migrar"
tags: ["integracion-ia", "evaluacion", "arquitectura", "seguridad"]
publishedDate: 2026-09-24
draft: false
ogImage: "/articles/modelos-baratos-no-migrar/hero-decision-en.jpg"
---

The proposal was hard to turn down: fewer providers, fewer moving parts to maintain, and AI models with a very low estimated cost. Then a number appeared in the classifier test for [MaltaClean](/en/work/maltacleaners/): **the best candidate got the format, decision, and category right together in only four of eight cases**.

No customer received those replies. We were testing a possible migration in an evaluation setting, not changing the production bot. But the result changed the question. It was no longer “how much would we save per model call?” It was “which wrong decisions would we accept in exchange?”

## The offer was simplification, not just a lower bill

In August 2026, we considered replacing the models that interpreted concierge messages with alternatives hosted on Workers AI. The idea was to shorten the provider chain and bring text, audio, and image processing closer to a single control plane. Published prices made the *per-turn* estimate attractive; we did not yet have a comparison of actual bills showing net savings.

The classifier does not write bookings or verify payments. It proposes what a message means and which path to take: reply, ask for details, or hand the case to a person. Code then checks permissions, state, and effects. That separation, which I described in [the article about intent and authorization](/en/writing/modelo-entiende-codigo-decide-permiso/), limits the damage from a bad output. **It does not make a wrong classification harmless**: a label can still determine whether someone gets help or an inappropriate automated reply.

That is why comparing prices per million tokens was not enough. We had to test the candidates against decisions the system already knew how to evaluate.

## Eight cases, four candidates, one clear signal

On August 7, we ran the classifier prompt against eight text cases from the evaluation corpus, each with an expected decision and category. We excluded two cases the system blocks before calling a model and one image case that had no visual asset for this test. In the comparable round, four non-reasoning models received the same eight cases.

The **critical measure** required three things at once: JSON with the required fields, the expected decision, and the expected category. It did not measure a sale, a full conversation, or what happened to a customer afterward.

![August 7 test chart: combined format, decision, and category matches out of eight were 4 for Llama 4 Scout, 3 for Mistral Small 3.1, 2 for Llama 3.3 70B, and 1 for GPT-OSS 20B](/articles/modelos-baratos-no-migrar/benchmark-clasificador-en.svg)

*Internal test on August 7, 2026. Eight cases scored per model; each bar counts joint matches for format, decision, and category. This is neither a production error rate nor a population estimate.*

Llama 4 Scout, the strongest candidate in that round, scored **4/8** on the critical measure and **7/8** on valid JSON with the required fields. Mistral Small 3.1 scored **3/8** on the critical measure despite returning valid JSON in **8/8** cases. That gap matters: a message can be packaged perfectly and still go down the wrong path.

We also tried two reasoning variants in an earlier round of ten cases. They are not on this chart: the denominator was different, and their format and latency problems were assessed separately. The chart compares only candidates tested on the same eight cases.

## The reply that should have waited for a person

One evaluation case asked about a cleaning job and a work permit. The expected path was **escalation to an operator**. Three of the four candidates in the eight-case round chose to reply automatically instead.

This is not a real customer message that the concierge sent or a quotation from a person. It was a test case. That is precisely why such a case matters: it exposes a decision you do not want to discover after deployment. A fluent reply may look like helpful service while bypassing the review the team had defined for that situation.

In another kind of case, asking for details to prepare a quote and answering immediately are not the same decision. Some label differences may warrant human discussion; the recruitment path was harder to dismiss. **The problem was not that the model was cheap. It was that the savings depended on giving it authority the test did not justify.**

## Fixing the JSON did not fix the judgment

There was a fair objection: what if a strict JSON schema improved the result? We retested the two strongest candidates. Both produced valid JSON with the required fields in **8/8** cases. Yet Llama 4 Scout fell from **4/8 to 2/8** on the critical measure; Mistral Small 3.1 stayed at **3/8**.

A schema can stop a model from inventing a category outside the allowed list. It cannot guarantee the right choice between “reply,” “ask for information,” and “escalate.” Mistaking valid format for sound judgment would have made a cleaner demo, not a more reliable classifier.

## Even a no-go decision needs boundaries

The August decision was **not to migrate the authoritative text classifier to those Workers AI candidates in that configuration**. It was not a veto on the platform or proof that no future model could work. Other uses, such as transcription or tools that do not decide a customer's outcome, need their own evaluations; approving them would not amount to promoting the classifier.

Nor should we turn eight cases into a grand statistic. The production promotion criteria called for at least **99.9%** valid, guarded classification — or safe escalation — and **99.9%** schema validity, alongside safety checks. The spike's critical measure was a narrower filter, not that same operational metric. Eight examples cannot certify a 99.9% threshold or estimate a production error rate. The prompt was the production prompt tuned for the previous models; an adapted prompt could change the results. We did not run the incumbents as a baseline on those same cases, either: the test ruled out promoting what we tried, but it did not measure a percentage advantage between providers.

If we revisited the migration, I would ask for five things before discussing savings:

1. A larger corpus with risk-sensitive decisions and expected outcomes, including cases that **must** reach a person.
2. Format validity and semantic decisions measured separately; correct JSON is not enough.
3. Candidates and incumbents run on the same cases under comparable conditions.
4. Cost per **valid turn**, including retries and escalations, not just price per token.
5. Evidence on privacy, latency, and rollback before trusting the system with real traffic.

The test did not show that the old architecture was perfect or that cheaper models were useless. It showed something more specific: **the cheaper offer had not yet earned the right to decide which conversations could be handled without a person**. That day, choosing not to migrate was progress.
