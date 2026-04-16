import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import WeaponBuilder from "../components/WeaponBuilder";

async function getWeaponData() {
  const dataDir = path.join(process.cwd(), "data");

  // Load weapon
  const weaponFile = await fs.readFile(path.join(dataDir, "weapons", "M4A1.json"), "utf-8");
  const weapon = JSON.parse(weaponFile);

  // Load attachments
  const attachmentCategories = ["pistolGrip", "magazine", "chargingHandle", "receiver", "bufferTube"];
  const allAttachments: Record<string, object> = {};

  for (const cat of attachmentCategories) {
    const filePath = path.join(dataDir, "attachments", cat, "index.json");
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const items = JSON.parse(raw);
      for (const item of items) {
        allAttachments[item.id] = item;
      }
    } catch {
      // Category not yet populated
    }
  }

  return { weapon, allAttachments };
}

export default async function BuilderPage() {
  const { weapon, allAttachments } = await getWeaponData();

  return (
    <main className="flex flex-col min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight text-white">
            GZW <span className="text-amber-500">Armory</span>
          </span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
            v0.4.0.2
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/builder" className="text-white font-medium">Weapon Builder</Link>
          <Link href="/loadout" className="hover:text-white transition-colors">Loadout Calc</Link>
        </div>
      </nav>

      <div className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Weapon selector header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{weapon.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{weapon.type} · {weapon.caliber}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-lg">
            More weapons coming soon
          </div>
        </div>

        <WeaponBuilder weapon={weapon} allAttachments={allAttachments} />

        <p className="text-xs text-gray-700 mt-8 text-center">
          Stat values are community-sourced estimates. Some attachment stats are placeholders pending in-game verification.{" "}
          <a href="https://github.com/DarkTidings20/gzwarmory" className="text-gray-600 hover:text-gray-400 underline" target="_blank" rel="noopener noreferrer">
            Help us improve the data →
          </a>
        </p>
      </div>

      <footer className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-600">
        GZW Armory is an unofficial fan tool. Not affiliated with or endorsed by MADFINGER Games.
      </footer>
    </main>
  );
}
