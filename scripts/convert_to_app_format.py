"""
Convert scraped wiki JSON into the GZW Armory app's existing slot-based format.
Maps category names → slot directory names and transforms fields.
"""

import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SCRAPED_DIR = Path(__file__).parent.parent / "data" / "attachments"
OUTPUT_BASE = SCRAPED_DIR  # Write index.json into existing slot dirs

# Map: wiki category file → app slot directory name
CATEGORY_MAP = {
    "collimators": "optic",
    "scopes": "optic",
    "barrels": "barrel",
    "buffer_tubes": "bufferTube",
    "charging_handle": "chargingHandle",
    "foregrips": "foregrip",
    "front_iron_sights": "optic",    # iron sights go under optic slot
    "rear_iron_sights": "optic",     # same
    "handguards": "handguard",
    "magazines": "magazine",
    "muzzle_devices": "muzzleDevice",
    "pistol_grips": "pistolGrip",
    "stocks": "stock",
    "suppressors": "muzzleDevice",   # suppressors share the muzzle device slot
}

PATCH_VERSION = "0.4.0.3"


def make_id(name: str) -> str:
    """Convert name to kebab-case id."""
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = s.strip("-")
    return s


def parse_vendor_rank(vendor_str: str) -> tuple[str, int]:
    """Parse 'Gunny R.3' → ('Gunny', 3)"""
    if not vendor_str:
        return ("Unknown", 0)
    m = re.search(r"R\.(\d+)", vendor_str)
    rank = int(m.group(1)) if m else 0
    name_part = re.sub(r"\s*R\.\d+", "", vendor_str).strip()
    return (name_part, rank)


def convert_attachment(item: dict, slot: str) -> dict:
    vendor_raw = item.get("vendor", "")
    vendor_name, vendor_rank = parse_vendor_rank(vendor_raw)

    buy_price = item.get("buyPrice")
    if buy_price is None:
        buy_price = 0
    else:
        try:
            buy_price = int(float(str(buy_price).replace(",", "")))
        except (ValueError, TypeError):
            buy_price = 0

    # Build stat modifiers from available data
    stat_mods = {}
    if item.get("ergonomics") is not None:
        stat_mods["ergonomics"] = item["ergonomics"]
    if item.get("recoil") is not None:
        stat_mods["recoil"] = item["recoil"]
    if item.get("sizeChangeY") is not None:
        stat_mods["sizeChangeY"] = item["sizeChangeY"]
    if item.get("sizeChangeX") is not None:
        stat_mods["sizeChangeX"] = item["sizeChangeX"]

    converted = {
        "id": make_id(item["name"]),
        "name": item["name"],
        "category": slot,
        "statModifiers": stat_mods,
        "weight": item.get("weight", 0),
        "vendor": vendor_name if vendor_name else "Unknown",
        "vendorRank": vendor_rank,
        "price": buy_price,
        "patchVersion": PATCH_VERSION,
        "wikiSource": True,
    }

    # Slot-specific fields
    if slot == "optic":
        converted["magnification"] = f"{item.get('magnification', 1)}x" if item.get("magnification") else "1x"
        converted["sightRange"] = item.get("sightingRange", 300)
        converted["nvgCompatible"] = item.get("nvgCompatible", False)
    elif slot == "barrel":
        converted["muzzleVelocityMod"] = item.get("muzzleVelocity", 0)
        converted["length"] = item.get("length")
        converted["threaded"] = "threaded" in item["name"].lower() or "suppressed" in item["name"].lower()
    elif slot == "magazine":
        # Try to extract capacity from name
        m = re.search(r"(\d+)-Round", item["name"])
        converted["capacity"] = int(m.group(1)) if m else item.get("capacity", 30)
        # Extract caliber from name
        cal_m = re.search(r"(\d+[\.\d]*x\d+\w*|\.45\w*|9x19\w*|\.\d+\w*)", item["name"])
        converted["caliber"] = cal_m.group(1) if cal_m else item.get("caliber", "Unknown")
    elif slot == "muzzleDevice":
        name_lower = item["name"].lower()
        converted["isSuppressor"] = any(w in name_lower for w in ["suppressor", "silencer", "sd", "hk mp5sd"])
        converted["isFlashHider"] = any(w in name_lower for w in ["flash hider", "flash suppressor", "moderator"])
        converted["isMuzzleBrake"] = any(w in name_lower for w in ["muzzle brake", "muzzle break", "compensator", "tanker"])

    # Pass through extras from _raw for future reference
    if item.get("_raw"):
        raw = {k: v for k, v in item["_raw"].items() if k != "image"}
        if raw:
            converted["_raw"] = raw

    return converted


def main():
    # Collect all items per slot
    slot_items: dict[str, list] = {}

    for wiki_file, slot in CATEGORY_MAP.items():
        src = SCRAPED_DIR / f"{wiki_file}.json"
        if not src.exists():
            print(f"[SKIP] {wiki_file}.json not found")
            continue

        with open(src, encoding="utf-8") as f:
            items = json.load(f)

        print(f"[{wiki_file}] → slot '{slot}': {len(items)} items")

        if slot not in slot_items:
            slot_items[slot] = []

        for item in items:
            try:
                converted = convert_attachment(item, slot)
                slot_items[slot].append(converted)
            except Exception as e:
                print(f"  [ERR] {item.get('name', '?')}: {e}")

    # Deduplicate within each slot (same id from multiple categories)
    for slot, items in slot_items.items():
        seen = {}
        deduped = []
        for item in items:
            if item["id"] not in seen:
                seen[item["id"]] = True
                deduped.append(item)
        slot_items[slot] = deduped

        # Write output
        out_dir = OUTPUT_BASE / slot
        out_dir.mkdir(exist_ok=True)
        out_file = out_dir / "index.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(deduped, f, indent=2, ensure_ascii=False)
        print(f"[{slot}] Wrote {len(deduped)} items → {out_file}")

    total = sum(len(v) for v in slot_items.values())
    print(f"\nDone. {total} total items across {len(slot_items)} slots.")


if __name__ == "__main__":
    main()
