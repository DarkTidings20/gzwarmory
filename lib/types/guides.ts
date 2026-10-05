/** Content model for vendor-organized suggested kits (pre-0.5 skeleton). */

export type TierKind = "gun" | "armor" | "medical";

export interface GuideItem {
  /** Display name. Prefer names from existing /data; otherwise TBD. */
  name: string;
  role?: string;
  /** USD cost if known from repo data; otherwise null → render as TBD */
  cost: number | null;
  /** kg if known; otherwise null → TBD */
  weight: number | null;
  notes?: string;
  /** Whether stats/availability are verified against in-game sources */
  verified: boolean;
  /** Human-readable source note, e.g. data/weapons/M4A1.json */
  source?: string;
  /** Optional attachment/weapon id from existing data */
  itemId?: string;
  /**
   * Display confidence for skeleton UI:
   * - confident: weapon/platform choice is fairly confident
   * - lastKnown04: greyed 0.4 hint — Pending 0.5 verification (Oct 19)
   * - pending05: empty/unspecified pending 0.5
   */
  statusHint?: "confident" | "lastKnown04" | "pending05";
}

export interface SuggestedAmmo {
  name: string;
  notes?: string;
  verified: boolean;
  source?: string;
}

/** Gun vendor suggested build (Gunny, etc.). */
export interface SuggestedBuild {
  weapon: GuideItem | null;
  attachments: GuideItem[];
  ammo: SuggestedAmmo | null;
  notes: string;
}

export type GunTrackId = "vendor-preset" | "min-max" | "drip";

/** Endgame (L4) empty track — filled after 0.5 with per-model builds, not a parts builder. */
export interface GunBuildTrack {
  id: GunTrackId;
  label: string;
  /** One-line: when this track is worth picking */
  whenWorthIt: string;
  status: "placeholder" | "draft" | "ready";
  /** e.g. to be built after 0.5 (Oct 19) */
  placeholderNote: string;
  /** Extra context (e.g. unmodded L403A1 as off-the-shelf option) */
  notes?: string;
  weapon?: GuideItem | null;
  attachments?: GuideItem[];
  ammo?: SuggestedAmmo | null;
}

export type ArmorLoadoutId = "tasking" | "looting";

/** One Handshake-style armor/kit recommendation (Tasking or Looting). */
export interface ArmorLoadoutRec {
  id: ArmorLoadoutId;
  label: "Tasking" | "Looting";
  /** Best armor piece(s) for this loadout at this level — TBD until verified */
  armor: GuideItem | null;
  /** Other kit pieces (rig, backpack, etc.) — placeholders only for now */
  items: GuideItem[];
  notes: string;
}

/** Armor / kit vendor recommendation (Handshake). */
export interface ArmorRecommendation {
  /** Why Tasking vs Looting differ at this level */
  whyTheyDiffer: string;
  loadouts: ArmorLoadoutRec[];
  notes: string;
}

/** Medical vendor recommendation (Lab Rat). */
export interface MedicalRecommendation {
  /** Pouch(es) available at this vendor level */
  pouches: GuideItem[];
  /** Recommended meds to fill those pouches */
  recommendedMeds: GuideItem[];
  notes: string;
}

export interface FictionSlot {
  hook: string | null;
  vignette: {
    status: "placeholder" | "draft" | "final";
    author: string;
    text: string;
  };
}

export interface GuideTier {
  id: string;
  label: string;
  kind: TierKind;
  unlockLevel: string | number | "TBD";
  unlockRank: string | number | "TBD";
  unlockRep?: number | "TBD";
  unlockRepSource?: string;
  dataLabel?: string;
  summary: string;
  /** Present when kind === "gun" (single suggested build, typically L1–L3) */
  suggestedBuild?: SuggestedBuild;
  /** Present when kind === "gun" and the tier uses multiple endgame tracks (typically L4) */
  tracks?: GunBuildTrack[];
  /** Present when kind === "armor" */
  armorRecommendation?: ArmorRecommendation;
  /** Present when kind === "medical" */
  medicalRecommendation?: MedicalRecommendation;
  fiction: FictionSlot;
}

export interface KitGuide {
  id: string;
  slug: string;
  vendorId: string;
  title: string;
  subtitle?: string;
  weaponId?: string;
  /** Default kind for this guide's tiers */
  kind: TierKind;
  pre05: boolean;
  patchVersion: string;
  dataLabel?: string;
  tiers: GuideTier[];
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  description: string;
  guideIds: string[];
  status: "skeleton" | "partial" | "ready";
}

export interface VendorsFile {
  patchNote: string;
  vendors: Vendor[];
}

export interface DispatchStub {
  id: string;
  slug: string;
  title: string;
  status: "placeholder" | "draft" | "published";
  author: string;
  wordCount: number | null;
  summary: string;
  locationNote: string;
  linkedFromTiers?: string[];
}

export interface DispatchesFile {
  intro: string;
  dispatches: DispatchStub[];
}
