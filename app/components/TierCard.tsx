import type {
  ArmorLoadoutRec,
  GuideItem,
  GuideTier,
  SuggestedAmmo,
} from "@/lib/types/guides";
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

function formatUnlock(value: string | number | "TBD" | undefined): string {
  if (value === undefined || value === "TBD" || value === "") return "TBD";
  return String(value);
}

function StatusHintBadge({ hint }: { hint?: GuideItem["statusHint"] }) {
  if (hint === "confident") {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide bg-sky-950 text-sky-400 border border-sky-800/60">
        fairly confident
      </span>
    );
  }
  if (hint === "lastKnown04") {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide bg-gray-900 text-gray-500 border border-gray-700/80">
        last known (0.4)
      </span>
    );
  }
  if (hint === "pending05") {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide bg-amber-950/50 text-amber-600/80 border border-amber-900/40">
        pending 0.5
      </span>
    );
  }
  return null;
}

function ItemRow({ item }: { item: GuideItem }) {
  const isHint = item.statusHint === "lastKnown04" || item.statusHint === "pending05";
  const nameClass = isHint
    ? "font-medium text-gray-500"
    : "font-medium text-white";
  const rowClass = isHint
    ? "border-b border-gray-800/80 align-top opacity-70"
    : "border-b border-gray-800/80 align-top";

  return (
    <tr className={rowClass}>
      <td className="py-3 pr-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={nameClass}>{item.name}</span>
          <StatusHintBadge hint={item.statusHint} />
        </div>
        {item.notes ? (
          <p className={`text-xs mt-1 max-w-md ${isHint ? "text-gray-600" : "text-gray-500"}`}>
            {item.notes}
          </p>
        ) : null}
        {item.source ? (
          <p className="text-[10px] font-mono text-gray-600 mt-1">{item.source}</p>
        ) : null}
      </td>
      <td className="py-3 pr-3 text-gray-500">{item.role ?? "—"}</td>
      <td className="py-3 pr-3 font-mono text-gray-500">{formatCost(item.cost)}</td>
      <td className="py-3 pr-3 font-mono text-gray-500">
        {formatWeight(item.weight)}
      </td>
      <td className="py-3 pr-3">
        <VerifiedBadge verified={item.verified} />
      </td>
    </tr>
  );
}

function ItemTable({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: GuideItem[];
  emptyLabel: string;
}) {
  return (
    <div className="mb-4">
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

function AmmoBlock({ ammo }: { ammo: SuggestedAmmo | null | undefined }) {
  if (!ammo) {
    return <p className="text-sm text-gray-500 italic">Ammo: TBD</p>;
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

function GunBody({ tier }: { tier: GuideTier }) {
  const build = tier.suggestedBuild;
  if (!build) {
    return (
      <p className="text-sm text-gray-500 italic">Gun build slot missing.</p>
    );
  }
  const weaponItems = build.weapon ? [build.weapon] : [];
  return (
    <>
      <div className="rounded-lg border border-amber-900/40 bg-amber-950/10 px-4 py-3 mb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-500/90 mb-1">
          Suggested gun build
        </p>
        <p className="text-sm text-gray-400">{build.notes}</p>
      </div>
      <ItemTable title="Weapon" items={weaponItems} emptyLabel="Weapon: TBD" />
      <div className="mb-3 rounded-lg border border-dashed border-gray-700 bg-gray-950/30 px-3 py-2">
        <p className="text-[11px] font-mono text-gray-500">
          Attachments: Pending 0.5 verification (Oct 19). Greyed names are last known (0.4) hints
          only — availability may change.
        </p>
      </div>
      <ItemTable
        title="Attachments (last known 0.4)"
        items={build.attachments}
        emptyLabel="Attachments: Pending 0.5 verification (Oct 19)"
      />
      <div className="mb-2">
        <AmmoBlock ammo={build.ammo} />
      </div>
    </>
  );
}

function LoadoutCard({ loadout }: { loadout: ArmorLoadoutRec }) {
  const armorItems = loadout.armor ? [loadout.armor] : [];
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-amber-400">{loadout.label}</h4>
        <span className="text-[10px] font-mono uppercase text-gray-600">
          sub-recommendation
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-4">{loadout.notes}</p>
      <ItemTable
        title="Armor"
        items={armorItems}
        emptyLabel="Best armor: TBD — to be verified in 0.5"
      />
      <ItemTable
        title="Other kit"
        items={loadout.items}
        emptyLabel="Kit pieces: TBD — to be verified in 0.5"
      />
    </div>
  );
}

function ArmorBody({ tier }: { tier: GuideTier }) {
  const rec = tier.armorRecommendation;
  if (!rec) {
    return (
      <p className="text-sm text-gray-500 italic">Armor recommendation missing.</p>
    );
  }
  return (
    <>
      <div className="rounded-lg border border-amber-900/40 bg-amber-950/10 px-4 py-3 mb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-500/90 mb-1">
          Why Tasking vs Looting
        </p>
        <p className="text-sm text-gray-400">{rec.whyTheyDiffer}</p>
        <p className="text-xs text-gray-600 mt-2">{rec.notes}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {rec.loadouts.map((lo) => (
          <LoadoutCard key={lo.id} loadout={lo} />
        ))}
      </div>
    </>
  );
}

function MedicalBody({ tier }: { tier: GuideTier }) {
  const rec = tier.medicalRecommendation;
  if (!rec) {
    return (
      <p className="text-sm text-gray-500 italic">Medical recommendation missing.</p>
    );
  }
  return (
    <>
      <div className="rounded-lg border border-amber-900/40 bg-amber-950/10 px-4 py-3 mb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-500/90 mb-1">
          Suggested med kit
        </p>
        <p className="text-sm text-gray-400">{rec.notes}</p>
      </div>
      <ItemTable
        title="Pouch(es) at this level"
        items={rec.pouches}
        emptyLabel="Pouches: TBD — to be verified in 0.5"
      />
      <ItemTable
        title="Recommended meds to fill"
        items={rec.recommendedMeds}
        emptyLabel="Meds: TBD — to be verified in 0.5"
      />
    </>
  );
}

const kindLabel: Record<string, string> = {
  gun: "Gun",
  armor: "Armor / kit",
  medical: "Medical",
};

export default function TierCard({ tier }: { tier: GuideTier }) {
  const dataLabel = tier.dataLabel ?? "Data: v0.4, unverified for 0.5";

  return (
    <section
      id={tier.id}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 scroll-mt-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-white">{tier.label}</h3>
            <span className="text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
              {kindLabel[tier.kind] ?? tier.kind}
            </span>
          </div>
          <p className="text-xs font-mono text-gray-500 mt-1">
            Unlock level: {formatUnlock(tier.unlockLevel)} · Vendor rank:{" "}
            {formatUnlock(tier.unlockRank)}
            {tier.unlockRep !== undefined ? (
              <> · Rep: {formatUnlock(tier.unlockRep)}</>
            ) : null}
          </p>
          {tier.unlockRepSource ? (
            <p className="text-[10px] font-mono text-gray-600 mt-1 max-w-xl">
              Rep source: {tier.unlockRepSource}
            </p>
          ) : null}
        </div>
        <span className="inline-flex items-center rounded px-2 py-1 text-[10px] font-mono uppercase tracking-wide bg-amber-950/60 text-amber-400 border border-amber-800/50">
          {dataLabel}
        </span>
      </div>

      <FictionSlot fiction={tier.fiction} placement="hook" />

      <p className="text-sm text-gray-400 mb-5">{tier.summary}</p>

      {tier.kind === "gun" ? <GunBody tier={tier} /> : null}
      {tier.kind === "armor" ? <ArmorBody tier={tier} /> : null}
      {tier.kind === "medical" ? <MedicalBody tier={tier} /> : null}

      <FictionSlot fiction={tier.fiction} placement="vignette" />
    </section>
  );
}
