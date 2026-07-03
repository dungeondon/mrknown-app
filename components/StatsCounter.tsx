"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
  label: string;
  target: number;
  suffix: string;
  unit: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { label: "Best Home Appliances", target: 120, suffix: "+", unit: "Products" },
  { label: "Best Mobile Phones",   target: 180, suffix: "+", unit: "Mobiles"  },
  { label: "Best Wearables",       target: 50,  suffix: "+", unit: "Devices"  },
  { label: "Others",               target: 1500, suffix: "+", unit: "Products" },
];

// ─── Hook: count up when element enters viewport ───────────────────────────

function useCountUp(target: number, duration = 1500, triggered: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;

    let startTime: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + eased * (target - startValue)));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, triggered]);

  return count;
}

// ─── Single stat item ─────────────────────────────────────────────────────────

function StatItem({ stat, triggered }: { stat: Stat; triggered: boolean }) {
  const count = useCountUp(stat.target, 1400, triggered);

  return (
    <div className="px-6 py-5">
      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
      <p className="text-3xl font-extrabold text-orange-500 leading-none tabular-nums">
        {count.toLocaleString("en-IN")}{stat.suffix}
      </p>
      <p className="text-base font-bold text-gray-900 mt-0.5">{stat.unit}</p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatsCounter() {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="border-y border-gray-100 bg-white py-2"
      aria-label="Site statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} triggered={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
}
