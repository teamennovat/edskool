import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()

  // Add user session to response headers
  if (session) {
    res.headers.set('x-user-id', session.user.id)
    res.headers.set('x-user-role', session.user.role || 'user')
  }

  return res
}
