import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import Pre05Banner from "../components/Pre05Banner";
import { getDispatches } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Dispatches — GZW Armory",
  description:
    "Long-form Gray Zone Warfare fiction. Chapters live here; short vignettes sit under kit tiers.",
};

const statusLabel: Record<string, string> = {
  placeholder: "Awaiting draft",
  draft: "Draft",
  published: "Published",
};

export default async function DispatchesPage() {
  const file = await getDispatches();

  return (
    <main className="flex flex-col min-h-screen">
      <SiteNav active="dispatches" />

      <div className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-2">
          Fiction · long form
        </p>
        <h1 className="text-4xl font-bold text-white mb-3">Dispatches</h1>
        <p className="text-gray-400 mb-6">{file.intro}</p>

        <Pre05Banner detail="Chapter bodies are not in this repo yet. This page is a stub so tier guides can link out without stuffing 3,000+ words into a vignette slot." />

        <ul className="space-y-4">
          {file.dispatches.map((d) => (
            <li
              key={d.id}
              className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-xl font-semibold text-white">{d.title}</h2>
                <span className="text-[10px] font-mono uppercase text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                  {statusLabel[d.status] ?? d.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{d.summary}</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 font-mono mb-3">
                <div>
                  <dt className="text-gray-600">Author</dt>
                  <dd>{d.author}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Word count</dt>
                  <dd>{d.wordCount ?? "TBD"}</dd>
                </div>
              </dl>
              <p className="text-xs text-gray-500 border-t border-gray-800 pt-3">
                {d.locationNote}
              </p>
              {d.linkedFromTiers && d.linkedFromTiers.length > 0 ? (
                <p className="text-xs text-gray-600 mt-2">
                  Related vendors:{" "}
                  {d.linkedFromTiers.map((slug, i) => (
                    <span key={slug}>
                      {i > 0 ? ", " : null}
                      <Link
                        href={`/vendors/${slug}`}
                        className="text-amber-600 hover:text-amber-400 underline"
                      >
                        {slug}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <SiteFooter />
    </main>
  );
}
