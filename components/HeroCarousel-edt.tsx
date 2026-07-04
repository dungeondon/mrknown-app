"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Slide {
  title: string;
  subtitle: string;
  bg: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    title: "Bespoke AI™\nLaundry",
    subtitle: "Total AI Laundry, Perfect Washcare",
    bg: "#1a2740",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
  },
  {
    title:
      "Sony WH-CH720N Active Noise Cancellation Wireless Bluetooth Over Ear Headphones",
    subtitle: "Industry-leading noise cancellation",
    bg: "#111827",
    image:
      "https://hiqnhunwbmdjqfwvjtmv.supabase.co/storage/v1/object/public/product-images/sony-WH-CH720N-active-noise-cancellation-wireless-bluetooth-over-ear-headphones.webp",
  },
  {
    title: "Lucky Deer Family Ceramic Figures",
    subtitle: "Handcrafted by Indian artisans",
    bg: "#111827",
    image:
      "https://hiqnhunwbmdjqfwvjtmv.supabase.co/storage/v1/object/public/product-images/lucky-deer-family-ceramic-figures.webp",
  },
  {
    title: "Apple AirPods Pro\n2nd Generation",
    subtitle: "Adaptive transparency, rebuilt from scratch",
    bg: "#1e293b",
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=400&fit=crop",
  },
];

// Thumbnails are tied 1:1 to slides — use slide images so active state is accurate
const THUMB_COUNT = 4;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[active];

  return (
    <div
      className="flex flex-col gap-2"
      role="region"
      aria-label="Featured product carousel"
    >
      {/* Main slide */}
      <div
        className="rounded-2xl overflow-hidden relative h-56 sm:h-96 flex items-end p-6"
        style={{ background: slide.bg }}
      >
        <Image
          src={slide.image}
          alt={slide.title.replace("\n", " ")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-60 transition-opacity duration-500"
          priority
        />
        <div className="relative z-10 text-white">
          <p className="text-xl font-semibold leading-snug whitespace-pre-line">
            {slide.title}
          </p>
          <p className="text-sm text-gray-300 mt-1">{slide.subtitle}</p>
        </div>

        {/* Dot controls */}
        <div
          className="absolute bottom-4 right-4 flex gap-1.5 z-10"
          role="tablist"
          aria-label="Slide indicators"
        >
          {SLIDES.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}: ${s.title.replace("\n", " ")}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "bg-white w-4" : "bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip — bound to slide count to avoid broken active state */}
      {/* <div className="flex gap-2" aria-label="Slide thumbnails">
        {Array.from({ length: THUMB_COUNT }, (_, i) => {
          const slideIdx = i % SLIDES.length;
          const thumbSlide = SLIDES[slideIdx];
          return (
            <button
              key={i}
              onClick={() => setActive(slideIdx)}
              aria-label={`Go to slide: ${thumbSlide.title.replace("\n", " ")}`}
              className={`flex-1 rounded-lg overflow-hidden h-14 relative border-2 transition-all ${
                slideIdx === active
                  ? "border-orange-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={thumbSlide.image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div> */}
    </div>
  );
}
