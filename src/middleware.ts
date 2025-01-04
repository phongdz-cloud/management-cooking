import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Check if user is authenticated
  const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path))
  // Redirect to login page if user is not authenticated
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (isPrivatePath && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to manage page if user is authenticated and tries to access login page
  if (unAuthPaths.includes(pathname) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Trường hợp đang nhập rồi, nhưng access token hết hạn
  if (isPrivatePath && !accessToken && refreshToken) {
    const url = new URL('/refresh-token', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Continue to the next middleware or the request handler
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login'],
}
