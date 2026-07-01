import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Config ───────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DUPLICATE_KEY_ERROR_CODE = '23505'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let email: unknown

  try {
    const body = await req.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim() })

    if (error) {
      if (error.code === DUPLICATE_KEY_ERROR_CODE) {
        return NextResponse.json({ error: 'Already subscribed!' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter] subscribe failed:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
