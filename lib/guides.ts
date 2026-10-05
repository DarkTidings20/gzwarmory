import { promises as fs } from "fs";
import path from "path";
import type {
  DispatchesFile,
  KitGuide,
  Vendor,
  VendorsFile,
} from "./types/guides";

const dataDir = path.join(process.cwd(), "data");

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
