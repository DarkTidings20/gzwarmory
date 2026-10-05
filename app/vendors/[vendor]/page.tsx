import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import Pre05Banner from "../../components/Pre05Banner";
import {
  getVendorBySlug,
  getVendors,
  getGuidesForVendor,
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
    description: `${vendor.specialty}. ${vendor.description}`,
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

  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="vendors" />

      <div className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <Link
          href="/vendors"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← All vendors
        </Link>

        <h1 className="text-4xl font-bold text-white mt-4 mb-2">{vendor.name}</h1>
        <p className="text-amber-500 mb-2">{vendor.specialty}</p>
        <p className="text-gray-400 mb-6">{vendor.description}</p>

        <Pre05Banner />

        <h2 className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-3">
          Progression guides
        </h2>

        {guides.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 px-5 py-8 text-center">
            <p className="text-gray-400 text-sm">
              No guides yet for {vendor.name}. Ladder slots reserved — kits TBD after
              0.5 research.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {guides.map((guide) => (
              <li key={guide.id}>
                <Link
                  href={`/vendors/${vendor.slug}/${guide.slug}`}
                  className="block bg-gray-900 border border-gray-800 hover:border-amber-700/50 rounded-xl px-5 py-4 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {guide.title}
                      </h3>
                      {guide.subtitle ? (
                        <p className="text-sm text-gray-500 mt-1">{guide.subtitle}</p>
                      ) : null}
                      <p className="text-xs font-mono text-gray-600 mt-2">
                        {guide.tiers.length} tiers · {guide.patchVersion}
                      </p>
                    </div>
                    <span className="text-amber-500 text-sm shrink-0">View →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-gray-600 mt-8">
          Long fiction for this vendor (if any) lives under{" "}
          <Link href="/dispatches" className="text-gray-400 underline hover:text-gray-200">
            Dispatches
          </Link>
          , not in the short tier vignettes.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
