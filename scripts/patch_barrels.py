"""Patch AR-15 barrel stats with verified in-game data from Aaron's screenshots."""
import json
from pathlib import Path

path = Path(__file__).parent.parent / "data" / "attachments" / "barrel" / "index.json"
data = json.loads(path.read_text(encoding="utf-8"))

# Verified in-game stats from Aaron's screenshots (patch 0.4.0.3)
patches = {
    "ar-15-barrel-16": {
        "muzzleVelocityMod": 8.0,
        "accuracy": 1.83,
        "statModifiers": {"ergonomics": -2.0, "sizeChangeX": 2.0},
        "manufacturer": "Colt",
        "verified": True,
    },
    "ar-15-barrel-18": {
        "muzzleVelocityMod": 12.0,
        "accuracy": 1.44,
        "statModifiers": {"ergonomics": -8.0, "sizeChangeX": 3.0},
        "manufacturer": "Colt",
        "verified": True,
    },
    "ar-15-barrel-20": {
        "muzzleVelocityMod": 20.0,
        "accuracy": 1.11,
        "statModifiers": {"ergonomics": -18.0, "sizeChangeX": 4.0},
        "manufacturer": "Colt",
        "verified": True,
    },
    "ar-15-cqa1-barrel-14-5": {
        "muzzleVelocityMod": 0.0,
        "accuracy": 4.18,
        "statModifiers": {"ergonomics": 2.0, "sizeChangeX": 2.0},
        "manufacturer": "Norinco",
        "verified": True,
    },
    "ar-15-barrel-14-5": {
        # Standard 14.5" - wiki missing stats, partial data from game context
        "muzzleVelocityMod": 4.0,   # estimated between 10.5 and 16
        "accuracy": 2.1,            # estimated
        "statModifiers": {"ergonomics": -1.0, "sizeChangeX": 2.0},
        "manufacturer": "Colt",
        "verified": False,          # not confirmed in screenshot
    },
    "ar-15-barrel-10-5": {
        # 10.5" CQB barrel - wiki missing, estimated
        "muzzleVelocityMod": -4.0,
        "accuracy": 3.5,
        "statModifiers": {"ergonomics": 4.0, "sizeChangeX": 1.0},
        "manufacturer": "Colt",
        "verified": False,
    },
}

# M16A1 barrel appeared in Aaron's screenshot - add it
m16a1 = {
    "id": "m16a1-barrel-20",
    "name": 'M16A1 Barrel - 20"',
    "category": "barrel",
    "statModifiers": {"ergonomics": -18.0, "sizeChangeX": 4.0},
    "weight": 0.97,
    "muzzleVelocityMod": 20.0,
    "accuracy": 1.22,
    "manufacturer": "Colt",
    "vendor": "Unknown",
    "vendorRank": 0,
    "price": 0,
    "patchVersion": "0.4.0.3",
    "wikiSource": False,
    "verified": True,
    "threaded": False,
    "length": None,
}

updated = 0
existing_ids = {item["id"] for item in data}

for item in data:
    if item["id"] in patches:
        item.update(patches[item["id"]])
        # Clean up stale _raw accuracy if we now have it
        if "_raw" in item:
            item["_raw"].pop("accuracy", None)
            item["_raw"].pop("muzzle_efficiency", None)
            if not item["_raw"]:
                del item["_raw"]
        updated += 1
        print(f"  [PATCHED] {item['name']}")

if "m16a1-barrel-20" not in existing_ids:
    data.append(m16a1)
    updated += 1
    print(f"  [ADDED] M16A1 Barrel - 20\"")

path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nDone. {updated} entries updated/added.")
