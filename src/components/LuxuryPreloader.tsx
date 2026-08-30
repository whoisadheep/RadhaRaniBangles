"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { products, categories, testimonials } from "@/lib/data";

/* ═══════════════════════════════════════════════════
   RADHA RANI BANGLES — "Self-Drawing Bangle" Preloader

   Concept: A golden bangle draws itself from nothing,
   the brand name sweeps in with a gold reveal, and the
   screen splits open like a jewelry box.

   All images from data + pages are preloaded before
   the site is revealed.
   ═══════════════════════════════════════════════════ */

/** Collect EVERY image used across the entire site */
function getAllSiteImages(): string[] {
  const urls = new Set<string>();

  // Hero image
  urls.add("/images/hero-bangles.png");

  // Category images
  for (const cat of categories) {
    urls.add(cat.image);
  }

  // All product images (every variant)
  for (const p of products) {
    for (const img of p.images) {
      urls.add(img);
    }
  }

  // Testimonial avatars
  for (const t of testimonials) {
    urls.add(t.avatar);
  }

  // About page hero
  urls.add(
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85"
  );

  // Homepage craftsmanship banner
  urls.add(
    "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1600&q=85"
  );

  // Instagram gallery
  const instaUrls = [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80",
  ];
  for (const u of instaUrls) {
    urls.add(u);
  }

  return Array.from(urls);
}

const ALL_IMAGES = getAllSiteImages();

const LUXURY_PHRASES = [
  "Awakening Royal Heritage…",
  "Selecting 22K Hallmarked Gold…",
  "Polishing Precious Stones…",
  "Arranging Curated Collections…",
  "Unveiling Timeless Grace…",
];

/* ── Dust Motes: tiny gold sparks that burst outward ── */
const DUST_PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = Math.random() * 360;
  const dist = 40 + Math.random() * 80;
  return {
    id: i,
    dx: Math.cos((angle * Math.PI) / 180) * dist,
    dy: Math.sin((angle * Math.PI) / 180) * dist,
    size: 1.5 + Math.random() * 2.5,
    delay: Math.random() * 3,
    duration: 2.5 + Math.random() * 2,
  };
});

export function LuxuryPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const triggerExit = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
      sessionStorage.setItem("rr_preloader_seen", "true");
    }, 1000);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const hasVisited = sessionStorage.getItem("rr_preloader_seen");
    const totalImages = ALL_IMAGES.length;
    let loadedCount = 0;
    let allImagesLoaded = false;
    const startTime = Date.now();
    const minDuration = hasVisited ? 1500 : 2800;

    const checkComplete = () => {
      if (allImagesLoaded) return;
      loadedCount++;
      if (loadedCount >= totalImages) {
        allImagesLoaded = true;
      }
    };

    // Preload ALL images used on the site
    ALL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkComplete;
      img.onerror = checkComplete; // count errors too so we don't hang
    });

    // Smooth progress incrementer — driven by actual image load count
    const interval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = Date.now() - startTime;
        // Image-based progress (the real metric)
        const imageProg = Math.round((loadedCount / totalImages) * 100);
        // Time-based floor (so it doesn't sit at 0 on fast loads)
        const timeFloor = Math.min(90, Math.round((elapsed / minDuration) * 90));
        // Use whichever is higher, but cap time-floor at 90 so
        // the last 10% always waits for real image completion
        const target = Math.max(imageProg, timeFloor);

        if (prev < target) {
          const step = Math.ceil((target - prev) / 6) || 1;
          const next = Math.min(100, prev + step);

          if (next >= 80) setPhraseIndex(4);
          else if (next >= 60) setPhraseIndex(3);
          else if (next >= 40) setPhraseIndex(2);
          else if (next >= 20) setPhraseIndex(1);
          else setPhraseIndex(0);

          return next;
        }

        // Only exit when ALL images are loaded AND min time passed
        if (allImagesLoaded && elapsed >= minDuration && prev >= 100) {
          clearInterval(interval);
          setTimeout(triggerExit, 400);
        }

        return prev;
      });
    }, 30);

    // Safety timeout — don't hang forever if images fail (max 8s)
    const safety = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      triggerExit();
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(safety);
      document.body.style.overflow = "";
    };
  }, [triggerExit]);

  if (!loading) return null;

  /* The SVG bangle circumference — used for stroke-dash draw effect */
  const BANGLE_R = 44;
  const BANGLE_C = 2 * Math.PI * BANGLE_R; // ~276.46

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] overflow-hidden",
        "pointer-events-auto select-none touch-none overscroll-none"
      )}
      style={{ height: "100dvh" }}
      role="status"
      aria-label={`Loading Radha Rani Bangles — ${progress}%`}
      aria-live="polite"
    >
      {/* ═══════════════════════════════════
          LAYER 1 — Split Curtain Panels
          Two halves that slide apart on exit,
          like opening a jewelry box.
          ═══════════════════════════════════ */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 z-[1]",
          "transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]"
        )}
        style={{
          height: "50.5%",
          background: "linear-gradient(180deg, #0a0908 0%, #12100e 100%)",
          transitionDuration: isExiting ? "900ms" : "0ms",
          transform: isExiting ? "translateY(-105%)" : "translateY(0)",
        }}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-[1]",
          "transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]"
        )}
        style={{
          height: "50.5%",
          background: "linear-gradient(0deg, #0a0908 0%, #12100e 100%)",
          transitionDuration: isExiting ? "900ms" : "0ms",
          transform: isExiting ? "translateY(105%)" : "translateY(0)",
        }}
      />

      {/* ═══════════════════════════════════
          LAYER 2 — Deep Atmosphere
          Radial glow + drifting warm orbs
          for spatial depth (Antigravity)
          ═══════════════════════════════════ */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {/* Base radial */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, #1a1510 0%, #0e0c0a 60%, #080706 100%)",
          }}
        />

        {/* Central pulsing gold glow */}
        <div
          className="absolute w-[60vmin] h-[60vmin] top-1/2 left-1/2 rounded-full pointer-events-none"
          style={{
            animation: "preloader-glow-pulse 4s ease-in-out infinite",
            background:
              "radial-gradient(circle, rgba(161,98,7,0.15) 0%, rgba(212,168,83,0.04) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Drifting ambient orb — top-left (rose gold tint) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "clamp(80px, 20vw, 200px)",
            height: "clamp(80px, 20vw, 200px)",
            top: "18%",
            left: "12%",
            background:
              "radial-gradient(circle, rgba(183,110,121,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "preloader-ambient-drift 9s ease-in-out infinite",
          }}
        />

        {/* Drifting ambient orb — bottom-right (gold tint) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "clamp(60px, 18vw, 180px)",
            height: "clamp(60px, 18vw, 180px)",
            bottom: "15%",
            right: "10%",
            background:
              "radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation:
              "preloader-ambient-drift 11s ease-in-out 3s infinite reverse",
          }}
        />
      </div>

      {/* ═══════════════════════════════════
          LAYER 3 — The Main Stage
          Everything centered with fluid sizing.
          ═══════════════════════════════════ */}
      <div
        className={cn(
          "absolute inset-0 z-[3] flex flex-col items-center justify-center",
          "px-6 sm:px-8",
          "transition-all ease-[cubic-bezier(0.65,0,0.35,1)]"
        )}
        style={{
          transitionDuration: isExiting ? "800ms" : "0ms",
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? "scale(1.08)" : "scale(1)",
        }}
      >
        {/* ─────────────────────────────────
            THE BANGLE — Self-drawing SVG
            The main bangle draws its stroke
            proportional to loading progress.
            ───────────────────────────────── */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "clamp(160px, 42vmin, 280px)",
            height: "clamp(160px, 42vmin, 280px)",
          }}
        >
          {/* Gold dust particles bursting around the bangle */}
          {DUST_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full will-change-transform"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                top: "50%",
                left: "50%",
                marginTop: `-${p.size / 2}px`,
                marginLeft: `-${p.size / 2}px`,
                background: `radial-gradient(circle, #D4A853 0%, rgba(212,168,83,0) 100%)`,
                boxShadow: `0 0 ${p.size * 2}px rgba(212,168,83,0.4)`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `preloader-dust ${p.duration}s ease-out ${p.delay}s infinite`,
              } as React.CSSProperties}
            />
          ))}

          {/* Outer decorative orbit ring — slow spin */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            fill="none"
            style={{
              animation: "preloader-spin 20s linear infinite",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="49"
              stroke="rgba(212,168,83,0.12)"
              strokeWidth="0.3"
              strokeDasharray="1.5 6"
            />
            {/* Tiny gem accents on outer orbit */}
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle
                key={deg}
                cx={50 + 49 * Math.cos((deg * Math.PI) / 180)}
                cy={50 + 49 * Math.sin((deg * Math.PI) / 180)}
                r="0.7"
                fill="#D4A853"
                opacity="0.4"
              />
            ))}
          </svg>

          {/* Second orbit — counter-rotating */}
          <svg
            className="absolute w-[88%] h-[88%]"
            viewBox="0 0 100 100"
            fill="none"
            style={{
              animation: "preloader-spin 14s linear infinite reverse",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="rgba(245,239,224,0.08)"
              strokeWidth="0.4"
              strokeDasharray="3 10 1 10"
            />
          </svg>

          {/* ★ THE HERO BANGLE — draws itself with progress ★ */}
          <svg
            className="absolute w-[70%] h-[70%]"
            viewBox="0 0 100 100"
            fill="none"
            style={{ animation: "preloader-breathe 3.5s ease-in-out infinite" }}
          >
            {/* Ghost track */}
            <circle
              cx="50"
              cy="50"
              r={BANGLE_R}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="3"
            />
            {/* The drawing bangle — thick gold stroke */}
            <circle
              cx="50"
              cy="50"
              r={BANGLE_R}
              stroke="url(#bangleGold)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={BANGLE_C}
              strokeDashoffset={BANGLE_C - (BANGLE_C * progress) / 100}
              className="transition-[stroke-dashoffset] duration-300 ease-out"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
            {/* Inner thin accent ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="rgba(212,168,83,0.15)"
              strokeWidth="0.5"
              strokeDasharray={2 * Math.PI * 38}
              strokeDashoffset={
                2 * Math.PI * 38 - (2 * Math.PI * 38 * progress) / 100
              }
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-300 ease-out"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
            <defs>
              <linearGradient
                id="bangleGold"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#F5EFE0" />
                <stop offset="30%" stopColor="#D4A853" />
                <stop offset="60%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#D4A853" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center: large percentage number */}
          <div className="absolute flex flex-col items-center justify-center gap-0.5">
            <span
              className="font-heading tabular-nums leading-none"
              style={{
                fontSize: "clamp(1.75rem, 6vmin, 3.2rem)",
                fontWeight: 600,
                background:
                  "linear-gradient(180deg, #F5EFE0 0%, #D4A853 60%, #A16207 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {progress < 10 ? `0${progress}` : `${progress}`}
            </span>
            <span
              className="font-body uppercase tracking-[0.25em]"
              style={{
                fontSize: "clamp(6px, 1.5vmin, 9px)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              percent
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────
            BRAND NAME — Gold sweep reveal
            ───────────────────────────────── */}
        <div
          className="mt-8 sm:mt-10 text-center"
          style={{
            animation: "preloader-text-reveal 1s ease-out 0.3s both",
          }}
        >
          <h1
            className="font-heading font-semibold tracking-[0.08em] leading-tight"
            style={{
              fontSize: "clamp(1.5rem, 5.5vw, 2.8rem)",
              background:
                "linear-gradient(90deg, #A16207, #D4A853, #F5EFE0, #D4A853, #A16207)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "preloader-golden-sweep 3.5s ease-in-out infinite",
            }}
          >
            Radha Rani
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="font-body uppercase text-center mt-2 sm:mt-3"
          style={{
            fontSize: "clamp(7px, 1.6vw, 11px)",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.35)",
            animation: "preloader-fade-up 0.8s ease-out 0.6s both",
          }}
        >
          Luxury Bangles &amp; Jewelry
        </p>

        {/* ─────────────────────────────────
            STATUS LINE — Progress bar + phrase
            ───────────────────────────────── */}
        <div
          className="w-full mt-8 sm:mt-10"
          style={{
            maxWidth: "clamp(220px, 50vw, 340px)",
            animation: "preloader-fade-up 0.8s ease-out 0.9s both",
          }}
        >
          {/* Thin progress rail */}
          <div
            className="relative w-full overflow-hidden rounded-full"
            style={{ height: "1.5px", background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #7C4D05 0%, #A16207 30%, #D4A853 70%, #F5EFE0 100%)",
                boxShadow:
                  "0 0 10px rgba(212,168,83,0.5), 0 0 3px rgba(161,98,7,0.6)",
              }}
            />
          </div>

          {/* Image count indicator */}
          <div className="flex items-center justify-between mt-2.5 sm:mt-3">
            <span
              className="font-body uppercase"
              style={{
                fontSize: "clamp(6px, 1.4vw, 9px)",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              Loading {ALL_IMAGES.length} assets
            </span>
            <span
              className="font-body tabular-nums"
              style={{
                fontSize: "clamp(6px, 1.4vw, 9px)",
                color: "rgba(212,168,83,0.5)",
              }}
            >
              {Math.round((progress / 100) * ALL_IMAGES.length)}/
              {ALL_IMAGES.length}
            </span>
          </div>

          {/* Rotating phrase — smooth cross-fade */}
          <div
            className="relative mt-3 sm:mt-4 overflow-hidden"
            style={{ height: "clamp(16px, 3vw, 22px)" }}
          >
            {LUXURY_PHRASES.map((phrase, i) => (
              <p
                key={i}
                className="absolute inset-x-0 text-center font-body italic transition-all duration-500 ease-out"
                style={{
                  fontSize: "clamp(8px, 1.8vw, 11px)",
                  letterSpacing: "0.06em",
                  opacity: i === phraseIndex ? 1 : 0,
                  transform:
                    i === phraseIndex
                      ? "translateY(0)"
                      : i < phraseIndex
                      ? "translateY(-10px)"
                      : "translateY(10px)",
                  color:
                    i === phraseIndex
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(255,255,255,0)",
                }}
              >
                {phrase}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
