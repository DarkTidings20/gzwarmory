import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import WeaponBuilderShell from "../components/WeaponBuilderShell";

async function getAllData() {
  const dataDir = path.join(process.cwd(), "data");

  // Load all weapons
  const weaponFiles = await fs.readdir(path.join(dataDir, "weapons"));
  const weapons = await Promise.all(
    weaponFiles
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(dataDir, "weapons", f), "utf-8");
        return JSON.parse(raw);
      })
  );

  // Load all attachments
  const attachmentDir = path.join(dataDir, "attachments");
  const allAttachments: Record<string, object> = {};
  try {
    const categories = await fs.readdir(attachmentDir);
    for (const cat of categories) {
      const filePath = path.join(attachmentDir, cat, "index.json");
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const items = JSON.parse(raw);
        for (const item of items) {
          allAttachments[item.id] = item;
        }
      } catch { /* not yet populated */ }
    }
  } catch { /* no attachments dir */ }

  return { weapons, allAttachments };
}

export default async function BuilderPage() {
  const { weapons, allAttachments } = await getAllData();
  const sortedWeapons = weapons.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="flex flex-col min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight text-white">
            GZW <span className="text-amber-500">Armory</span>
          </span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
            v0.4.0.3
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/builder" className="text-white font-medium">Weapon Builder</Link>
          <Link href="/loadout" className="hover:text-white transition-colors">Loadout Calc</Link>
        </div>
      </nav>

      <div className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <WeaponBuilderShell weapons={sortedWeapons} allAttachments={allAttachments} />

        <p className="text-xs text-gray-700 mt-8 text-center">
          Stats sourced from in-game screenshots. Some attachment data is estimated pending full verification.{" "}
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
