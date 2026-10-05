/** Content model for vendor-organized suggested builds (pre-0.5 skeleton). */

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
}

export interface SuggestedAmmo {
  /** Specific load name, or TBD */
  name: string;
  notes?: string;
  verified: boolean;
  source?: string;
}

/** Suggested gun build for a vendor unlock tier. */
export interface SuggestedBuild {
  weapon: GuideItem | null;
  attachments: GuideItem[];
  ammo: SuggestedAmmo | null;
  notes: string;
}

export interface FictionSlot {
  /** Optional one-line hook shown above the kit */
  hook: string | null;
  /** ~200-word vignette below the kit; placeholder until fiction is written */
  vignette: {
    status: "placeholder" | "draft" | "final";
    author: string;
    /** Body text; use neutral placeholders when empty */
    text: string;
  };
}

export interface GuideTier {
  id: string;
  label: string;
  /** Unlock level if known; "TBD" when unknown — never invent */
  unlockLevel: string | number | "TBD";
  /** Vendor rank if known; "TBD" when unknown */
  unlockRank: string | number | "TBD";
  /** Cumulative rep if sourced; "TBD" when unknown — never invent */
  unlockRep?: number | "TBD";
  unlockRepSource?: string;
  /** e.g. Data: v0.4, unverified for 0.5 */
  dataLabel?: string;
  summary: string;
  suggestedBuild: SuggestedBuild;
  fiction: FictionSlot;
}

export interface KitGuide {
  id: string;
  slug: string;
  vendorId: string;
  title: string;
  subtitle?: string;
  weaponId?: string;
  /** Visible pre-0.5 notice flag */
  pre05: boolean;
  patchVersion: string;
  /** e.g. Data: v0.4, unverified for 0.5 */
  dataLabel?: string;
  tiers: GuideTier[];
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  description: string;
  /** Guide ids under data/guides/ */
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
  /** Path or note — long chapters live outside tier vignette slots */
  locationNote: string;
  linkedFromTiers?: string[];
}

export interface DispatchesFile {
  intro: string;
  dispatches: DispatchStub[];
}
