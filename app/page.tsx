import Link from "next/link";
import { getFeaturedProducts } from "@/lib/supabase";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedSlider from "@/components/FeaturedSlider";
import TestimonialSlider from "@/components/TestimonialSlider";
import StatsCounter from "@/components/StatsCounter";

export const revalidate = 3600;

const CATEGORIES = [
  "Mobiles",
  "Home Appliances",
  "Wearables",
  "Music",
  "Health & Lifestyle",
  "Kitchen Appliances",
  "Home Decor",
  "Garden",
  "Babies & Kids",
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="bg-white">
      {/* ─── HERO ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-dashed border-orange-300 text-orange-500 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              Best in the market
            </div>

            <h1 className="text-5xl/[1.2] font-semibold text-gray-900 mb-5">
              mrknown helps you find the{" "}
              <span className="text-orange-500">right product</span>
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

          {/* No props needed — slides managed inside the component */}
          <HeroCarousel />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <StatsCounter />

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
