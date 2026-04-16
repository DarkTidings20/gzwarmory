# GZW Armory — Data Schema v1.0

## Weapon JSON Structure
Each weapon is a separate file in `/data/weapons/`.

### Base Stats
All modifier stats follow 0.4 rule: positive = good, negative = bad.
- `accuracy` — MOA value (LOWER base = better; EXCEPTION to the rule)
- `recoilControl` — attachment modifiers only, base is 0
- `ergonomics` — affects ADS speed and handling feel
- `weaponHandling` — overall manipulation speed
- `reloadSpeed` — seconds for full reload
- `muzzleVelocity` — fps/mps of projectile
- `loudnessReduction` — suppression effectiveness
- `muzzleDeviceEfficiency` — compensator/brake effectiveness
- `weight` — kg, contributes to PMC total carry weight

### Slots
Each weapon defines its own slot list. Not all weapons have all slots.
- `required: true` = weapon cannot function without this slot filled (e.g. magazine)
- `compatible: []` = array of attachment IDs that fit this slot

## Attachment JSON Structure
Each attachment is a file in `/data/attachments/<category>/`.

Fields:
- `id` — slug identifier (matches weapon slot compatible array)
- `name` — display name
- `category` — slot type (pistolGrip, barrel, muzzleDevice, etc.)
- `statModifiers` — object with stat deltas (positive = better)
- `weight` — kg
- `vendor` / `vendorRank` — where to buy
- `patchVersion` / `lastUpdated`

## Gear JSON Structure
Files in `/data/gear/` and `/data/armor/`.

### Armor/Carrier fields:
- `id`, `name`, `type` (plateCarrier, vestRig, helmet, etc.)
- `weight` — kg
- `armorRating` — NIJ tier (II, IIIA, IIIA+, III, III+, III++)
- `coverage` — { front: bool, back: bool, sides: bool }
- `material` — steel | ceramic | uhmwpe | aramid | none
- `slots` — storage slots count
- `vendor` / `vendorRank`

## Weight System Reference
- < 33kg: Optimal stamina + movement
- 33–54kg: Stamina drain curve increases
- 54kg+: Overweight — movement penalty, no vaulting, same penalty regardless of how far over

## Patch Version Tracking
Every file has `patchVersion` and `lastUpdated`.
Site displays a global "Data version: 0.4.0.2" badge.
On major updates, run the scraper script and flag changed files.
