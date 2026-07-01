'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsClientProps {
  categories: string[]
  activeCategory?: string
  activeSearch?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps raw DB category names to display labels shown in tabs.
 * Duplicates (same display label) are deduplicated — first occurrence wins.
 */
const DISPLAY_LABEL: Record<string, string> = {
  All: 'All',
  Mobiles: 'Smart Phones',
  'Smart Phones': 'Smart Phones',
  Wearables: 'Watches',
  Watches: 'Watches',
}

function getDisplayLabel(cat: string): string {
  return DISPLAY_LABEL[cat] ?? cat
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductsClient({
  categories,
  activeCategory,
  activeSearch,
}: ProductsClientProps) {
  const router = useRouter()

  const navigate = useCallback(
    (cat?: string, q?: string) => {
      const params = new URLSearchParams()
      if (cat && cat !== 'All') params.set('category', cat)
      if (q?.trim()) params.set('search', q.trim())
      router.push(`/products?${params.toString()}`)
    },
    [router],
  )

  // Deduplicate tabs by display label — keep first occurrence
  const tabs = categories.filter((cat, _idx, arr) => {
    const label = getDisplayLabel(cat)
    return arr.findIndex((c) => getDisplayLabel(c) === label) === _idx
  })

  return (
    <nav
      className="flex items-center border-b border-gray-100 overflow-x-auto"
      aria-label="Product category tabs"
    >
      {tabs.map((cat, idx) => {
        const isActive =
          (!activeCategory && cat === 'All') || activeCategory === cat

        return (
          <div key={cat} className="flex items-center">
            {idx > 0 && (
              <span className="text-gray-200 px-2 select-none" aria-hidden="true">
                |
              </span>
            )}
            <button
              onClick={() => navigate(cat, activeSearch)}
              aria-current={isActive ? 'page' : undefined}
              className={`px-2 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
              }`}
            >
              {getDisplayLabel(cat)}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
