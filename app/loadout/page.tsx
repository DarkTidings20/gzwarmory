import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export default function LoadoutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="loadout" />

      <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <div className="text-6xl mb-6">🎽</div>
        <h1 className="text-4xl font-bold text-white mb-4">Loadout Calculator</h1>
        <p className="text-gray-400 text-lg max-w-md">
          Coming soon. Slot your full kit and track carry weight against the 33kg and 54kg thresholds.
        </p>
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 text-sm text-gray-500">
          Data version: pre-0.5 skeleton
        </div>
        <Link
          href="/vendors"
          className="mt-6 text-sm text-amber-500 hover:text-amber-400 transition-colors"
        >
          ← Back to vendor guides
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}
