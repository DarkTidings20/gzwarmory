import Link from "next/link";
import Image from "next/image";
import RavenQuote from "./components/RavenQuote";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="home" />

      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <div className="max-w-2xl">
          <div className="flex justify-center mb-8">
            <Image
              src="/raven-sigil.png"
              alt="The Raven"
              width={180}
              height={180}
              className="object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Know the vendor.
            <br />
            <span className="text-amber-500">Buy the right kit.</span>
          </h1>
          <RavenQuote />
          <p className="text-gray-400 text-lg mb-10 mt-4">
            Suggested gun builds for Gray Zone Warfare — organized by vendor and unlock
            level, with field notes under each tier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vendors"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Vendor Guides →
            </Link>
            <Link
              href="/vendors/gunny"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Gunny M4 Ladder →
            </Link>
          </div>
          <p className="text-xs text-amber-600/80 font-mono mt-6">
            pre-0.5 research window — skeleton only, not launch content
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-amber-500 text-2xl mb-3">🏪</div>
            <h3 className="font-semibold text-white mb-2">Seven Vendors</h3>
            <p className="text-gray-400 text-sm">
              Handshake, Gunny, Lab Rat, Artisan, Turncoat, Banshee, Vulture — builds
              organized by who sells them and when you unlock them.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-amber-500 text-2xl mb-3">📶</div>
            <h3 className="font-semibold text-white mb-2">Suggested Builds</h3>
            <p className="text-gray-400 text-sm">
              Each unlock tier has a suggested build slot: weapon, attachments, ammo,
              and notes. Level 1 is the CQ A1 via Gunny; the M4A1 is buyable from Level 2.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-amber-500 text-2xl mb-3">📝</div>
            <h3 className="font-semibold text-white mb-2">Kit First, Story Second</h3>
            <p className="text-gray-400 text-sm">
              Short vignettes under each tier. Long chapters in Dispatches. Data earns
              the read; fiction earns the bookmark.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
