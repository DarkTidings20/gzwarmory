/** Content model for vendor-organized kit guides (pre-0.5 skeleton). */

export type VerificationStatus = "verified" | "unverified" | "placeholder";

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

export interface FictionSlot {
  /** Optional one-line hook shown above the kit */
  hook: string | null;
  /** ~200-word vignette below the kit; placeholder until Echo fills */
  vignette: {
    status: "placeholder" | "draft" | "final";
    author: "Echo" | string;
    /** Body text; placeholders clearly labeled for Echo */
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
  summary: string;
  items: GuideItem[];
  fiction: FictionSlot;
  /** Deep-link into the existing weapon builder */
  builderDeepLink: string | null;
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
