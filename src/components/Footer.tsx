"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-on-primary">
      {/* ── Top Section ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block cursor-pointer group">
              <h3 className="font-heading text-2xl font-semibold tracking-wide group-hover:text-accent-light transition-colors duration-300">
                Radha Rani
              </h3>
              <span className="block font-body text-[9px] tracking-[0.3em] uppercase text-white/50">
                Bangles
              </span>
            </Link>
            <p className="mt-4 font-body text-sm leading-relaxed text-white/60 max-w-xs">
              Handcrafted with love, each piece tells a story of tradition,
              artistry, and timeless elegance. Since 2018.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              {[
                {
                  label: "Instagram",
                  path: "M7.8 2h8.4C19 2 21 4 21 6.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 15.2V6.8A4.8 4.8 0 0 1 7.8 2m-.2 2A2.6 2.6 0 0 0 5 6.6v8.8A2.6 2.6 0 0 0 7.6 18h8.8a2.6 2.6 0 0 0 2.6-2.6V6.6A2.6 2.6 0 0 0 16.4 4H7.6m9.65 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
                },
                {
                  label: "Facebook",
                  path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                },
                {
                  label: "Pinterest",
                  path: "M8 20l4-9m-2.5 4.5c-1 1.5-3 1.5-3.5-.5-.5-2.5 1-5 3.5-6.5s3.5 0 3 2c-.5 2-1.5 5-1 6.5.5 1.5 2 1 3-.5M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
                },
                {
                  label: "YouTube",
                  path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300 cursor-pointer"
                  aria-label={social.label}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/70"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.2em] font-semibold mb-5 text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Shop All", href: "/collections" },
                { label: "New Arrivals", href: "/new-arrivals" },
                { label: "Bestsellers", href: "/bestsellers" },
                { label: "Bridal Collection", href: "/bridal" },
                { label: "Gift Cards", href: "/gift-cards" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-accent-light transition-colors duration-300 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.2em] font-semibold mb-5 text-white/80">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Care Instructions", href: "/care" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-accent-light transition-colors duration-300 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.2em] font-semibold mb-5 text-white/80">
              Stay Connected
            </h4>
            <p className="font-body text-sm text-white/50 mb-4">
              Subscribe for exclusive offers, new arrivals, and styling inspiration.
            </p>
            <form
              className="flex"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-white/10 border border-white/15 rounded-l-md px-4 py-2.5 text-sm font-body text-white placeholder:text-white/30 outline-none focus:border-accent transition-colors duration-300"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-on-accent px-5 py-2.5 rounded-r-md font-body text-xs uppercase tracking-wider font-semibold transition-colors duration-300 cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Radha Rani Bangles. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center gap-3">
            {["Visa", "Mastercard", "UPI", "RuPay"].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 text-[10px] font-body tracking-wide border border-white/15 rounded text-white/40"
              >
                {method}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="font-body text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-body text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
