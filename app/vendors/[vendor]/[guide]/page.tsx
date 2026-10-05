import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "../../../components/SiteNav";
import SiteFooter from "../../../components/SiteFooter";
import Pre05Banner from "../../../components/Pre05Banner";
import TierCard from "../../../components/TierCard";
import {
  getAllGuideParams,
  getGuideByVendorAndSlug,
} from "@/lib/guides";

export async function generateStaticParams() {
  return getAllGuideParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendor: string; guide: string }>;
}): Promise<Metadata> {
  const { vendor: vendorSlug, guide: guideSlug } = await params;
  const result = await getGuideByVendorAndSlug(vendorSlug, guideSlug);
  if (!result) return { title: "Guide — GZW Armory" };
  return {
    title: `${result.guide.title} · ${result.vendor.name} — GZW Armory`,
    description:
      result.guide.subtitle ??
      `${result.guide.title} progression ladder via ${result.vendor.name}.`,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ vendor: string; guide: string }>;
}) {
  const { vendor: vendorSlug, guide: guideSlug } = await params;
  const result = await getGuideByVendorAndSlug(vendorSlug, guideSlug);
  if (!result) notFound();

  const { vendor, guide } = result;

  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="vendors" />

      <div className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          <Link href="/vendors" className="hover:text-gray-300 transition-colors">
            Vendors
          </Link>
          <span>/</span>
          <Link
            href={`/vendors/${vendor.slug}`}
            className="hover:text-gray-300 transition-colors"
          >
            {vendor.name}
          </Link>
          <span>/</span>
          <span className="text-gray-400">{guide.title}</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">{guide.title}</h1>
        {guide.subtitle ? (
          <p className="text-gray-400 mb-2">{guide.subtitle}</p>
        ) : null}
        <p className="text-xs font-mono text-gray-600 mb-6">{guide.patchVersion}</p>

        {guide.pre05 ? (
          <Pre05Banner detail="Gunny M4 ladder skeleton. Level 1 uses M4A1 repo data only; mid and endgame are empty placeholders. Unlock levels marked TBD. Suggested-build slots use repo data only where available; mid/endgame are placeholders. Fiction coming soon." />
        ) : null}

        <nav className="flex flex-wrap gap-2 mb-8">
          {guide.tiers.map((tier) => (
            <a
              key={tier.id}
              href={`#${tier.id}`}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:border-amber-700/50 hover:text-amber-400 transition-colors"
            >
              {tier.label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          {guide.tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>

        <p className="text-xs text-gray-600 mt-10 text-center">
          Long chapters (e.g. Sunny Skies) belong in{" "}
          <Link href="/dispatches" className="underline hover:text-gray-400">
            Dispatches
          </Link>
          , linked from tiers when ready — not crammed into a 200-word vignette slot.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
