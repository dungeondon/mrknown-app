import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlaceholderImage() {
  return (
    <div
      className="w-full h-full flex items-center justify-center text-gray-200"
      aria-hidden="true"
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 16l4.6-4.6 3 3L16 9l5 7H4zm-2 4h20V4H2v16z" />
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calcDiscount(product.price, product.original_price);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden rounded-t-xl">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <PlaceholderImage />
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">
            {product.category}
          </span>
          <div
            className="flex items-center gap-1"
            aria-label={`Rating: ${product.rating} out of 5`}
          >
            <span className="text-amber-400 text-xs" aria-hidden="true">
              ★
            </span>
            <span className="text-xs font-semibold text-gray-700">
              {product.rating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.review_count.toLocaleString()})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-1 mb-4">
          {product.tagline}
        </p>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.original_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
            Buy Now
          </span>
        </div>
      </div>
    </Link>
  );
}
