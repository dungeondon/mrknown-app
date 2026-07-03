"use client";

import Link from "next/link";
import { useState, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/products", label: "All Products", category: null },
  {
    href: "/products?category=Home+Appliances",
    label: "Home Appliances",
    category: "Home Appliances",
  },
  { href: "/products?category=Mobiles", label: "Mobiles", category: "Mobiles" },
  { href: "/products?category=Others", label: "Others", category: "Others" },
] as const;

// ─── Active-link nav (isolated so only this part needs useSearchParams) ──────
//
// useSearchParams() forces a component into client-only rendering unless
// wrapped in Suspense. Since Navbar lives in the root layout, leaving it
// unwrapped opted *every* page out of static rendering and broke
// `next build` entirely. Splitting it out keeps the rest of the navbar
// (and the rest of the app) statically rendered.

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory =
    pathname === "/products" ? searchParams.get("category") : null;

  return (
    <nav
      className="hidden md:flex items-center gap-6"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map(({ href, label, category }) => {
        const isActive =
          pathname === "/products" &&
          (category === null ? !activeCategory : activeCategory === category);
        return (
          <Link
            key={label}
            href={href}
            className={`text-sm whitespace-nowrap transition-colors pb-0.5 ${
              isActive
                ? "font-bold text-gray-900 border-b-2 border-gray-900"
                : "font-medium text-gray-500 hover:text-gray-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = search.trim();
      if (trimmed)
        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    },
    [search, router],
  );

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          {/* Replace with: <Image src="/logo.png" alt="mrknown" width={110} height={32} className="h-8 w-auto" /> */}
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            mrknown<span className="text-orange-500">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <Suspense
          fallback={
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Main navigation"
            />
          }
        >
          <NavLinks />
        </Suspense>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 gap-2 min-w-[180px] max-w-[220px]"
        >
          <svg
            className="text-orange-400 w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Product"
            aria-label="Search products"
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full"
          />
        </form>

        {/* Blogs CTA */}
        <Link
          href="/blogs"
          className="flex-shrink-0 bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors"
        >
          Blogs
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-700 hover:text-orange-500 py-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Mobile search */}
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileOpen(false);
            }}
            role="search"
            className="mt-2 flex items-center border border-gray-200 rounded-full px-4 py-2 gap-2"
          >
            <svg
              className="text-orange-400 w-4 h-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Product"
              aria-label="Search products"
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full"
            />
          </form>
        </nav>
      )}
    </header>
  );
}
