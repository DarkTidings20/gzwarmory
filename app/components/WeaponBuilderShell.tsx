"use client";

import { useState } from "react";
import WeaponBuilder from "./WeaponBuilder";

interface Weapon {
  id: string;
  name: string;
  type: string;
  caliber: string;
  manufacturer?: string;
  vendor: string;
  vendorRank: number;
  baseStats: Record<string, number>;
  slots: Record<string, { label: string; required: boolean; compatible: string[] }>;
}

interface Attachment {
  id: string;
  name: string;
  category: string;
  statModifiers: Record<string, number>;
  weight: number;
  capacity?: number;
  vendor: string;
  vendorRank: number;
}

export default function WeaponBuilderShell({
  weapons,
  allAttachments,
}: {
  weapons: Weapon[];
  allAttachments: Record<string, Attachment>;
}) {
  const [selectedId, setSelectedId] = useState(weapons[0]?.id ?? "");
  const weapon = weapons.find((w) => w.id === selectedId) ?? weapons[0];

  return (
    <div>
      {/* Weapon selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{weapon?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {weapon?.type} · {weapon?.caliber}
            {weapon?.manufacturer && ` · ${weapon.manufacturer}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-gray-400 text-sm">Weapon:</label>
          <select
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {weapon && <WeaponBuilder weapon={weapon} allAttachments={allAttachments} />}
    </div>
  );
}
