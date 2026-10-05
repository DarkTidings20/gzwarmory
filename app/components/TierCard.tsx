import Link from "next/link";
import type { GuideTier } from "@/lib/types/guides";
import FictionSlot from "./FictionSlot";
import VerifiedBadge from "./VerifiedBadge";

function formatCost(cost: number | null): string {
  if (cost === null) return "TBD";
  return `$${cost.toLocaleString()}`;
}

function formatWeight(weight: number | null): string {
  if (weight === null) return "TBD";
  return `${weight} kg`;
}

function formatUnlock(value: string | number | "TBD"): string {
  if (value === "TBD" || value === "") return "TBD";
  return String(value);
}

export default function TierCard({ tier }: { tier: GuideTier }) {
  return (
    <section
      id={tier.id}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 scroll-mt-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{tier.label}</h3>
          <p className="text-xs font-mono text-gray-500 mt-1">
            Unlock level: {formatUnlock(tier.unlockLevel)} · Vendor rank:{" "}
            {formatUnlock(tier.unlockRank)}
          </p>
        </div>
        {tier.builderDeepLink ? (
          <Link
            href={tier.builderDeepLink}
            className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            Open in Builder →
          </Link>
        ) : null}
      </div>

      <FictionSlot fiction={tier.fiction} placement="hook" />

      <p className="text-sm text-gray-400 mb-5">{tier.summary}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs font-mono uppercase tracking-wider text-gray-500 border-b border-gray-800">
              <th className="py-2 pr-3 font-medium">Item</th>
              <th className="py-2 pr-3 font-medium">Role</th>
              <th className="py-2 pr-3 font-medium">Cost</th>
              <th className="py-2 pr-3 font-medium">Weight</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tier.items.map((item, i) => (
              <tr
                key={`${tier.id}-${i}-${item.name}`}
                className="border-b border-gray-800/80 align-top"
              >
                <td className="py-3 pr-3">
                  <div className="text-white font-medium">{item.name}</div>
                  {item.notes ? (
                    <p className="text-xs text-gray-500 mt-1 max-w-md">{item.notes}</p>
                  ) : null}
                  {item.source ? (
                    <p className="text-[10px] font-mono text-gray-600 mt-1">
                      {item.source}
                    </p>
                  ) : null}
                </td>
                <td className="py-3 pr-3 text-gray-400">{item.role ?? "—"}</td>
                <td className="py-3 pr-3 font-mono text-gray-300">
                  {formatCost(item.cost)}
                </td>
                <td className="py-3 pr-3 font-mono text-gray-300">
                  {formatWeight(item.weight)}
                </td>
                <td className="py-3 pr-3">
                  <VerifiedBadge verified={item.verified} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FictionSlot fiction={tier.fiction} placement="vignette" />
    </section>
  );
}
