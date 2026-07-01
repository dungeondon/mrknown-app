'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchFilterProps {
  categories: string[]
  activeCategory?: string
  activeSearch?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchFilter({
  categories,
  activeCategory,
  activeSearch,
}: SearchFilterProps) {
  const router = useRouter()
  const [search, setSearch] = useState(activeSearch ?? '')

  const navigate = useCallback(
    (cat?: string, q?: string) => {
      const params = new URLSearchParams()
      if (cat && cat !== 'All') params.set('category', cat)
      if (q?.trim()) params.set('search', q.trim())
      router.push(`/products?${params.toString()}`)
    },
    [router],
  )

  const handleClear = useCallback(() => {
    setSearch('')
    navigate(activeCategory, '')
  }, [activeCategory, navigate])

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative max-w-xl">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
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
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(activeCategory, search)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        />
        {search && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2" aria-label="Filter by category">
        {categories.map((cat) => {
          const isActive = (!activeCategory && cat === 'All') || activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => navigate(cat, search)}
              aria-pressed={isActive}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
