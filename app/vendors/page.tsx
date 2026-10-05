import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import Pre05Banner from "../components/Pre05Banner";
import { getVendors, getVendorsFile, getGuidesForVendor } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Vendors — GZW Armory",
  description:
    "Gray Zone Warfare kit guides organized by vendor and unlock level. Pre-0.5 skeleton.",
};

const statusLabel: Record<string, string> = {
  skeleton: "Skeleton",
  partial: "Partial",
  ready: "Ready",
};

export default async function VendorsHubPage() {
  const file = await getVendorsFile();
  const vendors = await getVendors();

  const withGuides = await Promise.all(
    vendors.map(async (v) => ({
      vendor: v,
      guides: await getGuidesForVendor(v.id),
    })),
  );

  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="vendors" />

      <div className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-2">
          Progression ladder
        </p>
        <h1 className="text-4xl font-bold text-white mb-3">Vendors</h1>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Kit guides organized by who sells them and when you unlock them. Meet the
          operator where they are — Level 1 through endgame.{" "}
          <span className="text-gray-500">{file.patchNote}</span>
        </p>

        <Pre05Banner />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {withGuides.map(({ vendor, guides }) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.slug}`}
              className="group bg-gray-900 border border-gray-800 hover:border-amber-700/50 rounded-xl p-5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {vendor.name}
                </h2>
                <span className="text-[10px] font-mono uppercase text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                  {statusLabel[vendor.status] ?? vendor.status}
                </span>
              </div>
              <p className="text-sm text-amber-500/90 mb-2">{vendor.specialty}</p>
              <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                {vendor.description}
              </p>
              <p className="text-xs font-mono text-gray-600">
                {guides.length === 0
                  ? "Guides TBD"
                  : `${guides.length} guide${guides.length === 1 ? "" : "s"}`}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
