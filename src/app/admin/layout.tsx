"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ═══════════════════════════════════════════════════
   Admin Sidebar Navigation
   ═══════════════════════════════════════════════════ */

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
];

function AdminSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#100e0d]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto shadow-2xl shadow-black/30",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <Link href="/admin" className="block rounded-2xl border border-[#D4A853]/20 bg-gradient-to-br from-[#A16207]/20 via-[#1c1712] to-transparent p-5 transition-colors hover:border-[#D4A853]/40" onClick={onClose}>
            <p className="font-heading text-2xl font-semibold text-white tracking-wide">
              Radha Rani
            </p>
            <p className="font-body text-[9px] tracking-[0.3em] uppercase text-[#D4A853] mt-1">
              Atelier Console
            </p>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto" aria-label="Admin navigation">
          <p className="px-3 pb-2 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Operations</p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl font-body text-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]",
                  isActive
                    ? "bg-gradient-to-r from-[#A16207]/25 to-[#A16207]/5 text-[#f4cf7f] font-semibold shadow-[inset_2px_0_0_#D4A853]"
                    : "text-white/55 hover:text-white/90 hover:bg-white/[0.05]"
                )}
              >
                <span className={cn(isActive ? "text-[#D4A853]" : "text-white/40")}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mx-4 mb-4 px-3 py-3 border border-white/[0.07] rounded-2xl bg-white/[0.025] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-[13px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Store
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   Admin Header Bar
   ═══════════════════════════════════════════════════ */

function AdminHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const activeItem = NAV_ITEMS.find((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));
  return (
    <header className="sticky top-0 z-30 min-h-[72px] bg-[#100e0d]/75 backdrop-blur-2xl border-b border-white/[0.07] flex items-center justify-between px-4 lg:px-8">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden min-w-11 min-h-11 p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]"
        aria-label="Toggle sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="16" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="hidden sm:block ml-3">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/35">Management</p>
        <p className="font-heading text-xl font-semibold text-white leading-tight">{activeItem?.label || "Admin"}</p>
      </div>

      <div className="flex-1" />

      {/* Admin avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 font-body text-[11px] text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,.8)]" /> Store online
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A853] to-[#8a5408] border border-[#f4cf7f]/30 flex items-center justify-center text-[#1c1712] font-body text-xs font-bold shadow-lg shadow-[#A16207]/20">
          A
        </div>
        <div className="hidden sm:block">
          <p className="font-body text-[13px] text-white/80 leading-tight">Admin</p>
          <p className="font-body text-[10px] text-white/30">Owner</p>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   Admin Shell — Wraps authenticated pages
   ═══════════════════════════════════════════════════ */

function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAdminAuth();
  const pathname = usePathname();

  // Don't render shell on login page
  if (pathname === "/admin/login" || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#100e0d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_-8%,rgba(161,98,7,.16),transparent_28%),radial-gradient(circle_at_15%_92%,rgba(212,168,83,.08),transparent_25%)]" />
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Admin Root Layout
   ═══════════════════════════════════════════════════ */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
