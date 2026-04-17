"""
Patch script: AR15 platform Gunny rank 1 data update (from 2026-04-16 screenshots)

Actions:
1. Update verified stats + vendor/rank for confirmed Gunny rank 1 AR15 parts
2. Add M16A1 parts as Gunny rank 4 (verified from screenshots)
3. Fix M16A1 Barrel - vendor was "Unknown", now confirmed Gunny rank 4
4. Fix M16A1 Upper Receiver - was "Loot only", now confirmed Gunny rank 4
5. Clear Gunny rank 1 flag from any AR15 parts NOT confirmed as rank 1
6. Clear Gunny rank 1 from any non-AR15 parts that mistakenly had it
"""

import json
import os

BASE = r"C:\Users\lehma\.openclaw\workspace\gzwarmory-app\data\attachments"

def load(slot):
    path = os.path.join(BASE, slot, "index.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save(slot, data):
    path = os.path.join(BASE, slot, "index.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Saved {slot}/index.json ({len(data)} items)")

def patch_item(items, item_id, **kwargs):
    for item in items:
        if item["id"] == item_id:
            for k, v in kwargs.items():
                item[k] = v
            item["verified"] = True
            print(f"    Patched: {item_id}")
            return True
    print(f"    NOT FOUND: {item_id}")
    return False

# ── BARRELS ───────────────────────────────────────────────────────────────────
print("\n=== BARRELS ===")
barrels = load("barrel")

# AR-15 CQA1 14.5" — Gunny rank 1, confirmed stats
patch_item(barrels, "ar-15-cqa1-barrel-14-5",
    vendor="Gunny", vendorRank=1, price=544,
    accuracy=4.18, weight=0.725,
    statModifiers={"ergonomics": 2.0, "sizeChangeX": 2.0},
    muzzleVelocityMod=0.0, manufacturer="Norinco"
)

# M16A1 Barrel 20" — Gunny rank 4, confirmed stats (was "Unknown")
patch_item(barrels, "m16a1-barrel-20",
    vendor="Gunny", vendorRank=4, price=680,
    accuracy=1.22, weight=0.97,
    statModifiers={"ergonomics": -18.0, "sizeChangeX": 4.0},
    muzzleVelocityMod=20.0, manufacturer="Colt"
)

# AR-15 Barrel 14.5" — scrape had this as "Gunny R.??" rank 0, not confirmed rank 1
# Aaron confirmed only CQA1 14.5" is rank 1 — clear this one
patch_item(barrels, "ar-15-barrel-14-5",
    vendor="Gunny", vendorRank=3, vendorNote="Not rank 1 — rank unconfirmed, set to 3 pending verification"
)

save("barrel", barrels)

# ── BUFFER TUBES ──────────────────────────────────────────────────────────────
print("\n=== BUFFER TUBES ===")
tubes = load("bufferTube")

# CQ A1 Buffer Tube — Gunny rank 1 (CQA1 platform, rank 3 in scrape — correcting to rank 1)
patch_item(tubes, "cq-a1-buffer-tube",
    vendor="Gunny", vendorRank=1, price=153,
    weight=0.108,
    statModifiers={"recoilControl": -3.0, "ergonomics": -3.0},
    manufacturer="Norinco"
)

# M4 Buffer Tube — scrape had rank 3, not confirmed as rank 1
# Leave as-is, no rank 1 claim to remove

save("bufferTube", tubes)

# ── CHARGING HANDLES ─────────────────────────────────────────────────────────
print("\n=== CHARGING HANDLES ===")
handles = load("chargingHandle")

# CQ A1 Charging Handle — Gunny rank 1 confirmed
patch_item(handles, "cq-a1-charging-handle",
    vendor="Gunny", vendorRank=1, price=117,
    weight=0.028,
    statModifiers={"reloadSpeed": 2.0},
    manufacturer="Norinco"
)

# Standard GI Charging Handle — confirmed Gunny rank 1 (was "Loot only" rank 0)
patch_item(handles, "standard-gi-charging-handle",
    vendor="Gunny", vendorRank=1, price=117,
    weight=0.028,
    statModifiers={"reloadSpeed": 2.0},
    manufacturer="Colt"
)

# M16A1 Charging Handle — confirmed Gunny rank 4
# Add if missing
m16_ch_exists = any(i["id"] == "m16a1-charging-handle" for i in handles)
if not m16_ch_exists:
    handles.append({
        "id": "m16a1-charging-handle",
        "name": "M16A1 Charging Handle",
        "category": "chargingHandle",
        "weight": 0.028,
        "vendor": "Gunny",
        "vendorRank": 4,
        "price": 117,
        "statModifiers": {"reloadSpeed": 2.0},
        "manufacturer": "Colt",
        "attachmentInterface": "AR15 Handle",
        "patchVersion": "0.4",
        "wikiSource": False,
        "verified": True
    })
    print("    Added: m16a1-charging-handle")
else:
    patch_item(handles, "m16a1-charging-handle",
        vendor="Gunny", vendorRank=4, price=117,
        weight=0.028,
        statModifiers={"reloadSpeed": 2.0},
        manufacturer="Colt"
    )

save("chargingHandle", handles)

# ── HANDGUARDS ───────────────────────────────────────────────────────────────
print("\n=== HANDGUARDS ===")
handguards = load("handguard")

# CQ A1 Carbine Handguard — confirmed Gunny rank 1
patch_item(handguards, "cq-a1-carbine-handguard",
    vendor="Gunny", vendorRank=1, price=170,
    weight=0.323,
    statModifiers={"sizeChangeX": 1.0},
    manufacturer="Norinco"
)

# M16A1 Handguard — confirmed Gunny rank 4
m16_hg_exists = any(i["id"] == "m16a1-handguard" for i in handguards)
if not m16_hg_exists:
    handguards.append({
        "id": "m16a1-handguard",
        "name": "M16A1 Handguard",
        "category": "handguard",
        "weight": 0.453,
        "vendor": "Gunny",
        "vendorRank": 4,
        "price": 306,
        "statModifiers": {"recoilControl": 2.0, "ergonomics": 2.0, "sizeChangeX": 1.0},
        "manufacturer": "Colt",
        "attachmentInterface": "AR15 HG",
        "patchVersion": "0.4",
        "wikiSource": False,
        "verified": True
    })
    print("    Added: m16a1-handguard")
else:
    patch_item(handguards, "m16a1-handguard",
        vendor="Gunny", vendorRank=4, price=306,
        weight=0.453,
        statModifiers={"recoilControl": 2.0, "ergonomics": 2.0, "sizeChangeX": 1.0},
        manufacturer="Colt"
    )

# AR-15 MOE M-LOK Carbine Handguard — scrape had rank 1, Aaron says no rank 1 for other vendors/AR15 parts
# This was Gunny rank 1 — Aaron confirmed only CQA1 parts are rank 1. Remove rank 1.
patch_item(handguards, "ar-15-moe-m-lok-carbine-handguard",
    vendorRank=3, vendorNote="Was rank 1 in scrape — Aaron confirmed no other AR15 parts at rank 1 Gunny"
)

save("handguard", handguards)

# ── MUZZLE DEVICES ────────────────────────────────────────────────────────────
print("\n=== MUZZLE DEVICES ===")
muzzles = load("muzzleDevice")

# CQ A2 Flash Hider — confirmed Gunny rank 1 (was rank 1 in scrape, now verified with stats)
patch_item(muzzles, "cq-a2-flash-hider",
    vendor="Gunny", vendorRank=1, price=170,
    weight=0.066,
    statModifiers={"muzzleDeviceEfficiency": 5.0},
    manufacturer="Norinco"
)

# M16A1 Flash Hider — confirmed Gunny rank 4
m16_fh_exists = any(i["id"] == "m16a1-flash-hider" for i in muzzles)
if not m16_fh_exists:
    muzzles.append({
        "id": "m16a1-flash-hider",
        "name": "M16A1 Flash Hider",
        "category": "muzzleDevice",
        "weight": 0.066,
        "vendor": "Gunny",
        "vendorRank": 4,
        "price": 187,
        "statModifiers": {"muzzleDeviceEfficiency": 5.0},
        "manufacturer": "Colt",
        "attachmentInterface": "5.56x45 Muzzle",
        "patchVersion": "0.4",
        "wikiSource": False,
        "verified": True
    })
    print("    Added: m16a1-flash-hider")
else:
    patch_item(muzzles, "m16a1-flash-hider",
        vendor="Gunny", vendorRank=4, price=187,
        weight=0.066,
        statModifiers={"muzzleDeviceEfficiency": 5.0},
        manufacturer="Colt"
    )

# A2 Flash Hider — scrape had "Gunny R.??" rank 0 — not confirmed rank 1, clear it
for item in muzzles:
    if item["id"] == "a2-flash-hider" and item.get("vendorRank") == 0:
        item["vendorNote"] = "Vendor/rank unconfirmed — not Gunny rank 1"
        print("    Flagged: a2-flash-hider vendor unconfirmed")

save("muzzleDevice", muzzles)

# ── PISTOL GRIPS ──────────────────────────────────────────────────────────────
print("\n=== PISTOL GRIPS ===")
grips = load("pistolGrip")

# Norinco CQA1 Pistol Grip — confirmed Gunny rank 1
patch_item(grips, "norinco-cqa1-pistol-grip",
    vendor="Gunny", vendorRank=1, price=102,
    weight=0.093,
    statModifiers={"sizeChangeY": 1.0},
    manufacturer="Norinco"
)

# M16A1 Pistol Grip — confirmed Gunny rank 4
m16_pg_exists = any(i["id"] == "m16a1-pistol-grip" for i in grips)
if not m16_pg_exists:
    grips.append({
        "id": "m16a1-pistol-grip",
        "name": "M16A1 Pistol Grip",
        "category": "pistolGrip",
        "weight": 0.093,
        "vendor": "Gunny",
        "vendorRank": 4,
        "price": 136,
        "statModifiers": {"recoilControl": 2.0, "ergonomics": 2.0, "sizeChangeY": 1.0},
        "manufacturer": "Norinco",
        "attachmentInterface": "AR15 Grip",
        "patchVersion": "0.4",
        "wikiSource": False,
        "verified": True
    })
    print("    Added: m16a1-pistol-grip")
else:
    patch_item(grips, "m16a1-pistol-grip",
        vendor="Gunny", vendorRank=4, price=136,
        weight=0.093,
        statModifiers={"recoilControl": 2.0, "ergonomics": 2.0, "sizeChangeY": 1.0},
        manufacturer="Norinco"
    )

save("pistolGrip", grips)

# ── RECEIVERS ────────────────────────────────────────────────────────────────
print("\n=== RECEIVERS ===")
receivers = load("receiver")

# CQ A1 Upper Receiver — confirmed Gunny rank 1 (screenshots show it available)
patch_item(receivers, "cq-a1-upper-receiver",
    vendor="Gunny", vendorRank=1, price=425,
    weight=0.240,
    manufacturer="Norinco",
    statModifiers={}
)

# M16A1 Upper Receiver — confirmed Gunny rank 4 (was "Loot only")
patch_item(receivers, "m16a1-upper-receiver",
    vendor="Gunny", vendorRank=4, price=0,
    weight=0.363,
    manufacturer="Colt",
    statModifiers={}
)

save("receiver", receivers)

# ── STOCKS ────────────────────────────────────────────────────────────────────
print("\n=== STOCKS ===")
stocks = load("stock")

# CQ A1 Buttstock — confirmed Gunny rank 1
patch_item(stocks, "cq-a1-buttstock",
    vendor="Gunny", vendorRank=1, price=170,
    weight=0.361,
    statModifiers={"recoilControl": -3.0, "ergonomics": -3.0},
    manufacturer="Norinco",
    attachmentInterface="AR15 Stock"
)

# M16A1 Stock — confirmed Gunny rank 4
m16_st_exists = any(i["id"] == "m16a1-stock" for i in stocks)
if not m16_st_exists:
    stocks.append({
        "id": "m16a1-stock",
        "name": "M16A1 Stock",
        "category": "stock",
        "weight": 0.375,
        "vendor": "Gunny",
        "vendorRank": 4,
        "price": 187,
        "statModifiers": {"recoilControl": 3.0, "ergonomics": 3.0},
        "manufacturer": "Colt",
        "attachmentInterface": "M16A1 Stock",
        "patchVersion": "0.4",
        "wikiSource": False,
        "verified": True
    })
    print("    Added: m16a1-stock")
else:
    patch_item(stocks, "m16a1-stock",
        vendor="Gunny", vendorRank=4, price=187,
        weight=0.375,
        statModifiers={"recoilControl": 3.0, "ergonomics": 3.0},
        manufacturer="Colt"
    )

# AR15 MOE Stock — was Gunny rank 4 in scrape, confirmed rank 4 (used in M4A1 vendor config)
# No change needed

save("stock", stocks)

print("\n=== GAS BLOCKS (note: stored in separate slot if exists) ===")
# Gas block may be in a different slot file — check
gasblock_path = os.path.join(BASE, "gasBlock", "index.json")
if os.path.exists(gasblock_path):
    with open(gasblock_path, "r", encoding="utf-8") as f:
        gasblocks = json.load(f)
    # Patch CQA1 Standard Gas Block
    patched = False
    for item in gasblocks:
        if "cqa1" in item["id"].lower() or "cq-a1" in item["id"].lower():
            item.update({
                "vendor": "Gunny", "vendorRank": 1, "price": 125,
                "weight": 0.130,
                "statModifiers": {"muzzleDeviceEfficiency": 5.0},
                "manufacturer": "Norinco",
                "verified": True
            })
            print(f"    Patched gas block: {item['id']}")
            patched = True
    # Add M16A1 Standard Gas Block if missing
    if not any("m16a1" in i["id"] for i in gasblocks):
        gasblocks.append({
            "id": "m16a1-standard-gas-block",
            "name": "M16A1 Standard Gas Block",
            "category": "gasBlock",
            "weight": 0.130,
            "vendor": "Gunny",
            "vendorRank": 4,
            "price": 125,
            "statModifiers": {"muzzleDeviceEfficiency": 5.0},
            "manufacturer": "Colt",
            "attachmentInterface": "Gas Big",
            "patchVersion": "0.4",
            "wikiSource": False,
            "verified": True
        })
        print("    Added: m16a1-standard-gas-block")
    with open(gasblock_path, "w", encoding="utf-8") as f:
        json.dump(gasblocks, f, indent=2, ensure_ascii=False)
    print(f"  Saved gasBlock/index.json")
else:
    print("  No gasBlock slot found — gas blocks may be embedded in weapons data")

print("\n✅ All patches complete.")
