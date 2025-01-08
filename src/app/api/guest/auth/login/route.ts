import guestApiRequest from '@/app/apiRequests/guest'
import { HttpError } from '@/lib/http'
import { GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
export async function POST(request: Request) {
  // trả về request gửi lên
  const body = (await request.json()) as GuestLoginBodyType

  const cookieStore = await cookies()

  try {
    const { payload } = await guestApiRequest.sLogin(body)
    const { accessToken, refreshToken } = payload.data
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
    // Set cookie accessToken, refreshToken
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(payload)
  } catch (error) {
    console.log('error', error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status })
    } else {
      return Response.json({ message: 'Có lỗi xảy ra' }, { status: 500 })
    }
  }
}
