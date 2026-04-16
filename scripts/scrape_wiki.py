"""
GZW Fandom Wiki Attachment Scraper
Pulls all attachment data from gray-zone-warfare.fandom.com via MediaWiki API
Outputs structured JSON files per category
"""

import json
import re
import sys
import time
import urllib.request
import urllib.parse
from pathlib import Path

# Fix Windows console encoding for Unicode characters
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BASE_API = "https://gray-zone-warfare.fandom.com/api.php"

# Attachment categories to scrape
ATTACHMENT_CATEGORIES = [
    "Collimators",
    "Scopes",
    "Barrels",
    "Buffer Tubes",
    "Charging Handle",
    "Foregrips",
    "Front Iron Sights",
    "Handguards",
    "Magazines",
    "Muzzle Devices",
    "Pistol Grips",
    "Rear Iron Sights",
    "Receivers",
    "Stocks",
    "Suppressors",
    "Underbarrel",
    "Laser Sights",
    "Flashlights",
]

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "attachments"


def api_get(params: dict) -> dict:
    params["format"] = "json"
    url = BASE_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "GZWArmoryBot/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_category_pages(category: str) -> list[dict]:
    """Get all page titles+ids in a category, handling pagination."""
    pages = []
    cmcontinue = None
    while True:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": f"Category:{category}",
            "cmlimit": "500",
            "cmtype": "page",
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        data = api_get(params)
        members = data.get("query", {}).get("categorymembers", [])
        pages.extend(members)
        if "continue" in data and "cmcontinue" in data["continue"]:
            cmcontinue = data["continue"]["cmcontinue"]
        else:
            break
        time.sleep(0.2)
    return pages


def get_page_content(page_ids: list[int]) -> dict:
    """Fetch wikitext for a batch of page ids (max 50)."""
    params = {
        "action": "query",
        "pageids": "|".join(str(p) for p in page_ids),
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
    }
    data = api_get(params)
    return data.get("query", {}).get("pages", {})


def parse_infobox(wikitext: str) -> dict:
    """Parse {{Infobox ...}} template fields from wikitext."""
    result = {}

    # Find infobox block
    match = re.search(r"\{\{Infobox[^}]*\n(.*?)\}\}", wikitext, re.DOTALL | re.IGNORECASE)
    if not match:
        # Try alternate: infobox might span to end without closing }}
        match = re.search(r"\{\{Infobox.*?\n(.*)", wikitext, re.DOTALL | re.IGNORECASE)
    if not match:
        return result

    infobox_text = match.group(0)

    # Extract | key = value pairs
    field_re = re.compile(r"^\s*\|\s*(\w+)\s*=\s*(.*?)(?=\n\s*\||\}\})", re.MULTILINE | re.DOTALL)
    for m in field_re.finditer(infobox_text):
        key = m.group(1).strip()
        val = m.group(2).strip()
        # Clean up wiki markup
        val = re.sub(r"\[\[([^\|\]]+\|)?([^\]]+)\]\]", r"\2", val)  # [[link|text]] -> text
        val = re.sub(r"\{\{[^}]+\}\}", "", val)  # remove templates
        val = re.sub(r"<[^>]+>", "", val)  # remove HTML tags
        val = val.strip()
        if val:
            result[key] = val

    return result


def normalize_attachment(title: str, infobox: dict, category: str) -> dict:
    """Normalize infobox fields into our standard attachment schema."""

    def num(val, default=None):
        if val is None:
            return default
        try:
            return float(val.replace("%", "").replace("+", "").strip())
        except (ValueError, AttributeError):
            return default

    def yn_bool(val):
        if val is None:
            return None
        return val.strip().lower() in ("yes", "true", "1")

    attachment = {
        "id": title.lower().replace(" ", "_").replace("(", "").replace(")", "").replace("/", "_"),
        "name": title,
        "category": category,
        "verified": True,
        "source": "fandom_wiki",
    }

    # Map common infobox field names
    field_map = {
        "weight": ("weight", num),
        "type": ("type", str),
        "manufacturer": ("manufacturer", str),
        # attachment interface variants
        "attachment_interface": ("attachmentInterface", str),
        "interface": ("attachmentInterface", str),
        "attachmentinterface": ("attachmentInterface", str),
        # sighting range variants
        "sighting_range": ("sightingRange", num),
        "sightingrange": ("sightingRange", num),
        "sight_range": ("sightingRange", num),
        "sightrange": ("sightingRange", num),
        # magnification
        "magnification": ("magnification", num),
        # NVG
        "nvg_compatible": ("nvgCompatible", yn_bool),
        "nvgcompatible": ("nvgCompatible", yn_bool),
        "nvg": ("nvgCompatible", yn_bool),
        # size / ergonomics
        "size_change_y": ("sizeChangeY", num),
        "size_change_x": ("sizeChangeX", num),
        "vertical": ("sizeChangeY", num),
        "horizontal": ("sizeChangeX", num),
        "ergonomics": ("ergonomics", num),
        "handling": ("ergonomics", num),   # wiki uses 'handling' for ergonomics
        # durability / recoil / velocity
        "durability": ("durability", num),
        "recoil": ("recoil", num),
        "velocity": ("velocity", num),
        "muzzle_velocity": ("muzzleVelocity", num),
        "muzzlevelocity": ("muzzleVelocity", num),
        "length": ("length", num),
        "silenced": ("silenced", yn_bool),
        # vendor / price info
        "vendor": ("vendor", str),
        "bprice": ("buyPrice", num),
        "sprice": ("sellPrice", num),
        # ammo capacity
        "capacity": ("capacity", num),
        "caliber": ("caliber", str),
        "ammo": ("caliber", str),
    }

    for wiki_key, (out_key, converter) in field_map.items():
        val = infobox.get(wiki_key) or infobox.get(wiki_key.replace("_", ""))
        if val is not None:
            converted = converter(val)
            if converted is not None:
                attachment[out_key] = converted

    # Keep raw infobox fields we didn't map as extras
    mapped_keys = set(field_map.keys()) | {k.replace("_", "") for k in field_map.keys()}
    extras = {k: v for k, v in infobox.items() if k.lower() not in mapped_keys and v}
    if extras:
        attachment["_raw"] = extras

    return attachment


def scrape_category(category: str) -> list[dict]:
    print(f"\n[{category}] Fetching page list...")
    pages = get_category_pages(category)
    print(f"[{category}] Found {len(pages)} pages")

    if not pages:
        return []

    attachments = []
    # Process in batches of 50
    batch_size = 50
    for i in range(0, len(pages), batch_size):
        batch = pages[i : i + batch_size]
        page_ids = [p["pageid"] for p in batch]
        print(f"[{category}] Fetching content batch {i//batch_size + 1}...")
        content_pages = get_page_content(page_ids)

        for page_id_str, page_data in content_pages.items():
            title = page_data.get("title", "")
            revisions = page_data.get("revisions", [])
            if not revisions:
                continue
            # Handle both old and new rvslots format
            rev = revisions[0]
            wikitext = rev.get("slots", {}).get("main", {}).get("*") or rev.get("*", "")
            if not wikitext:
                continue

            infobox = parse_infobox(wikitext)
            if not infobox:
                print(f"  [SKIP] {title} — no infobox found")
                continue

            attachment = normalize_attachment(title, infobox, category)
            attachments.append(attachment)
            print(f"  [OK] {title}")

        time.sleep(0.3)  # be polite to the API

    return attachments


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    all_attachments = {}
    summary = {}

    for category in ATTACHMENT_CATEGORIES:
        try:
            attachments = scrape_category(category)
            if attachments:
                # Save per-category file
                safe_name = category.lower().replace(" ", "_")
                out_file = OUTPUT_DIR / f"{safe_name}.json"
                with open(out_file, "w", encoding="utf-8") as f:
                    json.dump(attachments, f, indent=2, ensure_ascii=False)
                print(f"[{category}] Saved {len(attachments)} attachments → {out_file}")
                all_attachments[category] = attachments
                summary[category] = len(attachments)
            else:
                print(f"[{category}] No data found (category may not exist on wiki)")
                summary[category] = 0
        except Exception as e:
            print(f"[{category}] ERROR: {e}")
            summary[category] = f"ERROR: {e}"

    # Save combined file
    combined_out = OUTPUT_DIR / "all_attachments.json"
    flat_list = [a for cat_list in all_attachments.values() for a in cat_list]
    with open(combined_out, "w", encoding="utf-8") as f:
        json.dump(flat_list, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print(f"COMPLETE — {len(flat_list)} total attachments scraped")
    print(f"Output: {OUTPUT_DIR}")
    print("\nSummary:")
    for cat, count in summary.items():
        print(f"  {cat}: {count}")


if __name__ == "__main__":
    main()
