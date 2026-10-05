import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import Pre05Banner from "../../components/Pre05Banner";
import TierCard from "../../components/TierCard";
import {
  getVendorBySlug,
  getVendors,
  getGuidesForVendor,
  placeholderTiers,
} from "@/lib/guides";

export async function generateStaticParams() {
  const vendors = await getVendors();
  return vendors.map((v) => ({ vendor: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendor: string }>;
}): Promise<Metadata> {
  const { vendor: slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) return { title: "Vendor — GZW Armory" };
  return {
    title: `${vendor.name} — GZW Armory`,
    description: `${vendor.specialty}. Suggested builds by unlock level.`,
  };
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ vendor: string }>;
}) {
  const { vendor: slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) notFound();

  const guides = await getGuidesForVendor(vendor.id);
  const hasGuides = guides.length > 0;

  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="vendors" />

      <div className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
        <Link
          href="/vendors"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← All vendors
        </Link>

        <h1 className="text-4xl font-bold text-white mt-4 mb-2">{vendor.name}</h1>
        <p className="text-amber-500 mb-2">{vendor.specialty}</p>
        <p className="text-gray-400 mb-6">{vendor.description}</p>

        <Pre05Banner detail="Suggested builds by unlock level. Real data only where it already exists in the repo; everything else is a marked placeholder." />

        {hasGuides ? (
          <div className="space-y-10">
            {guides.map((guide) => (
              <section key={guide.id}>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {guide.title}
                    </h2>
                    {guide.subtitle ? (
                      <p className="text-sm text-gray-500 mt-1">{guide.subtitle}</p>
                    ) : null}
                    <p className="text-xs font-mono text-gray-600 mt-1">
                      {guide.patchVersion}
                    </p>
                  </div>
                  <Link
                    href={`/vendors/${vendor.slug}/${guide.slug}`}
                    className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Open guide page →
                  </Link>
                </div>

                <nav className="flex flex-wrap gap-2 mb-6">
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
              </section>
            ))}
          </div>
        ) : (
          <section>
            <h2 className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-3">
              Suggested builds by unlock
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              No verified guide data for {vendor.name} yet. Ladder slots below are
              placeholders only.
            </p>
            <div className="space-y-6">
              {placeholderTiers(vendor.name).map((tier) => (
                <TierCard key={tier.id} tier={tier} />
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-gray-600 mt-10">
          Long fiction for this vendor (if any) lives under{" "}
          <Link
            href="/dispatches"
            className="text-gray-400 underline hover:text-gray-200"
          >
            Dispatches
          </Link>
          , not in the short tier vignettes.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
