"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating?: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mounika Arrala",
    location: "Hyderabad | Mar 2023",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face",
    text: "I got the best Front Load Washing Machine, I am very happy with this choice. This appliance has truly elevated my laundry routine to a whole new level. The cleaning performance is outstanding, my clothes come out looking and smelling fresh every time.",
    rating: 5,
  },
  {
    name: "Ravi Shankar",
    location: "Bangalore | Jan 2024",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
    text: "mrknown helped me pick the perfect pair of Sony headphones. The honest pros and cons saved me from buying something overpriced. Couldn't be happier with the recommendation and the price I found through the link.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    location: "Chennai | Nov 2023",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face",
    text: "Finally a site that doesn't just push ads at you. The product breakdowns are genuinely useful and I appreciated the real cons listed for each item. Bought an air purifier based on their review and it's been fantastic.",
    rating: 4,
  },
  {
    name: "Arun Mehta",
    location: "Delhi | Feb 2024",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=face",
    text: "The wearables section is incredibly detailed. I compared three smartwatches side by side and made an informed decision in minutes. The direct buy links also gave me the best price — saved nearly ₹2,000!",
    rating: 5,
  },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div
      className="flex items-center gap-0.5 mb-3"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  active,
}: {
  testimonial: Testimonial;
  active: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-6 flex flex-col transition-all duration-300 ${
        active
          ? "border-orange-200 shadow-md"
          : "border-gray-100 shadow-sm opacity-60"
      }`}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-orange-100">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">
            {testimonial.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{testimonial.location}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRating rating={testimonial.rating} />

      {/* Quote */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1">
        {testimonial.text}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(
    () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    [],
  );
  const next = useCallback(
    () => setActive((a) => (a + 1) % TESTIMONIALS.length),
    [],
  );

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  // Touch / swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  // Show 1 card on mobile, 3 on md+, center is always "active"
  const getVisibleIndices = () => {
    const len = TESTIMONIALS.length;
    return [(active - 1 + len) % len, active, (active + 1) % len];
  };

  const visible = getVisibleIndices();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Heading */}
      <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
        Our happy customers talk
      </h2>

      {/* Slider */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards grid — 1 col mobile, 3 col md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Mobile: show only active */}
          <div className="md:hidden">
            <TestimonialCard testimonial={TESTIMONIALS[active]} active={true} />
          </div>

          {/* Desktop: show prev / active / next */}
          {visible.map((idx, pos) => (
            <div key={idx} className="hidden md:block">
              <TestimonialCard
                testimonial={TESTIMONIALS[idx]}
                active={pos === 1}
              />
            </div>
          ))}
        </div>

        {/* Prev / Next arrow buttons */}
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition-colors hidden sm:flex"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={next}
          aria-label="Next testimonial"
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition-colors hidden sm:flex"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div
        className="flex items-center justify-center gap-2 mt-8"
        role="tablist"
        aria-label="Testimonial indicators"
      >
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Testimonial ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "bg-orange-500 w-6"
                : "bg-gray-200 w-1.5 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
