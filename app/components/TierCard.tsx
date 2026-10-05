import type { GuideItem, GuideTier, SuggestedAmmo } from "@/lib/types/guides";
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

function ItemRow({ item }: { item: GuideItem }) {
  return (
    <tr className="border-b border-gray-800/80 align-top">
      <td className="py-3 pr-3">
        <div className="text-white font-medium">{item.name}</div>
        {item.notes ? (
          <p className="text-xs text-gray-500 mt-1 max-w-md">{item.notes}</p>
        ) : null}
        {item.source ? (
          <p className="text-[10px] font-mono text-gray-600 mt-1">{item.source}</p>
        ) : null}
      </td>
      <td className="py-3 pr-3 text-gray-400">{item.role ?? "—"}</td>
      <td className="py-3 pr-3 font-mono text-gray-300">{formatCost(item.cost)}</td>
      <td className="py-3 pr-3 font-mono text-gray-300">
        {formatWeight(item.weight)}
      </td>
      <td className="py-3 pr-3">
        <VerifiedBadge verified={item.verified} />
      </td>
    </tr>
  );
}

function AmmoBlock({ ammo }: { ammo: SuggestedAmmo | null }) {
  if (!ammo) {
    return (
      <p className="text-sm text-gray-500 italic">Ammo: TBD</p>
    );
  }
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-3">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
          Ammo
        </p>
        <p className="text-white font-medium">{ammo.name}</p>
        {ammo.notes ? (
          <p className="text-xs text-gray-500 mt-1 max-w-xl">{ammo.notes}</p>
        ) : null}
        {ammo.source ? (
          <p className="text-[10px] font-mono text-gray-600 mt-1">{ammo.source}</p>
        ) : null}
      </div>
      <VerifiedBadge verified={ammo.verified} />
    </div>
  );
}

function BuildTable({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: GuideItem[];
  emptyLabel: string;
}) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic border border-dashed border-gray-800 rounded-lg px-4 py-3">
          {emptyLabel}
        </p>
      ) : (
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
              {items.map((item, i) => (
                <ItemRow key={`${title}-${i}-${item.name}`} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TierCard({ tier }: { tier: GuideTier }) {
  const build = tier.suggestedBuild;
  const weaponItems = build.weapon ? [build.weapon] : [];

  return (
    <section
      id={tier.id}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 scroll-mt-8"
    >
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-white">{tier.label}</h3>
        <p className="text-xs font-mono text-gray-500 mt-1">
          Unlock level: {formatUnlock(tier.unlockLevel)} · Vendor rank:{" "}
          {formatUnlock(tier.unlockRank)}
        </p>
      </div>

      <FictionSlot fiction={tier.fiction} placement="hook" />

      <p className="text-sm text-gray-400 mb-5">{tier.summary}</p>

      <div className="rounded-lg border border-amber-900/40 bg-amber-950/10 px-4 py-3 mb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-500/90 mb-1">
          Suggested build
        </p>
        <p className="text-sm text-gray-400">{build.notes}</p>
      </div>

      <BuildTable
        title="Weapon"
        items={weaponItems}
        emptyLabel="Weapon: TBD"
      />
      <BuildTable
        title="Attachments"
        items={build.attachments}
        emptyLabel="Attachments: TBD — placeholder slot"
      />

      <div className="mb-2">
        <AmmoBlock ammo={build.ammo} />
      </div>

      <FictionSlot fiction={tier.fiction} placement="vignette" />
    </section>
  );
}
