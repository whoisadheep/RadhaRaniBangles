"use client";

import { useState } from "react";
import {
  BANGLE_SIZES,
  calculateSizeFromCircumference,
  calculateSizeFromDiameter,
  BangleSizeDetail,
} from "@/lib/size-guide-data";
import { cn } from "@/lib/utils";

interface BangleSizeCalculatorProps {
  onSelectSize?: (size: string) => void;
  selectedSize?: string;
}

export function BangleSizeCalculator({ onSelectSize, selectedSize }: BangleSizeCalculatorProps) {
  const [method, setMethod] = useState<"hand" | "bangle">("hand");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [circumferenceCm, setCircumferenceCm] = useState<number>(18.5);
  const [diameterMm, setDiameterMm] = useState<number>(60);
  const [fitPreference, setFitPreference] = useState<"snug" | "loose">("snug");

  // Determine computed size based on active method
  const computedSizeKey =
    method === "hand"
      ? calculateSizeFromCircumference(circumferenceCm, fitPreference)
      : calculateSizeFromDiameter(diameterMm);

  const matchedSizeDetail: BangleSizeDetail =
    BANGLE_SIZES.find((s) => s.size === computedSizeKey) || BANGLE_SIZES[2];

  // Helper conversions
  const displayedCircumference =
    unit === "cm" ? circumferenceCm.toFixed(1) : (circumferenceCm / 2.54).toFixed(2);

  const handleCircumferenceChange = (val: number) => {
    setCircumferenceCm(val);
  };

  return (
    <div className="space-y-6">
      {/* ── Method Tabs ── */}
      <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => setMethod("hand")}
          className={cn(
            "flex-1 py-2.5 px-3 rounded-lg font-body text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
            method === "hand"
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <path d="M4 11h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
          </svg>
          Measure Hand (Tape/String)
        </button>

        <button
          type="button"
          onClick={() => setMethod("bangle")}
          className={cn(
            "flex-1 py-2.5 px-3 rounded-lg font-body text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
            method === "bangle"
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
          Measure Existing Bangle
        </button>
      </div>

      {/* ── Method 1: Hand Knuckle Circumference ── */}
      {method === "hand" && (
        <div className="p-5 rounded-2xl bg-white border border-border/70 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-body text-xs uppercase tracking-wider font-semibold text-primary">
                Hand Knuckle Circumference
              </p>
              <p className="font-body text-[11px] text-muted-foreground">
                Tuck thumb under fingers and measure across the widest knuckle point
              </p>
            </div>

            {/* Unit Toggle */}
            <div className="inline-flex items-center self-start sm:self-auto bg-muted/70 p-0.5 rounded-lg text-[11px] font-body">
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors cursor-pointer",
                  unit === "cm" ? "bg-white font-semibold text-primary shadow-xs" : "text-muted-foreground"
                )}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors cursor-pointer",
                  unit === "in" ? "bg-white font-semibold text-primary shadow-xs" : "text-muted-foreground"
                )}
              >
                inches
              </button>
            </div>
          </div>

          {/* Slider & Value Display */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-body text-xs text-muted-foreground">Slide to your hand size:</span>
              <span className="font-heading text-xl font-bold text-accent">
                {displayedCircumference} {unit}
              </span>
            </div>
            <input
              type="range"
              min={15.5}
              max={22.0}
              step={0.1}
              value={circumferenceCm}
              onChange={(e) => handleCircumferenceChange(parseFloat(e.target.value))}
              className="w-full accent-[#A16207] cursor-pointer"
            />
            <div className="flex justify-between font-body text-[10px] text-muted-foreground">
              <span>15.5 cm (Petite)</span>
              <span>18.5 cm (Standard)</span>
              <span>22.0 cm (Broad)</span>
            </div>
          </div>

          {/* Fit Preference Buttons */}
          <div className="pt-2 border-t border-border/40">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Drape & Fit Style:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFitPreference("snug")}
                className={cn(
                  "py-2 px-3 rounded-xl border text-left transition-all cursor-pointer",
                  fitPreference === "snug"
                    ? "border-accent bg-accent/10 ring-1 ring-accent/30"
                    : "border-border/80 hover:border-accent/40 bg-cream/30"
                )}
              >
                <div className="flex items-center gap-1.5 font-body text-xs font-semibold text-primary">
                  <span>✦</span> Snug Fit
                </div>
                <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                  Won&apos;t slip over the wrist easily
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFitPreference("loose")}
                className={cn(
                  "py-2 px-3 rounded-xl border text-left transition-all cursor-pointer",
                  fitPreference === "loose"
                    ? "border-accent bg-accent/10 ring-1 ring-accent/30"
                    : "border-border/80 hover:border-accent/40 bg-cream/30"
                )}
              >
                <div className="flex items-center gap-1.5 font-body text-xs font-semibold text-primary">
                  <span>✦</span> Comfort / Traditional
                </div>
                <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                  Graceful slide & traditional jingle
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Method 2: Measure Existing Bangle ── */}
      {method === "bangle" && (
        <div className="p-5 rounded-2xl bg-white border border-border/70 space-y-5 shadow-xs">
          <div>
            <p className="font-body text-xs uppercase tracking-wider font-semibold text-primary">
              Inner Diameter of Existing Bangle
            </p>
            <p className="font-body text-[11px] text-muted-foreground">
              Place a ruler across the inside of your best-fitting bangle from edge to edge
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-body text-xs text-muted-foreground">Inside Diameter:</span>
              <span className="font-heading text-xl font-bold text-accent">
                {diameterMm} mm ({(diameterMm / 25.4).toFixed(2)}&quot;)
              </span>
            </div>
            <input
              type="range"
              min={52}
              max={68}
              step={0.5}
              value={diameterMm}
              onChange={(e) => setDiameterMm(parseFloat(e.target.value))}
              className="w-full accent-[#A16207] cursor-pointer"
            />
            <div className="flex justify-between font-body text-[10px] text-muted-foreground">
              <span>52 mm (2.2)</span>
              <span>60 mm (2.6 Standard)</span>
              <span>68 mm (2.10)</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Result Recommendation Card ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF8F5] via-white to-champagne/40 border-2 border-accent/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-body text-[10px] font-semibold uppercase tracking-wider mb-2">
              <span>✓ Recommended Match</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="font-heading text-3xl font-bold text-primary">
                Size {matchedSizeDetail.size}&quot;
              </h3>
              <span className="font-body text-xs text-muted-foreground">
                ({matchedSizeDetail.diameterMm} mm inner diameter)
              </span>
            </div>

            <p className="font-body text-xs text-secondary mt-1 max-w-md">
              {matchedSizeDetail.fitProfile} •{" "}
              <strong className="text-accent font-medium">{matchedSizeDetail.popularity}</strong>
            </p>
          </div>

          {/* Action button if onSelectSize is present */}
          {onSelectSize && (
            <button
              type="button"
              onClick={() => onSelectSize(matchedSizeDetail.size)}
              className="px-6 py-3 rounded-full bg-accent hover:bg-accent-dark text-on-accent font-body text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
            >
              Select Size {matchedSizeDetail.size}&quot;
            </button>
          )}
        </div>

        {/* Popularity & details note */}
        <div className="mt-4 pt-3 border-t border-accent/20 flex flex-wrap items-center justify-between gap-2 font-body text-[11px] text-muted-foreground">
          <span>
            Circumference: ~<strong>{matchedSizeDetail.circumferenceCm} cm</strong> ({matchedSizeDetail.circumferenceInches})
          </span>
          <span className="text-accent">Indian Standard: {matchedSizeDetail.diameterInches}</span>
        </div>
      </div>

      {/* ── Complete Sizing Reference Matrix ── */}
      <div className="rounded-2xl border border-border/70 overflow-hidden bg-white shadow-xs">
        <div className="bg-muted/40 px-4 py-3 border-b border-border/70">
          <p className="font-body text-xs uppercase tracking-wider font-semibold text-primary">
            Standard Indian Bangle Sizing Matrix
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-cream/30 text-muted-foreground text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-4">Size</th>
                <th className="py-2.5 px-4">Inner Diameter</th>
                <th className="py-2.5 px-4">Hand Circumference</th>
                <th className="py-2.5 px-4">Best For</th>
                {onSelectSize && <th className="py-2.5 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {BANGLE_SIZES.map((row) => {
                const isCurrentComputed = row.size === matchedSizeDetail.size;
                const isPropSelected = row.size === selectedSize;

                return (
                  <tr
                    key={row.size}
                    className={cn(
                      "transition-colors",
                      isCurrentComputed
                        ? "bg-accent/10 font-medium"
                        : "hover:bg-muted/30 text-secondary"
                    )}
                  >
                    <td className="py-3 px-4">
                      <span className="font-semibold text-primary text-sm">{row.size}&quot;</span>
                      {isCurrentComputed && (
                        <span className="ml-2 inline-block text-[9px] uppercase px-1.5 py-0.2 rounded bg-accent text-white">
                          Match
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {row.diameterMm} mm <span className="text-muted-foreground text-[11px]">({row.diameterInches})</span>
                    </td>
                    <td className="py-3 px-4">
                      {row.circumferenceCm} cm <span className="text-muted-foreground text-[11px]">({row.circumferenceInches})</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{row.fitProfile}</td>
                    {onSelectSize && (
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectSize(row.size)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer",
                            isPropSelected
                              ? "bg-emerald-700 text-white"
                              : "bg-muted hover:bg-accent hover:text-white text-secondary"
                          )}
                        >
                          {isPropSelected ? "Active" : "Pick"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
