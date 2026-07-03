import { getProductBySlug, getProducts } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";

// ─── Config ───────────────────────────────────────────────────────────────────

export const revalidate = 3600;

const RELATED_LIMIT = 3;
const THUMBNAIL_COUNT = 3;

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const categoryProducts = await getProducts(product.category);
  const related = categoryProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, RELATED_LIMIT);

  const discount = calcDiscount(product.price, product.original_price);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav
          className="flex items-center gap-1.5 text-sm text-gray-400"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <span className="text-orange-400 font-bold" aria-hidden="true">
            »
          </span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-orange-500 transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-orange-400 font-bold" aria-hidden="true">
            »
          </span>
          <span className="text-gray-700 line-clamp-1" aria-current="page">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* LEFT: Image + thumbnails */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-gray-200"
                  aria-hidden="true"
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 16l4.6-4.6 3 3L16 9l5 7H4zm-2 4h20V4H2v16z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails — same image repeated as a visual placeholder set */}
            {/* {product.image_url && (
              <div className="flex gap-3 mt-3">
                {Array.from({ length: THUMBNAIL_COUNT }, (_, i) => (
                  <button
                    key={i}
                    aria-label={`View image ${i + 1} of ${product.name}`}
                    className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      i === 0
                        ? "border-orange-400"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={product.image_url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )} */}
          </div>

          {/* RIGHT: Details */}
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <div
              className="flex items-center gap-1.5 mb-3"
              aria-label={`Rating: ${product.rating} out of 5`}
            >
              <span className="text-amber-400" aria-hidden="true">
                ★
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {product.rating}
              </span>
              <span className="text-sm text-gray-400">
                ({product.review_count.toLocaleString()})
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm mb-6">{product.tagline}</p>

            {/* About */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-1.5">
                About this product
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pros & Cons */}
            {(product.pros?.length > 0 || product.cons?.length > 0) && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.pros?.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 mb-2">
                      Pros
                    </h2>
                    <ul className="space-y-1.5">
                      {product.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-sm text-gray-600"
                        >
                          <span
                            className="text-green-500 flex-shrink-0"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.cons?.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 mb-2">
                      Cons
                    </h2>
                    <ul className="space-y-1.5">
                      {product.cons.map((con, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-sm text-gray-600"
                        >
                          <span
                            className="text-red-400 flex-shrink-0"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-900 mb-3">
                  Specifications
                </h2>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`grid grid-cols-2 px-4 py-2.5 text-sm ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <span className="text-orange-400 font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-gray-400 line-through text-sm">
                    ₹{product.original_price.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Buy CTA */}
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-3.5 rounded-full text-base transition-colors shadow-md shadow-orange-200"
            >
              Buy from Amazon
            </a>

            <p className="text-xs text-gray-400 mt-3">
              * We may earn a commission — at no extra cost to you.
            </p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="border-t border-gray-100 mt-4 pt-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              Related
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
