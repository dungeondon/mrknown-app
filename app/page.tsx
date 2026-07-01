import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import HeroCarousel from '@/components/HeroCarousel'

export const revalidate = 3600

const STATS = [
  { label: 'Best Home Appliances', count: '120+', unit: 'Products' },
  { label: 'Best Mobile Phones', count: '180+', unit: 'Mobiles' },
  { label: 'Best Wearables', count: '50+', unit: 'Devices' },
  { label: 'Others', count: '1500+', unit: 'Products' },
]

const CATEGORIES = [
  'Mobiles', 'Home Appliances', 'Wearables', 'Music',
  'Health & Lifestyle', 'Kitchen', 'Home Decors', 'Garden', 'Babies & Kids',
]

const TESTIMONIALS = [
  {
    name: 'Mounika Arrala',
    location: 'Hyderabad | Mar 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face',
    text: 'I got the best Front Load Washing Machine, I am very happy with this choice. This appliance has truly elevated my laundry routine to a whole new level. The cleaning performance is outstanding, my clothes come out looking and smelling fresh every time.',
  },
]

const TESTIMONIAL_PHOTOS = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop',
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div className="bg-white">

      {/* ─── HERO ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 border border-dashed border-orange-300 text-orange-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              Best in the market
              <span>🇮🇳</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Find the best from{' '}
              <span className="text-orange-500">mrknown</span>{' '}
              before you buy
            </h1>

            <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
              Curated picks across headphones, tablets, wearables, and more.. with honest pros, cons, and direct buy links.
            </p>

            <Link href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-colors">
              Browse all best products
            </Link>
          </div>

          {/* Right: Carousel */}
          <HeroCarousel />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-gray-100 bg-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(({ label, count, unit }) => (
              <div key={label} className="px-6 py-5">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-3xl font-extrabold text-orange-500 leading-none">{count}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PICKS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-extrabold text-gray-900">Featured picks</h2>
          <Link href="/products"
            className="bg-gray-900 hover:bg-gray-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-colors">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.slice(0, 3).map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="block">
              <ProductCard product={p} />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="bg-gray-50 py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Shop by category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-orange-400 hover:text-orange-500 transition-colors shadow-sm">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">Our happy customers talk</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Photo left */}
          <div className="rounded-2xl overflow-hidden aspect-square relative">
            <Image src={TESTIMONIAL_PHOTOS[0]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>

          {/* Testimonial card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={TESTIMONIALS[0].avatar} alt={TESTIMONIALS[0].name} fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{TESTIMONIALS[0].name}</p>
                <p className="text-xs text-gray-400">{TESTIMONIALS[0].location}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{TESTIMONIALS[0].text}</p>
            {/* Pagination dot */}
            <div className="flex gap-1.5 mt-5">
              <span className="w-5 h-1 bg-orange-500 rounded-full" />
              <span className="w-1.5 h-1 bg-gray-200 rounded-full" />
              <span className="w-1.5 h-1 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* Photos right */}
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-video relative">
              <Image src={TESTIMONIAL_PHOTOS[1]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video relative">
              <Image src={TESTIMONIAL_PHOTOS[2]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
