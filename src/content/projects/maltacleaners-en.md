---
title: "MaltaCleaners — Service Operations Platform with AI Concierge"
description: "Full-stack platform for a real cleaning operation in Malta: booking, WhatsApp concierge with human-in-the-loop approval, admin/employee/reschedule portals, accrual finance module and Airbnb iCal sync — built end-to-end on Cloudflare."
lang: "en"
routeSlug: "maltacleaners"
tags: ["product-engineering", "saas", "ai-integration", "cloudflare"]
publishedDate: 2025-07-01
featuredOrder: 3
liveUrl: "https://malta-cleaners.com"
screenshots:
  - src: "/projects/maltacleaners/homepage.jpg"
    alt: "MaltaCleaners marketing site with integrated booking for home cleaning and short-let turnover services"
    caption: "Marketing site with integrated booking — malta-cleaners.com"
---

MaltaCleaners is the operating platform of a cleaning service in Malta serving homeowners and short-let hosts: marketing site, booking, a WhatsApp concierge, staff portals and finance — one system covering the full lifecycle from first contact to monthly payouts.

## Context and my role

The business runs on real constraints: field staff without desk setups, customers on WhatsApp, hosts syncing calendars from Airbnb and Booking.com. I designed and built the entire platform as its sole developer — architecture, data model (57 migrations), integrations and deployment — working directly against the operation's needs.

## What it does

- **Booking with server-authoritative pricing** — date picker, slots, duration; dedup, anti-bot checks (origin, timing, honeypot) and price computed server-side only
- **WhatsApp concierge** — AI auto-reply with a multi-model fallback chain (text and vision), autonomous booking creation and cancellation via signed tokens, cleaner-availability broadcast, a human-takeover auto-lock and `/pause`-`/unpause` commands
- **Three portals** — a React admin SPA behind Cloudflare Access (bookings, customers, finance, expenses, concierge oversight, email audit log); an employee portal with schedule, earnings breakdown, before/after photo upload to R2 and weekly availability; a customer self-service reschedule flow via signed tokens
- **Finance on accrual basis** — P&L with revenue recognized on completion, partner distributions, immutable monthly snapshots, channel ROI and service margin analytics
- **Short-let operations** — flat turnover pricing matrix, property management with soft-delete cascade, and hourly iCal sync with auto book/cancel from Airbnb, Booking and Vrbo feeds
- **Notifications** — email (SendEmail) and WhatsApp templates: confirmations, reminders, review requests, service reports

## Decisions worth noting

- **Cloudflare-native end to end**: Pages Functions for the API, D1 for storage, R2 for photos, four Workers (booking cron, booking email, email forwarder, iCal sync) — one platform, no servers to babysit
- **Signed tokens instead of accounts** for customers and reschedule flows — zero-friction access where passwords would kill adoption
- **Human-in-the-loop by design**: the concierge can act, but the admin approves, takes over and pauses. AI autonomy is bounded by the operation's trust, not the other way round

## Evidence and limits

The platform is live at [malta-cleaners.com](https://malta-cleaners.com). This page doesn't publish adoption or throughput metrics — the honest scope claim is the shipped system itself, its architecture and its production operation, not measured business outcomes.
