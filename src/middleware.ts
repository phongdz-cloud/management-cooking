import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
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
    const url = new URL('/login', request.url)
    url.searchParams.set('clearToken', 'true')
    return NextResponse.redirect(url)
  }

  // Trường hợp đã đăng nhập
  if (refreshToken) {
    // Nếu cố tình vào trang login thì sẽ chuyễn về trang chủ
    // Redirect to manage page if user is authenticated and tries to access login page
    if (unAuthPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Trường hợp đang nhập rồi, nhưng access token hết hạn
    if (isPrivatePath && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path))
    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Continue to the next middleware or the request handler
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login'],
}
