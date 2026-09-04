"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, pathname]);

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { label: "Collections", href: "/collections" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Bestsellers", href: "/bestsellers" },
    { label: "Bridal", href: "/bridal" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="bg-primary text-on-primary text-center py-2 px-3 sm:px-4 text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest font-body uppercase">
        Free Shipping on Orders Above ₹2,999 <span className="hidden xs:inline">&nbsp;|&nbsp;</span><span className="inline xs:hidden"> · </span>Use Code:{" "}
        <span className="font-semibold text-accent-light">RADHA10</span>
      </div>

      {/* ── Main Navbar ── */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            : "bg-background"
        )}
      >
        <nav
          className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — Mobile hamburger + Desktop nav */}
            <div className="flex items-center gap-8">
              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden cursor-pointer p-1 -ml-1"
                aria-label="Open navigation menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="16" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Desktop Nav Links */}
              <ul className="hidden lg:flex items-center gap-7">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover-underline font-body text-[11px] uppercase tracking-[0.18em] text-secondary hover:text-accent transition-colors duration-300 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center — Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
            >
              {/* Crown icon */}
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                className="text-accent mb-0.5 transition-transform duration-500 group-hover:scale-110"
              >
                <path
                  d="M1 12L4 4L7 8L10 1L13 8L16 4L19 12H1Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="none"
                />
                <circle cx="4" cy="3.5" r="1" fill="currentColor" />
                <circle cx="10" cy="0.5" r="1" fill="currentColor" />
                <circle cx="16" cy="3.5" r="1" fill="currentColor" />
              </svg>
              <span className="font-heading text-xl sm:text-2xl lg:text-[26px] font-semibold text-primary tracking-wide">
                Radha Rani
              </span>
              <span className="font-body text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-muted-foreground -mt-0.5">
                Bangles
              </span>
            </Link>

            {/* Right — Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer p-1.5 hover:text-accent transition-colors duration-300"
                aria-label="Search products"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative cursor-pointer p-1.5 hover:text-accent transition-colors duration-300 hidden sm:block"
                aria-label="Wishlist"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={wishlistCount > 0 ? "#A16207" : "none"}
                  stroke={wishlistCount > 0 ? "#A16207" : "currentColor"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-on-accent text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative cursor-pointer p-1.5 hover:text-accent transition-colors duration-300"
                aria-label="Shopping cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-on-accent text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="cursor-pointer p-1.5 hover:text-accent transition-colors duration-300 hidden sm:block"
                aria-label="My account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="relative animate-fade-in-down">
            <div className="bg-white shadow-xl py-6 px-4 sm:px-8">
              <div className="max-w-3xl mx-auto flex items-center gap-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  placeholder="Search for bangles, collections, styles..."
                  className="flex-1 font-body text-base outline-none border-none bg-transparent placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="cursor-pointer p-1 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Close search"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="max-w-3xl mx-auto mt-4 flex flex-wrap gap-2">
                {["Gold Bangles", "Bridal Sets", "Kundan", "Diamond", "Under ₹10,000"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-body tracking-wide px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent cursor-pointer transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in-left">
            {/* Close + Brand */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <span className="font-heading text-xl font-semibold text-primary">
                  Radha Rani
                </span>
                <span className="block font-body text-[8px] tracking-[0.3em] uppercase text-muted-foreground">
                  Bangles
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="cursor-pointer p-1"
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="p-5" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-3 px-2 font-body text-sm uppercase tracking-[0.15em] text-secondary hover:text-accent hover:pl-4 transition-all duration-300 border-b border-border/50 cursor-pointer",
                        `stagger-${i + 1} animate-fade-in-up`
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile bottom actions */}
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border bg-cream">
              <div className="flex items-center gap-6">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-secondary hover:text-accent transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="relative">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={wishlistCount > 0 ? "#A16207" : "none"}
                      stroke={wishlistCount > 0 ? "#A16207" : "currentColor"}
                      strokeWidth="1.5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  Wishlist {wishlistCount > 0 && <span className="bg-accent text-on-accent text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none">{wishlistCount}</span>}
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-xs font-body uppercase tracking-wider text-secondary hover:text-accent transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
