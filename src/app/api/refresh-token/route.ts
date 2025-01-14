import authApiRequest from '@/app/apiRequests/auth'
import guestApiRequest from '@/app/apiRequests/guest'
import { HttpError } from '@/lib/http'
import { decodeToken } from '@/lib/utils'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
export async function POST() {
  // trả về request gửi lên
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      { message: 'Không tìm thấy refreshToken' },
      { status: 401 }
    )
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    })
    const decodedAccessToken = decodeToken(payload.data.accessToken)
    const decodedRefreshToken = decodeToken(payload.data.refreshToken)
    // Set cookie accessToken, refreshToken
    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(payload)
  } catch (error: any) {
    console.log('error', error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status })
    } else {
      return Response.json(
        { message: error.message ?? 'Có lỗi xảy ra' },
        { status: 401 }
      )
    }
  }
}
