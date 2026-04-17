import Link from "next/link";
import Image from "next/image";
import RavenQuote from "./components/RavenQuote";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/raven-sigil.png" alt="GZW Armory" width={36} height={36} className="object-contain" />
          <span className="text-2xl font-bold tracking-tight text-white">
            GZW <span className="text-amber-500">Armory</span>
          </span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
            v0.4.0.2
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/builder" className="hover:text-white transition-colors">
            Weapon Builder
          </Link>
          <Link href="/loadout" className="hover:text-white transition-colors">
            Loadout Calc
          </Link>
          <a
            href="https://github.com/DarkTidings20/gzwarmory"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <div className="max-w-2xl">
          <div className="flex justify-center mb-8">
            <Image src="/raven-sigil.png" alt="The Raven" width={180} height={180} className="object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Build smarter.<br />
            <span className="text-amber-500">Die less.</span>
          </h1>
          <RavenQuote />
          <p className="text-gray-400 text-lg mb-10 mt-4">
            The only interactive weapon builder and PMC loadout calculator for Gray Zone Warfare.
            Slot attachments, see live stat changes, optimize your carry weight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Weapon Builder →
            </Link>
            <Link
              href="/loadout"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Loadout Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-amber-500 text-2xl mb-3">🔧</div>
            <h3 className="font-semibold text-white mb-2">Choose Your Instrument</h3>
            <p className="text-gray-400 text-sm">
              Pick your weapon, slot compatible attachments, and watch your stats shift in real time. Know what you're bringing before you drop.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-amber-500 text-2xl mb-3">🎽</div>
            <h3 className="font-semibold text-white mb-2">Know Your Weight</h3>
            <p className="text-gray-400 text-sm">
              Overloaded operators die tired. Track your full kit against the 33kg and 54kg thresholds before the mission costs you.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-amber-500 text-2xl mb-3">⚖️</div>
            <h3 className="font-semibold text-white mb-2">The Numbers Don't Lie</h3>
            <p className="text-gray-400 text-sm">
              Every gram is a trade. Optimal (&lt;33kg), degraded (&lt;54kg), or overweight — the Armory shows you exactly where you stand.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-600">
        Built by operators, for operators. The Armory remembers what you forget under fire.<br />
        <span className="mt-1 block">Unofficial fan tool — not affiliated with or endorsed by MADFINGER Games.</span>
      </footer>
    </main>
  );
}
