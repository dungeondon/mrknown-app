import { getProducts, getCategories } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import ProductsClient from "@/components/ProductsClient";
import type { Metadata } from "next";
import type { SearchParams } from "@/lib/types";

// ─── Config ───────────────────────────────────────────────────────────────────

export const revalidate = 3600;

const ITEMS_PER_PAGE = 6;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const category = searchParams.category;
  return {
    title: category ? `${category} — Products` : "All Products",
    description: category
      ? `Browse the best ${category} products, handpicked and reviewed.`
      : "Browse all curated product picks with honest reviews.",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category = searchParams.category;
  const search = searchParams.search;
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));

  const [products, categories] = await Promise.all([
    getProducts(category, search),
    getCategories(),
  ]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /** Build URL for pagination links, preserving active filters */
  function paginationUrl(p: number): string {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", String(p));
    return `/products?${params.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Category tabs */}
      <ProductsClient
        categories={["All", ...categories]}
        activeCategory={category}
        activeSearch={search}
      />

      {/* Results */}
      {paginated.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4" aria-hidden="true">
            🔍
          </p>
          <p className="text-lg font-semibold text-gray-600">
            No products found
          </p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {paginated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between mt-12 text-sm"
          aria-label="Pagination"
        >
          <a
            href={currentPage > 1 ? paginationUrl(currentPage - 1) : undefined}
            aria-disabled={currentPage <= 1}
            className={`text-gray-400 hover:text-gray-700 transition-colors ${
              currentPage <= 1 ? "pointer-events-none opacity-30" : ""
            }`}
          >
            Previous
          </a>

          <div className="flex items-center gap-1" role="list">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={paginationUrl(p)}
                role="listitem"
                aria-current={p === currentPage ? "page" : undefined}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-orange-500 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {p}
              </a>
            ))}
          </div>

          <a
            href={
              currentPage < totalPages
                ? paginationUrl(currentPage + 1)
                : undefined
            }
            aria-disabled={currentPage >= totalPages}
            className={`text-gray-400 hover:text-gray-700 transition-colors ${
              currentPage >= totalPages ? "pointer-events-none opacity-30" : ""
            }`}
          >
            Next
          </a>
        </nav>
      )}
    </div>
  );
}
