export interface BangleSizeDetail {
  size: string;
  name: string;
  diameterMm: number;
  diameterInches: string;
  circumferenceCm: number;
  circumferenceInches: string;
  fitProfile: string;
  popularity: string;
  description: string;
}

export const BANGLE_SIZES: BangleSizeDetail[] = [
  {
    size: "2.2",
    name: "2-2 (Extra Small / Petite)",
    diameterMm: 54.0,
    diameterInches: "2 2/16\" (2.125\")",
    circumferenceCm: 16.96,
    circumferenceInches: "6.68\"",
    fitProfile: "Petite wrists or teenagers",
    popularity: "5% of buyers",
    description: "Designed for very slender wrists and petite hands with small knuckle spans.",
  },
  {
    size: "2.4",
    name: "2-4 (Small)",
    diameterMm: 57.2,
    diameterInches: "2 4/16\" (2.25\")",
    circumferenceCm: 17.96,
    circumferenceInches: "7.07\"",
    fitProfile: "Slender wrists",
    popularity: "25% of buyers",
    description: "A very popular size for women with delicate wrists and medium-to-slim hands.",
  },
  {
    size: "2.6",
    name: "2-6 (Medium / Universal Standard)",
    diameterMm: 60.3,
    diameterInches: "2 6/16\" (2.375\")",
    circumferenceCm: 18.95,
    circumferenceInches: "7.46\"",
    fitProfile: "Standard Indian wrist fit",
    popularity: "55% of buyers (Most Popular)",
    description: "The universal benchmark across Indian jewelry stores. Perfect choice when gifting!",
  },
  {
    size: "2.8",
    name: "2-8 (Large)",
    diameterMm: 63.5,
    diameterInches: "2 8/16\" (2.50\")",
    circumferenceCm: 19.95,
    circumferenceInches: "7.85\"",
    fitProfile: "Broader wrists or loose-drape wearers",
    popularity: "12% of buyers",
    description: "Ideal for broader wrists or women who love loose, cascading bangle stacks.",
  },
  {
    size: "2.10",
    name: "2-10 (Extra Large)",
    diameterMm: 66.7,
    diameterInches: "2 10/16\" (2.625\")",
    circumferenceCm: 20.95,
    circumferenceInches: "8.25\"",
    fitProfile: "Broad hands or statement kadas",
    popularity: "3% of buyers",
    description: "Generous fit for broader hand bones or statement heavy royal kadas.",
  },
];

export function calculateSizeFromCircumference(cm: number, fit: "snug" | "loose" = "snug"): string {
  const adjustedCm = fit === "loose" ? cm - 0.4 : cm;

  if (adjustedCm <= 17.4) return "2.2";
  if (adjustedCm <= 18.4) return "2.4";
  if (adjustedCm <= 19.4) return "2.6";
  if (adjustedCm <= 20.4) return "2.8";
  return "2.10";
}

export function calculateSizeFromDiameter(mm: number): string {
  if (mm <= 55.5) return "2.2";
  if (mm <= 58.7) return "2.4";
  if (mm <= 61.9) return "2.6";
  if (mm <= 65.1) return "2.8";
  return "2.10";
}
