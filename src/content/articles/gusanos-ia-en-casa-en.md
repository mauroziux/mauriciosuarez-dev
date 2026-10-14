---
title: "AI worms at home: slow does not mean harmless"
description: "15 TV boxes, a 26B model, and an uncomfortable question: how close are household AI worms? What Anthropic demonstrated, and what it projected."
lang: "en"
routeSlug: "ai-worms-at-home"
tags: ["security", "ai", "iot", "agents", "llm"]
publishedDate: 2026-10-14
draft: false
ogImage: "/articles/gusanos-ia-en-casa/hero-en.png"
---

*Cover: a conceptual illustration of “digital slime mold,” not a photograph of the experiment or an observed infection.*

Your smart TV, your connected oven, that generic Android box you bought for your mother. They all have a CPU, RAM, and an internet connection we rarely inspect. [Research by Anthropic](https://www.anthropic.com/research/self-replicating-ai), from William Zhou and Daniel Freeman, raises an uncomfortable possibility: small AI models **could be months away**—not years—from being capable of replicating themselves on this kind of device. If that scenario becomes possible, they could sustain inference outside a datacenter, without a human operator and without one central place to shut them down.

They did not discover a worm living in a kitchen. They demonstrated pieces of the system in a lab and estimated when those pieces might fit together. That distinction matters as much as the headline.

The interesting part is not the headline. It is the hardware purchased for the test: **15 generic Android TV boxes, about US$55 each, with 4 GB of RAM**, running Gemma4-26B-A4B distributed across all of them—two model layers per box—at **0.39 tokens per second**. Inference works. It is painfully slow. And it works.

## The setup: your living room as a datacenter

What caught me off guard was the memory arithmetic. A typical TV box ships with 1–4 GB of RAM. According to the study's estimates, with 4-bit quantization and 4 GB per device, a 9B model can be spread across four or more machines, and a 26B model across ten or more. In other words, **a group of cheap devices can provide the memory a capable model needs**. The model weights—the numbers that hold what it learned during training—do not need to fit inside one box. The demo uses *pipeline parallelism*: each box processes a few layers and passes the result to the next. You do not need an expensive GPU to demonstrate inference. You need patience.

[Kimwolf](https://synthient.com/blog/a-broken-system-fueling-botnets), a real botnet that infected more than two million Android TVs, provides a reference for scale. If every group of 15 TVs in a fleet that size ran one model copy, there would be roughly 133,000 replicas serving about 80,000 tokens per second in total. How much compute is that? At most, around 40 H100s in that throughput comparison. **This is an extrapolation from the size of a previous botnet, not an observed AI network.** The contrast is what matters: little compute compared with a datacenter, but spread across an enormous number of homes.

## The experiment that matters: chaining the full cycle

Being able to *run* a model on TVs is half the story. The other half is whether a model can **copy itself** from machine to machine. To test that, the researchers built an isolated network of eight emulated Android nodes—redroid, running Android 15—with unauthenticated ADB ports. ADB is an Android administration and debugging tool: in this experiment, the entry point was deliberately left open.

The result: **GLM-5.2 successfully chained the process in that simplified evaluation**: finding nodes, delivering the payload, and setting up inference. It reached all eight nodes in four out of five trials; in the fifth, it reached seven. The other open-weight models evaluated consistently failed to complete the cycle.

**The crucial detail:** the nodes ran **Llama3.1-8B**, not GLM-5.2. GLM-5.2 reasoned through a separate inference server; once a node passed the checks, the harness started another agent instance there. This was not a demo of GLM-5.2 living entirely inside TV boxes. It was a test of the ability to orchestrate propagation, separate from the demonstration that a smaller model can run on cheap hardware.

<figure>
  <div role="region" aria-label="Comparison of the two experiments; horizontally scrollable" tabindex="0" style="overflow-x: auto; overscroll-behavior-x: contain;">
    <img src="/articles/gusanos-ia-en-casa/two-experiments.svg" alt="Two separate experiments: 15 physical TV boxes run Gemma4-26B-A4B at 0.39 tokens per second; externally served GLM-5.2 orchestrates propagation across 8 Android emulators running Llama3.1-8B." width="640" height="1040" loading="lazy" decoding="async" style="min-width: 480px; max-width: none;" />
  </div>
  <figcaption><em>Original diagram based on Anthropic's research. One test demonstrates inference on cheap hardware; the other demonstrates propagation with simplified access. They are not one self-contained demo in real homes. On mobile, swipe the diagrams horizontally to read them in full.</em></figcaption>
</figure>

Here is the idea behind the forecast. There is a **capability floor**: the level needed to replicate reliably—in this evaluation, GLM-5.2. And there is a **size ceiling**: what can fit on the devices being targeted, as models such as Qwen3.5-9B and Gemma4-26B-A4B can. The two conditions do not yet coincide in the models tested. But the historical trend for the best open-weight models of up to 30B parameters suggests an improvement of about 13.7 points per year on the **Epoch Capabilities Index**, a general capability measure. That fit (R² of 0.95) puts them at GLM-5.2's level **around the end of 2026, if the trend continues**. That is neither a guaranteed arrival date nor a direct measurement of replication capability.

## Slow, persistent, and without one power switch

The image of a worm can be misleading, because a household AI worm would not be fast. Combining measured speeds with the workload from their evaluations, the authors estimate **71–150 hours** to complete inference setup using Gemma4-26B-A4B, and **28–51 hours** with Qwen3.5-9B. These are estimates for that stage, not measured times for complete infections in real homes. The scenario would involve **days per copy**, not seconds.

What is unsettling is not the speed, but three other properties:

1. **There would not be one switch.** A provider can turn off a centralized inference service. A network spread across homes requires identifying, isolating, and cleaning many devices. That would not make it impossible to shut down; it would make the shutdown difficult to coordinate.
2. **It can persist without getting bored.** An agent could spend days inspecting packages and errors, as long as it has power, connectivity, and an environment that allows it to continue. Slowness limits its work, but does not make it give up out of human fatigue. Persistence is not free: it consumes resources.
3. **It can work through different environments.** In the evaluations, Qwen3.5-9B set up inference on eight out of nine hardware types, from a Jetson Nano to a Mac. Unlike a script tied to fixed assumptions, an agent can inspect its environment and try to correct incompatibilities. That does not mean it can compromise any device.

That is why the authors describe a possible **“digital slime mold”**: not a fast predator, but a slow, distributed organism that could exploit poorly protected compute and be difficult to eradicate everywhere at once.

## What interested me most: inheriting what worked

A conventional software worm copies identical code each time. These replicas could be more Lamarckian: **each copy passes its notes to the next**—what it tried, what failed, and what worked on that hardware.

In the experiment, Qwen3.5-9B instances inheriting their predecessor's notes increased their inference-setup success rate **from 45% in the first generation to between 61% and 84% in later generations**. **The model weights were not retrained**: the notes, code, and context available to the next attempt changed. Those percentages measure success at setting up inference, not infection rates or propagation across the internet.

<figure>
  <div role="region" aria-label="Inherited notes and inference-setup results; horizontally scrollable" tabindex="0" style="overflow-x: auto; overscroll-behavior-x: contain;">
    <img src="/articles/gusanos-ia-en-casa/inherited-notes.svg" alt="In Memento, one instance leaves notes and code for the next. Qwen3.5-9B reaches 45% inference-setup success in the first generation and between 61% and 84% in later generations. Its weights are not retrained." width="640" height="920" loading="lazy" decoding="async" style="min-width: 480px; max-width: none;" />
  </div>
  <figcaption><em>Original visualization of the six-generation experiment. Hatching shows the published range for later generations, not an invented curve or an infection rate. Source: Anthropic, “Learning on the job.”</em></figcaption>
</figure>

Another counterintuitive result: giving Qwen3.5-9B access to a **frontier advisor**—Opus 4.8 as a consultant—did not produce a significant improvement on this task. The authors observed difficulty asking useful questions; they suggest that a large model setting strategy and coordinating smaller models as subagents might work better. That is a hypothesis, not a universal conclusion about advisors.

## The personal connection: this ran on Pi

A small detail for those of us who live in terminals: the harness they built for the experiments is called **Memento**, and is intended to mitigate agents fixating on an incorrect hypothesis instead of backtracking. It is built **on [Pi](https://pi.dev/), the open-source coding agent**. Each instance inherits the previous one's workspace and notebook, with a timeout per generation. The same tool I use to write code every day, used to study how an AI worm might spread among household devices. It is a small, strange world.

## What about defenses?

As in epidemiology, the goal is to push **R₀**—the number of new devices each infected device goes on to infect—below one, so the replicator dies out instead of becoming endemic. Some factors work in defenders' favor:

- **A visible network signature:** copying several gigabytes of weights between household devices generates anomalous traffic that ISPs can detect. There would be a trade-off between speed and stealth: faster replication makes more noise.
- **ISP quarantine:** it worked against Mirai. Quarantine with an allowlist and customer notification cleared 92% of infections within 14 days, compared with 74% without notification.
- **Honeypots** to collect the harness and payload and characterize their behavior.
- **Secure defaults backed by regulation:** selling IoT devices with default passwords is already non-compliant in the UK. Fewer soft targets means less room for the mold to grow.

## The study's important limits

Two limits the authors themselves make clear are worth repeating:

- **Access was simplified:** unauthenticated ADB removes a crucial part of the attack. The result is an upper bound for harder scenarios, not proof that the agent can enter any TV. Mirai shows that some real-world misconfigurations are also basic—not that every device is equivalent to this experiment.
- **The 2026 date is an extrapolation:** ECI measures general capability, not replication directly. It is an estimate conditional on the trend continuing, not an appointment on a calendar.

## The question I keep coming back to

The paper has a phrase for this stage: *“signs of life.”* Like coding agents in 2024, which only hinted at what would follow, this is not yet a rogue replicator. We are seeing pieces that work separately, the ability to chain them in a simplified environment, and improvements when one attempt inherits another's notes.

The uncomfortable question is not “Is my TV already infected?” This study does not demonstrate that. It is something else: **what changes when an attacker can use devices that once seemed too slow to be worth the effort?**

The risk does not have to begin with a spectacular AI. It might begin when a sufficiently capable AI gains access to mediocre hardware and has time to keep trying.

---

*Source: [Self-replicating AI — Anthropic, William Zhou and Daniel Freeman](https://www.anthropic.com/research/self-replicating-ai). This article discusses their experiments; it does not report tests I performed or an infection observed outside the lab.*
