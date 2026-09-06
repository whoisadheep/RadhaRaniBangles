export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  material: string;
  weight?: string;
  size?: string;
  hallmark?: string;
  careInstructions?: string[];
  craftsmanshipDetails?: string;
  boxContents?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

// ─── Categories ───────────────────────────────────────

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Gold Bangles",
    slug: "gold-bangles",
    image: "/images/categories/gold-bangles.png",
    description: "Timeless 22K gold bangles crafted with precision",
    productCount: 3,
  },
  {
    id: "cat-2",
    name: "Silver Bangles",
    slug: "silver-bangles",
    image: "/images/categories/silver-bangles.png",
    description: "Elegant sterling silver pieces for everyday grace",
    productCount: 2,
  },
  {
    id: "cat-3",
    name: "Diamond Bangles",
    slug: "diamond-bangles",
    image: "/images/categories/diamond-bangles.png",
    description: "Sparkling diamond-studded bangles for special moments",
    productCount: 2,
  },
  {
    id: "cat-4",
    name: "Kundan Bangles",
    slug: "kundan-bangles",
    image: "/images/categories/kundan-bangles.png",
    description: "Traditional Kundan artistry meets modern design",
    productCount: 2,
  },
  {
    id: "cat-5",
    name: "Bridal Sets",
    slug: "bridal-sets",
    image: "/images/categories/bridal-sets.png",
    description: "Complete bridal bangle sets for your special day",
    productCount: 1,
  },
  {
    id: "cat-6",
    name: "Daily Wear",
    slug: "daily-wear",
    image: "/images/categories/daily-wear.png",
    description: "Lightweight, comfortable bangles for every day",
    productCount: 2,
  },
];

// ─── Products ─────────────────────────────────────────

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Ananya Gold Kada",
    slug: "ananya-gold-kada",
    price: 45999,
    originalPrice: 52999,
    images: [
      "/images/products/product-1.jpg",
      "/images/products/product-2.jpg",
      "/images/products/product-3.jpg",
    ],
    category: "Gold Bangles",
    categorySlug: "gold-bangles",
    description:
      "A magnificent 22K gold kada featuring intricate filigree work inspired by Rajasthani heritage. Each piece is hand-finished by master artisans with delicate floral carvings and polished edges.",
    rating: 4.8,
    reviews: 124,
    isBestseller: true,
    material: "22K Gold",
    weight: "18.5g",
    size: "2.6 inches",
  },
  {
    id: "prod-2",
    name: "Meera Diamond Bangle",
    slug: "meera-diamond-bangle",
    price: 89999,
    images: [
      "/images/products/product-2.jpg",
      "/images/products/product-3.jpg",
      "/images/products/product-1.jpg",
    ],
    category: "Diamond Bangles",
    categorySlug: "diamond-bangles",
    description:
      "Exquisite bangle set with brilliant-cut diamonds in an 18K white gold setting. A statement of timeless elegance with micro-pavé diamonds that catch light from every angle.",
    rating: 4.9,
    reviews: 87,
    isNew: true,
    material: "18K White Gold, Diamonds",
    weight: "22g",
    size: "2.4 inches",
  },
  {
    id: "prod-3",
    name: "Radha Kundan Set",
    slug: "radha-kundan-set",
    price: 34999,
    originalPrice: 39999,
    images: [
      "/images/products/product-3.jpg",
      "/images/products/product-5.jpg",
      "/images/products/product-6.jpg",
    ],
    category: "Kundan Bangles",
    categorySlug: "kundan-bangles",
    description:
      "Handcrafted Kundan bangles with uncut polki stones and traditional red-green meenakari work on the inner surface. A bridal and festive favorite.",
    rating: 4.7,
    reviews: 203,
    isBestseller: true,
    material: "Gold-plated, Kundan Stones",
    weight: "45g (set)",
    size: "2.6 inches",
  },
  {
    id: "prod-4",
    name: "Lakshmi Silver Cuff",
    slug: "lakshmi-silver-cuff",
    price: 8999,
    images: [
      "/images/products/product-4.jpg",
      "/images/products/product-7.jpg",
    ],
    category: "Silver Bangles",
    categorySlug: "silver-bangles",
    description:
      "Pure 925 sterling silver cuff bangle with temple-inspired Lakshmi motif. Hand-oxidized finish creates dramatic depth and vintage allure.",
    rating: 4.6,
    reviews: 156,
    material: "925 Sterling Silver",
    weight: "32g",
    size: "Adjustable",
  },
  {
    id: "prod-5",
    name: "Bridal Chura Set",
    slug: "bridal-chura-set",
    price: 15999,
    originalPrice: 19999,
    images: [
      "/images/products/product-5.jpg",
      "/images/products/product-6.jpg",
      "/images/products/product-3.jpg",
    ],
    category: "Bridal Sets",
    categorySlug: "bridal-sets",
    description:
      "Complete royal bridal chura set featuring rich vermilion and ivory bangles adorned with golden latkans, fine kundan borders, and glittering stones.",
    rating: 4.9,
    reviews: 312,
    isBestseller: true,
    material: "Acrylic, Gold-plated Metal",
    weight: "180g (set)",
    size: "2.4, 2.6, 2.8 inches",
  },
  {
    id: "prod-6",
    name: "Priya Rose Gold Bangle",
    slug: "priya-rose-gold-bangle",
    price: 28999,
    images: [
      "/images/products/product-6.jpg",
      "/images/products/product-5.jpg",
      "/images/products/product-2.jpg",
    ],
    category: "Gold Bangles",
    categorySlug: "gold-bangles",
    description:
      "Modern rose gold bangle with geometric pattern and subtle diamond pavé. Sleek, comfortable, and tailored for contemporary evening wear.",
    rating: 4.5,
    reviews: 98,
    isNew: true,
    material: "18K Rose Gold",
    weight: "14g",
    size: "2.4 inches",
  },
  {
    id: "prod-7",
    name: "Devi Temple Bangle",
    slug: "devi-temple-bangle",
    price: 62999,
    images: [
      "/images/products/product-7.jpg",
      "/images/products/product-8.jpg",
      "/images/products/product-1.jpg",
    ],
    category: "Gold Bangles",
    categorySlug: "gold-bangles",
    description:
      "Magnificent temple jewelry bangle with Goddess motifs, intricate granulation work, and natural Burmese ruby accents.",
    rating: 4.8,
    reviews: 67,
    material: "22K Gold, Rubies",
    weight: "28g",
    size: "2.6 inches",
  },
  {
    id: "prod-8",
    name: "Kavya Platinum Band",
    slug: "kavya-platinum-band",
    price: 125999,
    originalPrice: 145999,
    images: [
      "/images/products/product-8.jpg",
      "/images/products/product-4.jpg",
      "/images/products/product-2.jpg",
    ],
    category: "Diamond Bangles",
    categorySlug: "diamond-bangles",
    description:
      "Ultra-sleek platinum bangle with channel-set princess-cut diamonds. Minimalist luxury with a secure spring clasp.",
    rating: 5.0,
    reviews: 42,
    isNew: true,
    isBestseller: true,
    material: "Platinum, Diamonds",
    weight: "26g",
    size: "2.4 inches",
  },
  {
    id: "prod-9",
    name: "Zara Oxidized Set",
    slug: "zara-oxidized-set",
    price: 4999,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Daily Wear",
    categorySlug: "daily-wear",
    description:
      "Boho-chic oxidized silver bangles set of 6. Lightweight, smooth-edged, and perfect for stacking with ethnic and western outfits.",
    rating: 4.4,
    reviews: 289,
    isBestseller: true,
    material: "Oxidized Silver-plated Alloy",
    weight: "60g (set of 6)",
    size: "2.6 inches",
  },
  {
    id: "prod-10",
    name: "Rani Haar Bangle",
    slug: "rani-haar-bangle",
    price: 52999,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Kundan Bangles",
    categorySlug: "kundan-bangles",
    description:
      "Royal Mughal-inspired broad bangle with jadau work, emerald green hydro stones, and freshwater pearl clusters.",
    rating: 4.7,
    reviews: 134,
    material: "Gold-plated, Jadau, Pearls",
    weight: "38g",
    size: "2.6 inches",
  },
  {
    id: "prod-11",
    name: "Sia Charm Bracelet",
    slug: "sia-charm-bracelet",
    price: 6999,
    originalPrice: 8999,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Daily Wear",
    categorySlug: "daily-wear",
    description:
      "Delicate gold-plated charm bangle with tiny jhumka and ghungroo charms. Adds a playful chime to your everyday gestures.",
    rating: 4.3,
    reviews: 178,
    isNew: true,
    material: "Gold-plated Brass",
    weight: "12g",
    size: "Adjustable",
  },
  {
    id: "prod-12",
    name: "Royal Pacheli Set",
    slug: "royal-pacheli-set",
    price: 74999,
    images: [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Bridal Sets",
    categorySlug: "bridal-sets",
    description:
      "Rajasthani Pacheli bangles in 22K gold with red and green meenakari work and diamond-cut floral motifs. A traditional bridal heirloom.",
    rating: 4.9,
    reviews: 91,
    isBestseller: true,
    material: "22K Gold, Meenakari",
    weight: "65g (pair)",
    size: "2.6 inches",
  },
];

// ─── Testimonials ─────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "The Ananya Gold Kada exceeded all my expectations. The craftsmanship is exquisite, and it arrived in the most beautiful luxury box with certificate. Radha Rani Bangles has become my go-to for every festive family function.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-2",
    name: "Anjali Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "I ordered the Bridal Chura Set for my wedding and received endless compliments! The shine, finishing, and customer service team were exceptionally helpful with sizing guidance.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-3",
    name: "Deepika Reddy",
    location: "Hyderabad, Telangana",
    rating: 5,
    text: "Beautiful collection of daily wear bangles. I've been wearing the Zara Oxidized Set every day for months and they still look brand new. Outstanding quality!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-4",
    name: "Meenakshi Iyer",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "The Devi Temple Bangle is a masterpiece. It reminds me of the heritage bangles my grandmother wore. Thank you for keeping our traditions alive with such artistic perfection.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-5",
    name: "Kavita Singh",
    location: "Jaipur, Rajasthan",
    rating: 5,
    text: "As someone from Jaipur, I have very high standards for Kundan jewelry. The Radha Kundan Set is absolutely stunning — the polki stones and meenakari work are 100% authentic.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test-6",
    name: "Nisha Gupta",
    location: "Delhi, NCR",
    rating: 5,
    text: "The Priya Rose Gold Bangle is my everyday luxury piece. It's elegant enough for office boardrooms yet pairs effortlessly with ethnic silk sarees. Absolutely love it!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];
