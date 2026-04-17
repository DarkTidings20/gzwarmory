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

const VENDORS = ["Gunny", "Handshake", "Lab Rat", "Artisan", "Turncoat", "Banshee", "Vulture"] as const;
const MAX_RANK = 4;

export default function WeaponBuilderShell({
  weapons,
  allAttachments,
}: {
  weapons: Weapon[];
  allAttachments: Record<string, Attachment>;
}) {
  const defaultId = weapons.find((w) => w.id === "m4a1")?.id ?? weapons[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);
  const [vendorRanks, setVendorRanks] = useState<Record<string, number>>({
    Gunny: 1,
    Handshake: 1,
    "Lab Rat": 1,
    Artisan: 1,
    Turncoat: 1,
    Banshee: 1,
    Vulture: 1,
  });

  const weapon = weapons.find((w) => w.id === selectedId) ?? weapons[0];

  const setRank = (vendor: string, rank: number) => {
    setVendorRanks((prev) => ({ ...prev, [vendor]: rank }));
  };

  return (
    <div>
      {/* Top bar: weapon selector + vendor rank controls */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Weapon selector row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{weapon?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {weapon?.type} · {weapon?.caliber}
              {weapon?.manufacturer && ` · ${weapon.manufacturer}`}
              {weapon && (
                <span className="ml-2 text-amber-500/70">
                  · {weapon.vendor} R{weapon.vendorRank}
                </span>
              )}
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
                  {w.name} · {w.vendor} R{w.vendorRank}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vendor rank filter row */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-gray-400 text-sm font-medium shrink-0">
              My Vendor Ranks:
            </span>
            <div className="flex flex-wrap gap-4">
              {VENDORS.map((vendor) => (
                <div key={vendor} className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm w-20">{vendor}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: MAX_RANK }, (_, i) => i + 1).map((rank) => (
                      <button
                        key={rank}
                        onClick={() => setRank(vendor, rank)}
                        className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                          vendorRanks[vendor] >= rank
                            ? "bg-amber-500 text-black"
                            : "bg-gray-800 text-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {rank}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Only attachments available at or below your vendor rank will appear in the dropdowns.
          </p>
        </div>
      </div>

      {weapon && (
        <WeaponBuilder
          weapon={weapon}
          allAttachments={allAttachments}
          vendorRanks={vendorRanks}
        />
      )}
    </div>
  );
}
