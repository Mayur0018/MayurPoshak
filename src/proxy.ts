import { type NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

export async function proxy(request: NextRequest) {
  // 1. Custom JWT Auth Check
  const token = request.cookies.get('token')?.value
  let jwtUser: any = null

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      jwtUser = payload;
    } catch (error) {
      console.error("JWT proxy error:", error);
    }
  }

  const user = jwtUser
  const role = jwtUser?.role

  // Protect sensitive routes
  const protectedPaths = ['/checkout', '/orders', '/wishlist', '/admin', '/profile']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/'))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Admin Role Check
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  if (isAdminPath && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export default proxy;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
