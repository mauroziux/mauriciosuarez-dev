---
title: "The endpoint that took 29 seconds (and nobody complained)"
description: "Autopsy of a ~29s production request: the AI call, the PDF render, and ~20 R2 downloads hidden inside an email — and the pattern that got it under 500 ms."
lang: "en"
routeSlug: "endpoint-29-seconds"
tags: ["laravel", "rendimiento", "colas", "saas", "postmortem"]
publishedDate: 2026-09-26
draft: false
ogImage: "/articles/endpoint-29-seconds/hero-29s-en.png"
---

The most important endpoint in my SaaS took **29 seconds** to respond. I know because I measured it — not because anyone reported it. Nobody ever complained. That silence is the most interesting part of this story.

The system is [Mantto](/en/projects/mantto/), a property maintenance and inspection platform running in production. The endpoint in question is the one that marks a maintenance request as **completed**: the button an administrator hits to close out the day. It sounds trivial. It isn't.

## The symptom nobody reported

`POST /api/v1/maintenance-requests/{id}/complete` was returning **~29 seconds of TTFB** in production. The spinner spun for half a minute and the user waited, because "it's generating the report" seemed like a reasonable explanation. The delay had become normal: when slow is how it's always been, it stops being a bug and becomes a *feature* of waiting.

There was no ticket, no complaint. There was an internal measurement and a suspicion: no endpoint should take 29 seconds to change a status.

## The autopsy: four jobs on a single HTTP thread

Opening `completeExecution()` revealed the root cause: the state transition was only the first line. Everything else — the post-completion fan-out — ran **synchronously inside the HTTP request**:

| # | Job | Cost | Detail |
|---|-----|------|--------|
| 1 | AI executive report | ~5–15 s | OpenAI/Gemini call through the app's AI gateway |
| 2 | PDF render + R2 upload | ~1–3 s | DomPDF renders the report and uploads it to Cloudflare R2 |
| 3 | Two confirmation emails | ~5–15 s | **The hidden culprit** — detail below |
| 4 | Satisfaction survey | seconds | Another synchronous email + WhatsApp |

The hidden culprit was #3. The confirmation emails attached the job's evidence (before and after photos). The mailable's `build()` did **one R2 `GET` per attachment**: with ~10 images × 2 recipients that's **~20 sequential downloads from object storage**, plus the synchronous Resend API call to send. All inside the original HTTP request, with no `ShouldQueue`.

There's a delicious irony here: the WhatsApp notifications **were already async** from the start. The bottleneck wasn't the AI or the PDF — it was the emails, the component nobody suspects because "an email can't take 15 seconds." It can. When an email is, in reality, an object-storage client in disguise.

![Anatomy of the confirmation email: 10 evidence photos feed two emails, each attachment triggers a sequential R2 GET, and everything sends synchronously through Resend inside the original HTTP request](/articles/endpoint-29-seconds/criminal-email-en.svg)

*Anatomy of the hidden culprit: each email attached 10 photos, downloading them one by one from R2 — two recipients, ~20 sequential GETs — plus the synchronous send. All inside the original HTTP request.*

The total: 29 seconds of legitimate work executed in the worst possible place.

![Before and after diagram of the fix: before, the HTTP request executed the state transition, the AI report, the PDF, the emails and the survey in sequence up to ~29 seconds; after, the request only performs the transition in under 500 ms and two decoupled jobs on the Redis queue do the rest](/articles/endpoint-29-seconds/autopsia-endpoint-en.svg)

*Top: the full autopsy. Bottom: the pattern that replaced it. On mobile, swipe the graphic horizontally to see it in full.*

## The fix: mutate fast, fan out later

The pattern I applied is old and famously deserved — *do the state mutation inline, everything else goes to the queue* — but the details are what decide whether it survives production:

**1. Inline, only the guarded mutation.** The state transition with its transaction and `lockForUpdate`, plus the fast database work that was already protected. Nothing else.

**2. The mailables implement `ShouldQueue`.** One interface, and the ~20 R2 downloads + the send migrate to the worker. `Mail::to()->send()` queues them automatically.

**3. One job per concern, decoupled — not chained.** I considered `Bus::chain([reportJob, notifyJob])` and rejected it: if the report job retries (throws), the chain breaks and **the email never sends**. The email is essential; the PDF is a nice-to-have. Decoupled, the email always sends and the report retries on its own (`tries=3`, idempotent — if one already exists, it skips). The notifications job even omits the PDF *gracefully* when the report isn't finished yet.

**4. The dispatch can fail too.** The state change is already committed when the jobs are dispatched; if Redis happens to be down at that moment, the request must not crash or hide a completed state:

```php
try {
    GenerateMaintenanceExecutiveReportJob::dispatch($mr->id, $user->id);
    SendMaintenanceCompletionNotificationsJob::dispatch($mr->id, $user->id);
} catch (\Throwable $e) {
    report($e); // for ops reconciliation; the manual backstop is
                // the admin "regenerate report" endpoint
}
return $maintenanceRequest->refresh();
```

The result: **the request returns in <500 ms**. The ~29 seconds of work still exist — they now run on the Redis queue, where they belong.

## The details nobody tells you about

The testing gotchas from this change deserve their own article:

- **`Mail::assertSent` reports "sent 0 times"** the moment the mailable implements `ShouldQueue`. `Mail::fake()` records it as *queued*: you need `Mail::assertQueued(...)`. A classic symptom of a test that's broken "for no reason."
- **Jobs dispatched in tests were running on the REAL Redis queue.** `phpunit.xml` set `QUEUE_CONNECTION=sync` via `<env>`, but `<env>` **does not populate `$_SERVER`**: the container's `QUEUE_CONNECTION=redis` won. Consequence: fakes (`Queue::fake()`, mocks) didn't apply inside the job's `handle()`, and one test ended up uploading files to **real R2** (~22 s per test, polluted storage). The robust patterns: `Queue::fake()` + `Queue::assertPushed()` to assert dispatch without execution, or instantiate the job and call `handle()` directly so fakes apply in-process.
- **Deploying with Octane:** `docker compose restart api worker` (Octane caches config/middleware) + `php artisan queue:restart` so workers pick up the new classes. Without this, you dispatch jobs no worker knows about yet.

## What transfers

1. **Silence isn't health, it's normalization.** I measured because I distrusted the spinner, not because something failed. "It's always been this slow" is the most expensive sentence in a SaaS.
2. **The state transition and the work it triggers are different things.** The user asks for a state change; the report, the PDF and the emails are consequences. Consequences don't need to block the confirmation.
3. **Chain only what is truly sequential.** An elegant `chain` can cost you the essential email because of the optional PDF. Essential and nice-to-have travel separately.
4. **Emails are code.** I/O in `build()` is I/O in your request. Every attachment is a network download you pay for in latency — or in the queue.
5. **Protect what's already committed.** If the state was saved, a failure to *dispatch* the consequences is a reconciliation incident, not a 500 for the user.

Two pieces of honesty before closing: the 29 s → <500 ms is an **internal production log, not a reproducible benchmark** (a single operator, low volume at the time — part of the lesson is that the pain doesn't need volume to exist). And the solution didn't invent anything: it respected a pattern Laravel gives away and applied discipline at the edges.

---

*Epilogue with a hook: weeks after this fix, another AI call — this one with a timeout — taught me that some errors no `try/catch` can catch, because the process is already dead when they happen. That's the next entry in this series.*
