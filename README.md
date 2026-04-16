# GZW Armory

**The** Gray Zone Warfare weapon builder and PMC loadout calculator.

> Unofficial fan tool. Not affiliated with or endorsed by MADFINGER Games.

## What It Does

### Module 1 — Weapon Builder
- Pick any weapon
- Slot compatible attachments per slot
- See live stat deltas as you build
- Share your build via unique URL

### Module 2 — PMC Loadout Calculator
- Slot armor, helmet, rig, backpack, weapons
- See total carry weight vs. 54kg overweight threshold
- Weight zone indicator: Optimal / Degraded / Overweight
- Armor coverage map (front / back / sides)
- Material tradeoff summary (steel vs ceramic vs aramid)

## Tech Stack
- Next.js (React)
- Tailwind CSS
- Static JSON data files (no database needed)
- Vercel hosting (free tier)
- GitHub for community data contributions

## Data
- Source: Fandom wiki API + in-game verification
- All game data in `/data/` as plain JSON
- Community can submit PRs to fix/update data
- Patch version badge on site — always shows data age

## Domain
gzwarmory.com

## Status
🚧 In development — Patch 0.4.0.2
