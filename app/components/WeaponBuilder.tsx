"use client";

import { useState, useEffect } from "react";

interface StatModifiers {
  accuracy?: number;
  recoilControl?: number;
  ergonomics?: number;
  weaponHandling?: number;
  reloadSpeed?: number;
  muzzleVelocity?: number;
  loudnessReduction?: number;
  muzzleDeviceEfficiency?: number;
}

interface Attachment {
  id: string;
  name: string;
  category: string;
  statModifiers: StatModifiers;
  weight: number;
  capacity?: number;
  vendor: string;
  vendorRank: number;
}

interface SlotDef {
  label: string;
  required: boolean;
  compatible: string[];
}

interface Weapon {
  id: string;
  name: string;
  type: string;
  caliber: string;
  vendor: string;
  vendorRank: number;
  baseStats: {
    accuracy: number;
    recoilControl: number;
    ergonomics: number;
    weaponHandling: number;
    reloadSpeed: number;
    muzzleVelocity: number;
    loudnessReduction: number;
    muzzleDeviceEfficiency: number;
    weight: number;
    rateOfFire: number;
  };
  slots: Record<string, SlotDef>;
}

const STAT_LABELS: Record<string, string> = {
  accuracy: "Accuracy (MOA)",
  recoilControl: "Recoil Control",
  ergonomics: "Ergonomics",
  weaponHandling: "Weapon Handling",
  reloadSpeed: "Reload Speed",
  muzzleVelocity: "Muzzle Velocity",
  loudnessReduction: "Loudness Reduction",
  muzzleDeviceEfficiency: "Muzzle Device Efficiency",
};

function StatBar({ label, base, delta, isAccuracy = false }: {
  label: string;
  base: number;
  delta: number;
  isAccuracy?: boolean;
}) {
  // For accuracy, lower is better — invert the delta display
  const effectiveDelta = isAccuracy ? -delta : delta;
  const isPositive = effectiveDelta > 0;
  const isNegative = effectiveDelta < 0;

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
      <span className="text-gray-400 text-sm w-44">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-gray-300 text-sm font-mono w-12 text-right">{base.toFixed(1)}</span>
        {delta !== 0 && (
          <span className={`text-sm font-mono font-semibold w-14 text-right ${isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-gray-500"}`}>
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}
          </span>
        )}
        {delta === 0 && <span className="w-14" />}
        <span className="text-white text-sm font-mono font-bold w-12 text-right">
          {(base + delta).toFixed(1)}
        </span>
      </div>
    </div>
  );
}

function SlotSelector({
  slotKey,
  slot,
  allAttachments,
  selected,
  onSelect,
}: {
  slotKey: string;
  slot: SlotDef;
  allAttachments: Record<string, Attachment>;
  selected: string | null;
  onSelect: (slotKey: string, attachmentId: string | null) => void;
}) {
  const compatible = slot.compatible
    .map((id) => allAttachments[id])
    .filter(Boolean);

  const selectedAttachment = selected ? allAttachments[selected] : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          {slot.label}
          {slot.required && <span className="text-amber-500 ml-1">*</span>}
        </span>
        {selectedAttachment && (
          <button
            onClick={() => onSelect(slotKey, null)}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            ✕ clear
          </button>
        )}
      </div>

      {compatible.length === 0 ? (
        <div className="text-gray-600 text-xs italic">No data yet — help us fill this in!</div>
      ) : (
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          value={selected ?? ""}
          onChange={(e) => onSelect(slotKey, e.target.value || null)}
        >
          <option value="">— {slot.required ? "Select required" : "None"} —</option>
          {compatible.map((att) => (
            <option key={att.id} value={att.id}>
              {att.name} {att.capacity ? `(${att.capacity}rd)` : ""} · {att.vendor} R{att.vendorRank}
            </option>
          ))}
        </select>
      )}

      {selectedAttachment && Object.keys(selectedAttachment.statModifiers).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.entries(selectedAttachment.statModifiers).map(([stat, val]) => {
            if (val === 0) return null;
            const isAccStat = stat === "accuracy";
            const isGood = isAccStat ? (val ?? 0) < 0 : (val ?? 0) > 0;
            return (
              <span
                key={stat}
                className={`text-xs px-1.5 py-0.5 rounded font-mono ${isGood ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
              >
                {STAT_LABELS[stat] ?? stat}: {(val ?? 0) > 0 ? "+" : ""}{val}
              </span>
            );
          })}
          <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-gray-800 text-gray-400">
            +{selectedAttachment.weight.toFixed(3)}kg
          </span>
        </div>
      )}
    </div>
  );
}

export default function WeaponBuilder({
  weapon,
  allAttachments,
}: {
  weapon: Weapon;
  allAttachments: Record<string, Attachment>;
}) {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string | null>>({});

  const handleSelect = (slotKey: string, id: string | null) => {
    setSelectedSlots((prev) => ({ ...prev, [slotKey]: id }));
  };

  // Calculate stat deltas
  const statDeltas: StatModifiers & { weight: number } = {
    accuracy: 0, recoilControl: 0, ergonomics: 0, weaponHandling: 0,
    reloadSpeed: 0, muzzleVelocity: 0, loudnessReduction: 0, muzzleDeviceEfficiency: 0,
    weight: 0,
  };

  Object.values(selectedSlots).forEach((id) => {
    if (!id) return;
    const att = allAttachments[id];
    if (!att) return;
    statDeltas.weight += att.weight;
    Object.entries(att.statModifiers).forEach(([stat, val]) => {
      if (stat in statDeltas) {
        (statDeltas as Record<string, number>)[stat] += val ?? 0;
      }
    });
  });

  const totalWeight = weapon.baseStats.weight + statDeltas.weight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Slots */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Attachments</h2>
        <div className="space-y-3">
          {Object.entries(weapon.slots).map(([key, slot]) => (
            <SlotSelector
              key={key}
              slotKey={key}
              slot={slot}
              allAttachments={allAttachments}
              selected={selectedSlots[key] ?? null}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Right: Stats */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2 pb-1 border-b border-gray-800">
            <span>Stat</span>
            <div className="flex gap-3">
              <span className="w-12 text-right">Base</span>
              <span className="w-14 text-right">Mod</span>
              <span className="w-12 text-right font-bold text-gray-400">Total</span>
            </div>
          </div>
          <StatBar label="Accuracy (MOA ↓)" base={weapon.baseStats.accuracy} delta={statDeltas.accuracy ?? 0} isAccuracy />
          <StatBar label="Recoil Control" base={weapon.baseStats.recoilControl} delta={statDeltas.recoilControl ?? 0} />
          <StatBar label="Ergonomics" base={weapon.baseStats.ergonomics} delta={statDeltas.ergonomics ?? 0} />
          <StatBar label="Weapon Handling" base={weapon.baseStats.weaponHandling} delta={statDeltas.weaponHandling ?? 0} />
          <StatBar label="Reload Speed" base={weapon.baseStats.reloadSpeed} delta={statDeltas.reloadSpeed ?? 0} />
          <StatBar label="Muzzle Velocity" base={weapon.baseStats.muzzleVelocity} delta={statDeltas.muzzleVelocity ?? 0} />
          <StatBar label="Loudness Reduction" base={weapon.baseStats.loudnessReduction} delta={statDeltas.loudnessReduction ?? 0} />
          <StatBar label="Muzzle Device Eff." base={weapon.baseStats.muzzleDeviceEfficiency} delta={statDeltas.muzzleDeviceEfficiency ?? 0} />
        </div>

        {/* Weight */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Weapon Weight</span>
            <span className="text-white font-bold font-mono">{totalWeight.toFixed(3)} kg</span>
          </div>
          <div className="text-xs text-gray-600">
            Base {weapon.baseStats.weight.toFixed(3)} kg
            {statDeltas.weight > 0 && <span className="text-gray-500"> + {statDeltas.weight.toFixed(3)} kg attachments</span>}
          </div>
        </div>

        {/* Weapon info */}
        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm">
          <div className="grid grid-cols-2 gap-2 text-gray-400">
            <span>Type</span><span className="text-gray-200">{weapon.type}</span>
            <span>Caliber</span><span className="text-gray-200">{weapon.caliber}</span>
            <span>ROF</span><span className="text-gray-200">{weapon.baseStats.rateOfFire} RPM</span>
            <span>Vendor</span><span className="text-gray-200">{weapon.vendor} R{weapon.vendorRank}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
