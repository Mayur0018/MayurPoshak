import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Existing Supabase Auth Check
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  // 2. Custom JWT Auth Check
  const token = request.cookies.get('token')?.value
  let jwtUser: any = null

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      jwtUser = payload;
    } catch (error) {
      console.error("JWT middleware error:", error);
    }
  }

  const user = supabaseUser || jwtUser
  const role = supabaseUser?.user_metadata?.role || jwtUser?.role

  // Protect sensitive routes
  const protectedPaths = ['/checkout', '/orders', '/wishlist', '/admin', '/profile']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/'))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/Signin'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Admin Role Check
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  if (isAdminPath && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
