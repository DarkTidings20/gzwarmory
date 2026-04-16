import json
from pathlib import Path

base = Path(__file__).parent.parent / "data" / "attachments"

for slot_dir in sorted(base.iterdir()):
    if slot_dir.is_dir():
        idx = slot_dir / "index.json"
        if idx.exists():
            data = json.loads(idx.read_text(encoding="utf-8"))
            print(f"\n=== {slot_dir.name} ({len(data)}) ===")
            for item in data:
                print(f"  {item['id']}  |  {item['name']}")
