# GZW Armory

Unofficial Gray Zone Warfare **suggested gun builds**, organized by **vendor** and **unlock level**.

> Unofficial fan tool. Not affiliated with or endorsed by MADFINGER Games.

**Live:** [gzwarmory.com](https://gzwarmory.com)

> *The Raven doesn't rush. The Raven doesn't miss.*

## Direction

Vendor-organized progression ladders with a **suggested build** per unlock tier:

- **Vendors** — Handshake, Gunny, Lab Rat, Artisan, Turncoat, Banshee, Vulture
- **Tiers** — Gunny AR Levels 1–4 (CQ A1 → M4A1 → suppressed → endgame)
- **Suggested build** — weapon, attachments, ammo, notes (placeholders until 0.5 meta is known)
- **Fiction** — optional one-line hook above a tier; ~200-word vignette **below** the kit; long chapters under `/dispatches`
- **Verification** — every item carries a verified / unverified flag (`pre-0.5, unverified` where applicable)

The window around 0.5 (Rogue Ops) is a **research** window, not a launch window. Skeleton first; opinionated kits after the meta is known cold.

Day-1 focus: **CQ A1 via Gunny L1**; **M4A1 buyable from L2** (`/vendors/gunny` / `/vendors/gunny/m4`).

`/builder` and `/loadout` permanently redirect to `/vendors`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Homepage — CTA to vendor guides |
| `/vendors` | Hub of all 7 vendors |
| `/vendors/[vendor]` | Unlock ladder + suggested builds |
| `/vendors/gunny/m4` | Gunny AR ladder Levels 1–4 (light skeleton) |
| `/vendors/handshake/kit` | Handshake kit ladder L1–L4 (placeholder) |
| `/vendors/lab-rat/meds` | Lab Rat meds ladder L1–L4 (placeholder) |
| `/dispatches` | Long-form fiction stub (e.g. Sunny Skies) |

## Tech stack

- Next.js 16 + React 19 + Tailwind CSS 4
- Static JSON in `/data` (no database)
- Vercel hosting (pushes to `master` auto-deploy)

## Data

- Reference weapons / attachments: `/data/weapons`, `/data/attachments` (stale vs 0.5 — flag unverified)
- Vendors + guides: `/data/vendors.json`, `/data/guides/*.json`
- Dispatches index: `/data/dispatches.json`
- Types: `/lib/types/guides.ts`

Community PRs welcome for data corrections. Prefer in-game screenshots over wiki alone.

## Status

🚧 Pre-0.5 skeleton — research window. Not launch content.
