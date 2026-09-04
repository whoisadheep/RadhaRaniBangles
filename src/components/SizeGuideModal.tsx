"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BangleSizeCalculator } from "@/components/BangleSizeCalculator";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
  selectedSize?: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  onSelectSize,
  selectedSize,
}: SizeGuideModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplySize = (size: string) => {
    if (onSelectSize) {
      onSelectSize(size);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] text-foreground rounded-2xl sm:rounded-3xl shadow-2xl border border-accent/20 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-fade-in-up">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border/70 flex items-start justify-between bg-white/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-body text-[10px] uppercase tracking-wider font-semibold mb-1">
              <span>✦ Radha Rani Sizing</span>
            </div>
            <h2 id="size-guide-title" className="font-heading text-2xl sm:text-3xl font-semibold text-primary">
              Find Your Perfect Bangle Size
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Quick interactive fit calculator to ensure your bangles slide on gracefully
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-muted text-primary flex items-center justify-center shadow-xs border border-border/60 transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6">
          <BangleSizeCalculator
            onSelectSize={handleApplySize}
            selectedSize={selectedSize}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-cream/40 border-t border-border/60 flex items-center justify-between text-xs font-body text-muted-foreground">
          <span>Need custom bridal sizing? Reach us on WhatsApp.</span>
          <Link
            href="/size-guide"
            onClick={onClose}
            className="text-accent hover:underline font-medium"
          >
            Full Sizing Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
