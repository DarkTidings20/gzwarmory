import Link from "next/link";

export default function LoadoutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          GZW <span className="text-amber-500">Armory</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/builder" className="hover:text-white transition-colors">Weapon Builder</Link>
          <Link href="/loadout" className="text-white">Loadout Calc</Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <div className="text-6xl mb-6">🎽</div>
        <h1 className="text-4xl font-bold text-white mb-4">Loadout Calculator</h1>
        <p className="text-gray-400 text-lg max-w-md">
          Coming soon. Slot your full kit and track carry weight against the 33kg and 54kg thresholds.
        </p>
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 text-sm text-gray-500">
          Data version: 0.4.0.2 · Spearhead
        </div>
      </div>
    </main>
  );
}
