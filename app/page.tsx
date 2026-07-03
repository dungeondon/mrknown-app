import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/supabase";
// import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedSlider from "@/components/FeaturedSlider";
import TestimonialSlider from "@/components/TestimonialSlider";
import StatsCounter from "@/components/StatsCounter";

export const revalidate = 3600;

const STATS = [
  { label: "Best Home Appliances", count: "120+", unit: "Products" },
  { label: "Best Mobile Phones", count: "180+", unit: "Mobiles" },
  { label: "Best Wearables", count: "50+", unit: "Devices" },
  { label: "Others", count: "1500+", unit: "Products" },
];

const CATEGORIES = [
  "Mobiles",
  "Home Appliances",
  "Wearables",
  "Music",
  "Health & Lifestyle",
  "Kitchen",
  "Home Decors",
  "Garden",
  "Babies & Kids",
];

const TESTIMONIALS = [
  {
    name: "Mounika Arrala",
    location: "Hyderabad | Mar 2023",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face",
    text: "I got the best Front Load Washing Machine, I am very happy with this choice. This appliance has truly elevated my laundry routine to a whole new level. The cleaning performance is outstanding, my clothes come out looking and smelling fresh every time.",
  },
];

const TESTIMONIAL_PHOTOS = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop",
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="bg-white">
      {/* ─── HERO ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 border border-dashed border-orange-300 text-orange-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              Best in the market
              <span>🇮🇳</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Find the best from{" "}
              <span className="text-orange-500">mrknown</span> before you buy
            </h1>

            <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
              Curated picks across headphones, tablets, wearables, and more..
              with honest pros, cons, and direct buy links.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-colors"
            >
              Browse all best products
            </Link>
          </div>

          {/* Right: Carousel */}
          <HeroCarousel />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <StatsCounter />
      {/* <section className="border-y border-gray-100 bg-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(({ label, count, unit }) => (
              <div key={label} className="px-6 py-5">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-3xl font-extrabold text-orange-500 leading-none">
                  {count}
                </p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ─── FEATURED PICKS ─── */}
      <FeaturedSlider products={featured} />

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="bg-gray-50 py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
            Shop by category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-orange-400 hover:text-orange-500 transition-colors shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialSlider />
    </div>
  );
}
