import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Check if user is authenticated
  const isAuth = Boolean(request.cookies.get('accessToken')?.value)
  const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path))
  // Redirect to login page if user is not authenticated
  if (isPrivatePath && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Redirect to manage page if user is authenticated and tries to access login page
  if (unAuthPaths.includes(pathname) && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue to the next middleware or the request handler
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login'],
}
