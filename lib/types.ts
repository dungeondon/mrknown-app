/**
 * Shared route-level types.
 *
 * Next.js 14 (pages router-style App Router conventions) passes searchParams
 * as a plain object of string | string[] | undefined. We narrow it here to
 * the shape this app actually uses, so every page agrees on the contract.
 */
export interface SearchParams {
  category?: string
  search?: string
  page?: string
}
