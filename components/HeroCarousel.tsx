"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Update these slides yourself ─────────────────────────────────────────────

const SLIDES = [
  {
    id: 1,
    title: "Bespoke AI™ Laundry",
    subtitle: "Total AI Laundry, Perfect Washcare",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    href: "/products?category=Home+Appliances",
  },
  {
    id: 2,
    title: "Sony WH-CH720N Headphones",
    subtitle: "Industry-leading noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    href: "/products/sony-wh-ch720n-active-noise-cancellation-wireless-bluetooth-over-ear-headphones",
  },
  {
    id: 3,
    title: "Lucky Deer Family Ceramic Figures",
    subtitle: "Handcrafted by Indian artisans",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    href: "/products/lucky-deer-family-ceramic-figures",
  },
  {
    id: 4,
    title: "Apple AirPods Pro 2nd Generation",
    subtitle: "Adaptive transparency, rebuilt from scratch",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=400&fit=crop",
    href: "/products?category=Mobiles",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const slide = SLIDES[active];

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-56 sm:h-80"
      role="region"
      aria-label="Featured product carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Clickable slide */}
      <Link
        href={slide.href}
        className="block w-full h-full bg-gray-900"
        aria-label={slide.title}
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-60 transition-opacity duration-500"
          priority
        />

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 p-6 z-10 text-white">
          <p className="text-xl font-bold leading-snug drop-shadow">{slide.title}</p>
          <p className="text-sm text-gray-300 mt-1 drop-shadow">{slide.subtitle}</p>
        </div>
      </Link>

      {/* Dots */}
      <div
        className="absolute bottom-4 right-4 flex gap-1.5 z-20"
        role="tablist"
        aria-label="Slide indicators"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}: ${s.title}`}
            onClick={(e) => { e.preventDefault(); setActive(i); }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "bg-white w-4" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
