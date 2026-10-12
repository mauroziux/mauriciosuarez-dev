---
title: "Harness learning: is the model to blame?"
description: "Harness learning aims to improve AI agents by revising their workflow. What the paper shows, and what to check before switching models."
lang: "en"
routeSlug: "harness-learning-mejorar-agentes-ia"
tags: ["integracion-ia", "evaluacion", "arquitectura"]
publishedDate: 2026-10-12
draft: false
ogImage: "/articles/harness-learning-mejorar-agentes-ia/hero-en.png"
---

Your agent gives a bad answer. The quickest reaction is to try another model.

Before doing that, I'd inspect one call: the one that produces the final answer. **What evidence did it receive?**

In the question-answering experiments over documents in [*Harness Learning Enables Generalizable Test-Time Adaptation*](https://arxiv.org/pdf/2609.35738), the starting workflow retrieves documents, summarizes them, and uses those summaries both to continue searching and to answer.

A common revision changes that path: summaries still guide the next search, but the call that answers receives the **original passages**. The summary keeps doing its job. It stops standing in for the source.

That distinction matters. A summary that's useful for searching can leave out a condition needed to answer. And a more capable model isn't guaranteed to get it right if that condition never reaches its context.

The paper doesn't measure the isolated effect of that change. Its question is broader: can a model learn to revise an agent's procedure from its failures, and do that on new tasks too?

That's where *harness learning* begins. And where an engineering question deserves an answer before you open another pricing tab.

## What harness learning changes in an agent

A model takes an input and produces an output. An agent adds decisions around it: when to query a tool, how to incorporate its result, what to retain from the history, when to verify an answer, and when to try again.

The paper calls the executable program that organizes these operations a *harness*. Here, I'll call it the **orchestration layer**. It includes prompts, but also code, control flow, tools, and the movement of information.

Asking a model to calculate an answer from memory isn't the same as letting it write and execute a calculation. Nor is answering from a full document the same as answering from a summary that may have dropped an important condition. The model can be identical. The system we build around it isn't.

In [the article about our MCP server](/en/writing/mcp-operadores-admin/), I described how we connect operators to narrowly scoped MaltaClean functions. That protocol solves part of the integration problem: discovering and invoking tools. This paper asks a different question: **can a model learn to revise the program that decides how to use them?**

Having a tool available and using it well are different problems.

## The editor learns; the solver stays fixed

The authors separate two roles:

- The **solver model** answers questions through the current orchestration layer.
- The **editor model**, which they call the *proposer*, receives the task, the layer's code, and an execution report. Its output is a modification to the program.

The editor doesn't just say "reason better." It can change which calls happen, add a check, or reorganize the information the solver receives. The proposed program is then executed and its results evaluated.

The loop starts by running the current workflow on development questions. The editor receives the code and results report and proposes modifications. The system executes and evaluates the resulting programs. Selection according to the experiment's protocol determines which code goes into the next round.

**Training rewards the editor for what its proposed program achieves**, not for how convincing its explanation sounds. It learns a way to revise that can then be applied to new tasks.

In the reasoning experiments, the authors first train it on successful revisions from a teacher model, then use reinforcement learning. For question answering over documents, they use reinforcement learning directly from the base model. The reward depends on the revised program's performance; the protocols also account for its validity and execution.

One distinction matters: **there is prior training**. During adaptation to a new task, the parameters of both models stay fixed. The editor keeps changing the program, not its own weights or the solver's.

So "improving without changing the model" doesn't mean "improving without training, testing, or cost."

![Adaptation loop: run the current code, give its report to the editor, test the changes, and select the code for the next round. Both the solver's and the editor's weights stay fixed.](/articles/harness-learning-mejorar-agentes-ia/ciclo-revision-en.svg)

*Adaptation loop described in Section 4.2. The editor is trained beforehand; here it changes code, not weights. Selection depends on the protocol and doesn't guarantee that every round improves.*

## The gain matters. So does the baseline

In Reasoning Gym, a collection of synthetic reasoning tasks, the headline result is an increase from **0.32 to 0.62** in the mean score of individual revisions across 21 task families that weren't seen during the editor's training. These scores use **format-varied questions**: the same tasks presented in alternative formats.

The comparison is between proposals from the **base editor** and the **trained editor**, with the solver held fixed. They evaluate eight independent revisions per family on 75 held-out questions, separate from those used for feedback and selection during adaptation. This isn't simply an agent's score before and after a change, or a production success rate.

The denominator matters too. Appendix B.1 explains that the main comparison excludes five families that are difficult for the evaluated models. Across **all 26 unseen families**, the mean goes from **0.282 to 0.528**. The gain is still there, but smaller than the headline figure.

And there's a baseline that deserves to come out of the appendix: on those 21 families, a fixed workflow that allows Python execution for up to five turns scores **0.69**, compared with the trained editor's mean revision score of **0.62**, according to Table 9.

![Mean Reasoning Gym scores on format-varied, held-out questions: on 21 families, the base editor scores 0.32, the trained editor 0.62, and a fixed Python workflow 0.69; across all 26 families, the base and trained editors score 0.282 and 0.528. Both panels use a scale from 0 to 1.](/articles/harness-learning-mejorar-agentes-ia/resultados-en.svg)

*Data from Table 9 and Appendix B.1: mean scores on format-varied, held-out questions across individual revisions, not best-candidate selection. The Python baseline is a fixed workflow. The panels separate the 21- and 26-family sets; they don't measure sales, savings, or performance with matched costs.*

Those scores do not imply equal compute budgets or settle which method is best on each task. They do rule out an easy reading: **learning to modify the workflow doesn't establish that it's always better than designing a simple, fixed one**.

That baseline changes the practical decision. If a fixed workflow with a well-integrated tool already solves your problem, the automatic editor has to justify its complexity. The study shows that the editor can learn to propose better revisions, not that it's always the simplest way to build a good agent.

## Transfer is more interesting than the headline

In the tests that require multiple retrieval steps, the editor is trained on HotpotQA, then evaluated on MuSiQue and 2WikiMultihopQA, two benchmarks not used in that training. The trained editors improve workflows on those datasets too.

An editor trained to make individual revisions can also remain useful over successive rounds, when the code it receives already contains its own changes. It doesn't need to have been trained on every exact intermediate state to produce further gains in these experiments.

That's evidence that the revision capability transfers. It isn't proof that the editor can improve any agent or learn indefinitely from any conversation.

Two limits deserve to stay in view: training on revision sequences doesn't offer a consistent advantage over training on individual revisions; and the sequential comparison for question answering over documents matches the number of proposals, **not all compute or all feedback**.

The editor can remain useful as the program changes. Whether that process pays for itself needs a separate evaluation.

## Four checks before adding another model

I wouldn't start by reproducing the paper's training. I'd first follow the path of a failed answer.

**Where does the evidence get lost?** The document example offers a concrete clue. A summary can be enough to choose the next search and too thin to support the final answer. I'd check which original data, references, and conditions reach each decision, rather than assume one summary works for everything.

**What work should a tool do?** In the reasoning tasks, many revisions introduce code-execution loops. The lesson isn't that every agent needs an interpreter. It's to check whether we're asking a model to improvise something that software already knows how to calculate or verify.

**What do we call an improvement?** Choosing a revision because it looks better on the same examples that inspired it can reward fitting those examples. The paper separates held-out evaluation questions from the material used during adaptation. In an application, I'd make the same separation with use cases and known failures, while also measuring latency, cost, and unintended effects.

**When does the search stop?** Each candidate needs execution and evaluation. Before automating revisions, I'd define a budget and compare the result with the simplest fixed workflow that makes sense. A small gain may not justify another operational layer.

These are ways I'd apply the reading, not changes we've implemented or results we've measured at MaltaClean.

## Changing the procedure doesn't grant permission

There's a boundary this work shouldn't erase: a good score doesn't authorize an agent to change the rules protecting an operation.

In [the article about intent and authorization](/en/writing/modelo-entiende-codigo-decide-permiso/), I separated understanding a request from having permission to execute it. A workflow editor should remain subject to that separation. Reorganizing a search isn't the same as removing a payment confirmation or widening access to conversations.

If I applied this idea to a system with real consequences, I'd test modifications in an isolated environment, with limited access and no operational credentials. Authorization controls and contracts governing side effects would stay outside what the editor can change. Promoting a revision to production would require its own tests and review.

That's an engineering recommendation, not a security guarantee demonstrated by these benchmarks. The main experiments study reasoning and document questions. They don't certify that an editor can safely manage bookings, money, or permissions.

## Open the trace before switching models

Harness learning shows that a trained editor can produce better revisions and transfer that ability to certain new tasks, with a fixed solver. It doesn't make switching models the wrong decision.

My practical conclusion starts earlier: **open the trace of a failed answer and inspect what the final call received**. Then check which tool it could have queried and which verification was missing.

Maybe you need a more capable model. Maybe you just need to stop asking it to answer from a summary that has already lost the evidence. Fixing that path may take a few lines of code, not a system that learns to rewrite itself.

Switching models is still an option. Understanding why the agent failed should come first.

---

*Source: Alvin Zhang and colleagues, [Harness Learning Enables Generalizable Test-Time Adaptation](https://arxiv.org/pdf/2609.35738), arXiv:2609.35738v1, September 28, 2026. The document example is from Section 6.2; results and successive adaptation, Sections 5.2–5.4; exclusions and the fixed Python workflow, Appendix B.1 and Table 9. This article distinguishes the study's results from my proposals for applying them.*
