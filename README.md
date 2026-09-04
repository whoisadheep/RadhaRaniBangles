# 👑 Radha Rani Bangles — Luxury E-Commerce Experience

A luxury Indian bangles & jewelry e-commerce website built with **Next.js 15 App Router**, **Tailwind CSS**, and **Lenis Smooth Scrolling**, inspired by Tiffany & Co's spatial depth and traditional Indian royal artistry.

---

## ✨ Features

- **Liquid Glass & Antigravity Aesthetics**: Translucent glassmorphic badges, soft ambient glows, and floating shadow depth.
- **Buttery-Smooth Inertial Scrolling**: Integrated **Lenis Smooth Scroll** with reduced-motion accessibility support.
- **Transparent Bangles Hero Showcase**: Floating hero product view with responsive trust certifications (22K Pure Gold, BIS Hallmark).
- **Curated Collections Showcase**: 6 signature categories (Gold, Silver, Diamond, Kundan, Bridal Sets, Daily Wear) with custom transparent product renders.
- **Product Catalog & Dynamic Filter Tabs**: Interactive filters (*All*, *Bestsellers*, *New Arrivals*) with hover zoom and quick cart actions.
- **Full Catalog & Multi-Faceted Filters (`/collections`)**: Filter by category, price tier, and metal materials.
- **Interactive Product Details (`/product/[slug]`)**: Multi-angle image selector, size selector (2.2" - 2.10"), quantity modifier, tabbed specifications, and recommendations.
- **Real-Time Shopping Bag (`/cart`)**: Dynamic quantity adjustments, coupon application, and free-shipping progress indicator.
- **Checkout & Order Capture (`/checkout`)**: Customer delivery form that creates a pending order in Supabase for the admin order dashboard.
- **Brand Story (`/about`) & Store Locator (`/contact`)**: Artisanal mission storytelling and validated contact inquiry form.
- **Modular Data Architecture (`src/lib/data.ts`)**: Structured TypeScript models ready to connect to any backend or Admin Panel.

---

## 🎨 Design System

| Token | Value | Role |
| :--- | :--- | :--- |
| **Typography** | [Cormorant](https://fonts.google.com/specimen/Cormorant) & [Montserrat](https://fonts.google.com/specimen/Montserrat) | Luxury Editorial Serif (Headings) + High-Legibility Sans-Serif (Body) |
| **Primary Base** | `#1C1917` & `#FAFAF9` | Rich near-black and warm pearl-cream background |
| **Royal Gold Accent** | `#A16207` & `#D4A853` | Handcrafted gold glow, badge highlights, and CTAs |
| **Rose Gold Accent** | `#B76E79` | Special discount badges & soft accents |
| **Glassmorphism** | `glass-gold`, `backdrop-blur-md` | Layered translucent depth |

*Full specification persisted in [`design-system/radha-rani-bangles/MASTER.md`](design-system/radha-rani-bangles/MASTER.md).*

---

## 📁 Project Structure

```
RadhaRaniBangles/
├── src/
│   ├── app/
│   │   ├── about/page.tsx          # Brand story & artisanal values
│   │   ├── cart/page.tsx           # Shopping bag & checkout flow
│   │   ├── collections/page.tsx    # Catalog & multi-filter shop
│   │   ├── contact/page.tsx        # Store locator & contact form
│   │   ├── product/[slug]/page.tsx # Dynamic product detail page
│   │   ├── globals.css             # Design tokens & Lenis styling
│   │   ├── layout.tsx              # Root layout + SmoothScroll provider
│   │   └── page.tsx                # Luxury homepage
│   ├── components/
│   │   ├── Navbar.tsx              # Sticky glass navbar & mobile drawer
│   │   ├── Footer.tsx              # Multi-column footer
│   │   └── SmoothScroll.tsx        # Lenis smooth scroll provider
│   └── lib/
│       ├── data.ts                 # Product, Category, Testimonial data
│       └── utils.ts                # Price formatting (INR) & class merger
├── public/
│   └── images/
│       ├── hero-bangles.png        # Transparent hero bangle stack
│       └── categories/             # Transparent collection category images
├── design-system/                  # Design intelligence specs
├── next.config.ts                  # Remote image configuration
├── tailwind.config.ts / postcss    # Tailwind styling config
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

### 4. Enable live order capture

Run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL editor, then create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these variables, customers can browse and add items to a local cart, but checkout will not submit an order. The current checkout records an order request; payment and delivery can then be confirmed by your team from the admin dashboard.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
