import { promises as fs } from "fs";
import path from "path";
import type {
  DispatchesFile,
  GuideTier,
  KitGuide,
  Vendor,
  VendorsFile,
} from "./types/guides";

const dataDir = path.join(process.cwd(), "data");

const PLACEHOLDER_VIGNETTE =
  "[Vignette placeholder — fiction coming soon. ~200 words. Kit sits above this.]";

/** Default Level 1 / Mid / Endgame slots when a vendor has no guide JSON yet. */
export function placeholderTiers(vendorName: string): GuideTier[] {
  const mk = (id: string, label: string): GuideTier => ({
    id,
    label,
    unlockLevel: "TBD",
    unlockRank: "TBD",
    unlockRep: "TBD",
    dataLabel: "Data: v0.4, unverified for 0.5",
    summary: `Suggested build slot for ${vendorName} at this unlock tier. Content TBD pending 0.5 research — do not invent stats or unlocks.`,
    suggestedBuild: {
      weapon: {
        name: "TBD",
        role: "Primary",
        cost: null,
        weight: null,
        notes: "Suggested weapon TBD.",
        verified: false,
        source: "placeholder",
      },
      attachments: [],
      ammo: {
        name: "TBD",
        notes: "Suggested ammo TBD.",
        verified: false,
        source: "placeholder",
      },
      notes: "Placeholder suggested build — awaiting verified data.",
    },
    fiction: {
      hook: null,
      vignette: {
        status: "placeholder",
        author: "Pending",
        text: PLACEHOLDER_VIGNETTE,
      },
    },
  });

  return [
    mk("level-1", "Level 1 / Day 1"),
    mk("mid", "Mid"),
    mk("endgame", "Endgame"),
  ];
}

export async function getVendorsFile(): Promise<VendorsFile> {
  const raw = await fs.readFile(path.join(dataDir, "vendors.json"), "utf-8");
  return JSON.parse(raw) as VendorsFile;
}

export async function getVendors(): Promise<Vendor[]> {
  const file = await getVendorsFile();
  return file.vendors;
}

export async function getVendorBySlug(slug: string): Promise<Vendor | undefined> {
  const vendors = await getVendors();
  return vendors.find((v) => v.slug === slug);
}

export async function getGuideById(id: string): Promise<KitGuide | null> {
  const filePath = path.join(dataDir, "guides", `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as KitGuide;
  } catch {
    return null;
  }
}

export async function getGuidesForVendor(vendorId: string): Promise<KitGuide[]> {
  const vendor = (await getVendors()).find((v) => v.id === vendorId);
  if (!vendor) return [];
  const guides = await Promise.all(vendor.guideIds.map((id) => getGuideById(id)));
  return guides.filter((g): g is KitGuide => g !== null);
}

export async function getGuideByVendorAndSlug(
  vendorSlug: string,
  guideSlug: string,
): Promise<{ vendor: Vendor; guide: KitGuide } | null> {
  const vendor = await getVendorBySlug(vendorSlug);
  if (!vendor) return null;
  for (const id of vendor.guideIds) {
    const guide = await getGuideById(id);
    if (guide && guide.slug === guideSlug) {
      return { vendor, guide };
    }
  }
  return null;
}

export async function getAllGuideParams(): Promise<
  { vendor: string; guide: string }[]
> {
  const vendors = await getVendors();
  const params: { vendor: string; guide: string }[] = [];
  for (const vendor of vendors) {
    for (const id of vendor.guideIds) {
      const guide = await getGuideById(id);
      if (guide) {
        params.push({ vendor: vendor.slug, guide: guide.slug });
      }
    }
  }
  return params;
}

export async function getDispatches(): Promise<DispatchesFile> {
  const raw = await fs.readFile(path.join(dataDir, "dispatches.json"), "utf-8");
  return JSON.parse(raw) as DispatchesFile;
}
