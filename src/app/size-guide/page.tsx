"use client";

import Link from "next/link";
import { BangleSizeCalculator } from "@/components/BangleSizeCalculator";

export default function SizeGuidePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="bg-cream/50 border-b border-border/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-medium">Bangle Size Guide</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Header ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-cream/40 via-background to-background text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-body text-xs uppercase tracking-wider font-semibold mb-4">
            <span>✦ Precision Craftsmanship</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary">
            Indian Bangle Sizing Guide
          </h1>
          <p className="font-body text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Indian bangles are measured by their inside diameter in inches and eighths. Use our interactive
            virtual fit calculator below to discover your exact size before ordering.
          </p>
        </div>
      </section>

      {/* ── Interactive Calculator Section ── */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border/80 shadow-xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary mb-2">
              Virtual Wrist & Hand Calculator
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted-foreground mb-6">
              Select your measurement method below to see your recommended Radha Rani bangle size in real-time.
            </p>

            <BangleSizeCalculator />
          </div>
        </div>
      </section>

      {/* ── Visual Step-by-Step Instructions ── */}
      <section className="py-16 bg-cream/40 border-y border-border/60 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary">
              How to Measure at Home
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted-foreground mt-2">
              Slip-on bangles must clear your knuckles, not just your wrist bone. Here is the jeweler-tested 3-step method:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-border/70 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-heading font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                Bring Fingers Together
              </h3>
              <p className="font-body text-xs text-secondary leading-relaxed">
                Tuck your thumb into your palm toward your little finger, making your hand as narrow as possible, exactly as if you were sliding on a bangle.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-border/70 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-heading font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                Wrap Ribbon or String
              </h3>
              <p className="font-body text-xs text-secondary leading-relaxed">
                Take a piece of string or ribbon and wrap it snugly around the widest part of your hand (across your thumb base and knuckle line). Mark where the ends meet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-border/70 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-heading font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                Measure Flat on a Ruler
              </h3>
              <p className="font-body text-xs text-secondary leading-relaxed">
                Lay the marked string flat along a ruler in centimeters or inches. Match the reading to our calculator above to find your exact Radha Rani size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sizing FAQ Section ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary">
              Frequently Asked Sizing Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What do the numbers 2.2, 2.4, 2.6, 2.8 mean?",
                a: "In traditional Indian jewelry notation, the first digit represents whole inches (2 inches), and the second digit represents fractions in sixteenths or eighths of an inch. For example, 2.6 means 2 inches and 6/16ths (2.375 inches or 60.3 mm inner diameter).",
              },
              {
                q: "Which size should I buy if I am gifting?",
                a: "Size 2.6 is the universal Indian gift size. Over 55% of Indian women wear size 2.6 comfortably. If the recipient is particularly petite or slender, choose 2.4.",
              },
              {
                q: "Do openable or screw-fastened kadas follow the same size?",
                a: "No! Screw kadas, spring locks, and openable bangles do not need to slide over the hand knuckles. You can comfortably choose one size smaller (e.g. 2.4 instead of 2.6) for a closer wrist drape.",
              },
              {
                q: "What if I fall between two sizes?",
                a: "For slip-on glass or metal bangles, always round UP to the next size so you don't struggle to put them on or risk damaging your jewelry.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-border/60 shadow-xs">
                <h3 className="font-heading text-base sm:text-lg font-semibold text-primary mb-2">
                  {faq.q}
                </h3>
                <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-on-accent font-body text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Explore Handcrafted Bangles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
