import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-cream via-background to-champagne overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-3xl" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center relative">
          <span className="inline-block font-body text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
            Our Story
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary leading-tight">
            Crafting Elegance<br />
            <em className="italic font-normal text-accent">Since 2018</em>
          </h1>
          <p className="font-body text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Radha Rani Bangles was born from a simple belief — that every woman deserves
            to wear jewelry that tells her story. We blend generations of Indian craftsmanship
            with contemporary design sensibility.
          </p>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Craftsmanship Image */}
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-white/60 relative group">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85"
                alt="Artisan crafting gold bangles"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-heading text-lg font-semibold">Artisanal Heritage</p>
                <p className="font-body text-xs text-white/80 mt-0.5">Handcrafted in Jaipur &amp; Zaveri Bazaar</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-accent">
                Our Mission
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary mt-3 leading-snug">
                Preserving Heritage,<br />Embracing Modernity
              </h2>
              <div className="font-body text-sm text-secondary leading-relaxed space-y-4 mt-6">
                <p>
                  Every bangle we create carries centuries of artisanal wisdom. Our master
                  craftsmen in Rajasthan, Gujarat, and West Bengal pour their hearts into
                  each piece — from the delicate filigree of a gold kada to the precise
                  stone-setting of a Kundan set.
                </p>
                <p>
                  We source only ethically mined materials and BIS-certified gold. Our
                  commitment to quality means every piece passes through 12 quality checks
                  before reaching your hands.
                </p>
                <p>
                  What sets us apart is our bridge between old and new. We take traditional
                  motifs — temple patterns, Mughal jali, Rajasthani meenakari — and
                  reinterpret them for the modern Indian woman who celebrates both her roots
                  and her future.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t border-border">
                {[
                  { value: "10,000+", label: "Happy Customers" },
                  { value: "500+", label: "Unique Designs" },
                  { value: "50+", label: "Master Artisans" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-2xl lg:text-3xl font-bold text-accent">
                      {stat.value}
                    </p>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 lg:py-28 bg-cream/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary section-heading">
              What We Stand For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                ),
                title: "Purity Guaranteed",
                desc: "Every gold piece is BIS hallmarked and certified. We never compromise on the purity of our materials.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
                title: "Handcrafted with Love",
                desc: "Each piece is made by hand, not mass-produced. Our artisans spend days perfecting a single bangle.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: "Ethically Sourced",
                desc: "We work only with responsible suppliers. Our gold, silver, and gemstones are ethically and sustainably sourced.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                ),
                title: "Hassle-Free Returns",
                desc: "Not satisfied? Return within 15 days for a full refund. No questions asked, no hidden charges.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="text-center p-8 rounded-2xl glass hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-5">
                  {value.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-primary">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent" />
        <div className="absolute top-8 left-8 right-8 bottom-8 border border-accent/15 rounded-sm" />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Begin Your <em className="italic font-normal text-accent-light">Journey</em>
          </h2>
          <p className="font-body text-white/60 mt-4 mb-8">
            Discover the perfect bangles that resonate with your style and heritage.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-light text-on-accent font-body text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(161,98,7,0.3)]"
          >
            Shop Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
