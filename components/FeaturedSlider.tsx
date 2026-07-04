"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function SliderCard({ product }: { product: Product }) {
  const discount = calcDiscount(product.price, product.original_price);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative bg-gray-50 h-80 overflow-hidden rounded-t-2xl">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="256px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-gray-200"
            aria-hidden="true"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16l4.6-4.6 3 3L16 9l5 7H4zm-2 4h20V4H2v16z" />
            </svg>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">
            {product.category}
          </span>
          <div
            className="flex items-center gap-1"
            aria-label={`Rating: ${product.rating}`}
          >
            <span className="text-amber-400 text-sm" aria-hidden="true">
              ★
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {product.rating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.review_count.toLocaleString()})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-gray-8900 text-lg leading-snug line-clamp-2 mb-4">
          {product.name}
        </h3>
        {/* <p className="text-gray-400 text-xs line-clamp-1 mb-4">
          {product.tagline}
        </p> */}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.original_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">
            Buy Now
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── View All Card ────────────────────────────────────────────────────────────

function ViewAllCard() {
  return (
    <Link
      href="/products"
      className="flex-shrink-0 w-52 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 transition-colors group"
      aria-label="View all products"
    >
      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-orange-300 transition-colors">
        <svg
          className="w-5 h-5 text-orange-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-orange-500 text-sm font-bold">View</p>
        <p className="text-gray-900 text-lg font-extrabold">All Products</p>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FeaturedSliderProps {
  products: Product[];
}

export default function FeaturedSlider({ products }: FeaturedSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Featured picks
        </h2>

        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              canScrollLeft
                ? "border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                : "border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              canScrollRight
                ? "border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                : "border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.featured-track::-webkit-scrollbar { display: none; }`}</style>

        {products.map((p) => (
          <SliderCard key={p.id} product={p} />
        ))}

        {/* View All — always last */}
        <ViewAllCard />
      </div>
    </section>
  );
}
