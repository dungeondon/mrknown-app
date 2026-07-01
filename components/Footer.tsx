import Link from 'next/link'

// ─── Constants ────────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/blogs', label: 'Blogs' },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 py-8 px-4 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          Copyright &copy; {year} by{' '}
          <Link href="/" className="font-bold text-gray-900 hover:text-orange-500 transition-colors">
            mrknown<span className="text-orange-500">.</span>
          </Link>
        </p>

        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="hover:text-orange-500 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
